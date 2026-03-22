# EduBridge Deployment Guide

Step-by-step guide for deploying EduBridge to production.

## Deployment Architecture

### Development
- Single server setup
- Local databases
- HTTP protocol

### Staging
- Load-balanced backend servers
- Managed database service
- HTTPS with self-signed certificate
- Basic monitoring

### Production
- Multi-zone deployment
- Managed PostgreSQL with replicas
- Redis cluster for caching
- CDN for static assets
- Advanced monitoring and logging
- Auto-scaling groups
- Database backups

## Prerequisites

- AWS Account (or alternative cloud provider)
- Docker and Docker Compose
- PostgreSQL 12+
- Redis 6+
- Node.js 16+
- SSL certificates
- Domain name

## 1. Prepare Infrastructure

### AWS EC2 Setup

**Backend Server**
```bash
# Create EC2 instance
- AMI: Ubuntu 22.04 LTS
- Instance type: t3.medium (minimum)
- Storage: 30GB SSD
- Security group: Allow 22, 80, 443, 3000
```

**Database Server**
```bash
# Use AWS RDS PostgreSQL
- Engine: PostgreSQL 14
- Instance class: db.t3.small
- Multi-AZ: Enabled
- Backup retention: 30 days
- Storage: 100GB, auto-scaling enabled
```

**Redis Cache**
```bash
# Use AWS ElastiCache
- Engine: Redis 6.x
- Node type: cache.t3.micro
- Multi-AZ: Enabled
- Automatic failover: Enabled
```

### Network Configuration

```
Internet
   ↓
CloudFlare DNS
   ↓
AWS Route 53
   ↓
Application Load Balancer
   ↓
EC2 Backend Servers
   ↓
RDS Database
   ↓
ElastiCache Redis
```

## 2. Database Setup

### Create Database

```bash
# SSH into database instance or use RDS console
psql -h your-rds-endpoint.amazonaws.com -U postgres

# Create database and user
CREATE DATABASE edubridge_prod;
CREATE USER edubridge_app WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE edubridge_prod TO edubridge_app;
```

### Run Schema

```bash
# From your local machine
psql -h your-rds-endpoint.amazonaws.com -U edubridge_app -d edubridge_prod -f database/schema.sql
```

### Verify Setup

```bash
psql -h your-rds-endpoint.amazonaws.com -U edubridge_app -d edubridge_prod -c "SELECT version();"
```

## 3. Backend Deployment

### Prepare Server

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-instance.amazonaws.com

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install other dependencies
sudo apt install -y git nginx supervisor

# Install Docker (optional)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Clone and Setup Repository

```bash
# Clone repository
cd /home/ubuntu
git clone https://github.com/your-repo/education-bridge.git
cd education-bridge/backend

# Install dependencies
npm install --production

# Create environment file
cp .env.example .env
# Edit .env with production values
nano .env
```

### Configure Environment Variables

```env
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Database
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=5432
DB_NAME=edubridge_prod
DB_USER=edubridge_app
DB_PASSWORD=strong_password_here

# Redis
REDIS_HOST=your-redis-endpoint.amazonaws.com
REDIS_PORT=6379

# JWT
JWT_SECRET=very_long_random_string_change_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=another_very_long_random_string
JWT_REFRESH_EXPIRE=30d

# AI Service
AI_SERVICE_PROVIDER=openai
AI_API_KEY=sk-...
AI_MODEL=gpt-4

# Email
SENDGRID_API_KEY=SG...

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=edubridge-content-prod

# Security
CORS_ORIGIN=https://edubridge.rw,https://www.edubridge.rw
```

### Using PM2 for Process Management

```bash
# Install PM2 globally
sudo npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'edubridge-api',
    script: './src/server.js',
    instances: 4,
    exec_mode: 'cluster',
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: 'logs/error.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
}
EOF

# Start application with PM2
pm2 start ecosystem.config.js

# Make PM2 start on system reboot
pm2 startup
pm2 save
```

### Using Docker (Alternative)

```bash
# Build Docker image
cd education-bridge/backend
docker build -t edubridge-api:1.0.0 .

# Run container
docker run -d \
  --name edubridge-api \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=your-rds-endpoint \
  -e DB_USER=edubridge_app \
  -e DB_PASSWORD=password \
  -e JWT_SECRET=secret \
  edubridge-api:1.0.0

# Update on new deployments
docker pull edubridge-api:latest
docker stop edubridge-api
docker rm edubridge-api
docker run -d ... edubridge-api:latest
```

## 4. Web Frontend Deployment

### Build Frontend

```bash
cd education-bridge/web

# Install dependencies
npm install --production

# Build for production
npm run build

# Output in dist/ folder
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel --prod
```

### Deploy to AWS CloudFront

```bash
# Create S3 bucket
aws s3 mb s3://edubridge-web-prod

# Upload build files
aws s3 sync dist/ s3://edubridge-web-prod --delete

# Create CloudFront distribution
# Use AWS Console or CloudFormation

# Invalidate cache after updates
aws cloudfront create-invalidation \
  --distribution-id YOURDISTRIBUTIONID \
  --paths "/*"
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name edubridge.rw www.edubridge.rw;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name edubridge.rw www.edubridge.rw;
    
    ssl_certificate /etc/letsencrypt/live/edubridge.rw/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/edubridge.rw/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # SPA routing
    location / {
        root /var/www/edubridge/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

## 5. SSL Certificate Setup

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --webroot -w /var/www/edubridge \
  -d edubridge.rw \
  -d www.edubridge.rw

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Certificate Renewal

```bash
# Manual renewal
sudo certbot renew --dry-run

# Automatic renewal (cron job)
0 3 * * * /usr/bin/certbot renew --noninteractive
```

## 6. Monitoring & Logging

### Install Monitoring Tools

```bash
# DataDog Agent
DD_AGENT_MAJOR_VERSION=7 DD_API_KEY=your_api_key \
DD_SITE=datadoghq.com bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_agent.sh)"

# Alternatively: New Relic
curl -Ls https://download.newrelic.com/install/newrelic-cli/scripts/install.sh | bash
```

### CloudWatch Monitoring (AWS)

```bash
# View logs
aws logs tail /aws/ec2/edubridge-api --follow

# Create alarm for high CPU
aws cloudwatch put-metric-alarm \
  --alarm-name edubridge-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

### Application Logging

```bash
# Check PM2 logs
pm2 logs edubridge-api

# View Docker logs
docker logs -f edubridge-api

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 7. Backup & Disaster Recovery

### Database Backups

```bash
# Automated daily backups (using AWS RDS)
# Configured in RDS console: Backup retention = 30 days

# Manual backup
aws rds create-db-snapshot \
  --db-instance-identifier edubridge-prod \
  --db-snapshot-identifier edubridge-prod-snapshot-$(date +%Y%m%d)

# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier edubridge-prod-restored \
  --db-snapshot-identifier edubridge-prod-snapshot-20240120
```

### Application Backups

```bash
# Backup S3 data
aws s3 sync s3://edubridge-content-prod /backups/s3-backup/

# Database export
pg_dump -h your-rds-endpoint -U edubridge_app \
  edubridge_prod > edubridge_prod_backup_$(date +%Y%m%d).sql
```

## 8. Performance Optimization

### Database Connection Pooling

```javascript
// In backend config
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
```

### Redis Caching

```javascript
// Cache course list
const cacheKey = `courses:page:${page}:limit:${limit}`
const cached = await redis.get(cacheKey)

if (cached) {
  return JSON.parse(cached)
}

const data = await db.courses.find(...)
await redis.setex(cacheKey, 3600, JSON.stringify(data))
return data
```

### CDN Configuration

```bash
# CloudFlare settings
- Universal SSL enabled
- Caching level: Cache everything
- Browser cache TTL: 1 year for static files
- Page Rules: Cache static assets
```

## 9. Security Hardening

### Firewall Rules

```bash
# Allow only necessary ports
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
```

### Server Security

```bash
# Disable password authentication
sudo sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Enable auto-updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### Application Security

```javascript
// Use security middleware
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN.split(','),
  credentials: true
}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use('/api/', limiter)
```

## 10. Deployment Checklist

- [ ] Infrastructure provisioned (EC2, RDS, ElastiCache)
- [ ] Security groups configured
- [ ] Database created and schema loaded
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Backend deployed and running
- [ ] Frontend built and deployed
- [ ] DNS records updated
- [ ] Monitoring and alerting configured
- [ ] Backup procedures tested
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Team trained on deployment process

## 11. Rollback Procedure

### Quick Rollback

```bash
# Using PM2
pm2 delete edubridge-api
git checkout previous-version
npm install
pm2 start ecosystem.config.js

# Using Docker
docker rollback edubridge-api previous-version
```

### Database Rollback

```bash
# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier edubridge-prod-rollback \
  --db-snapshot-identifier last-good-snapshot

# Update security group to point to new instance
```

## 12. Performance Benchmarks

Target metrics:

- **Page Load Time**: < 3 seconds
- **API Response Time**: < 500ms
- **Database Query Time**: < 100ms
- **99th percentile latency**: < 2 seconds
- **Error rate**: < 0.1%
- **Uptime**: 99.95%

## 13. Post-Deployment

### Testing

```bash
# Health check
curl https://edubridge.rw/api/v1/health

# Load testing
ab -n 1000 -c 100 https://edubridge.rw/

# Security testing
npm run security-audit
```

### Monitoring

- Check error rates in monitoring dashboard
- Review performance metrics
- Monitor database queries
- Check cache hit rates
- Review user feedback

## 14. Scaling Strategy

### Horizontal Scaling

```bash
# Add more backend servers behind load balancer
# Update auto-scaling group configuration
aws autoscaling update-auto-scaling-group \
  --auto-scaling-group-name edubridge-asg \
  --min-size 2 \
  --desired-capacity 3 \
  --max-size 10
```

### Vertical Scaling

```bash
# Upgrade instance type (requires downtime)
# For RDS: Modify instance class in RDS console
# For ElastiCache: Upgrade node type
```

---

## Support & Documentation

- **Runbooks**: See `/docs/runbooks/`
- **Troubleshooting**: See `/docs/troubleshooting.md`
- **On-call Process**: See `/docs/on-call.md`

---

**Last Updated**: 2026-01-25  
**Version**: 1.0.0
