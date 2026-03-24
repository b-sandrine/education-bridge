# Quick Start: Creating Your First Admin Account

## First Time Setup (5 minutes)

### Step 1: Generate Admin Secret Key
Open your terminal and run:
```bash
openssl rand -hex 32
```

This will output something like:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0
```

### Step 2: Set Up Environment Variable
In your `backend/.env` file, add:
```env
ADMIN_SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0
```

### Step 3: Ensure Backend is Running
Make sure your backend server is running:
```bash
cd backend
npm install
npm start
```

It should be accessible at `http://localhost:3000`

## Creating an Admin Account

### Option A: Using the Helper Script (Easiest)

```bash
cd backend
node scripts/create-admin.js
```

This will prompt you for:
- Email
- First name
- Last name
- Password

Or provide all details at once:
```bash
node scripts/create-admin.js \
  --email admin@example.com \
  --firstName Admin \
  --lastName User \
  --password YourPassword123
```

### Option B: Using cURL

```bash
curl -X POST http://localhost:3000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -H "X-Admin-Secret: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "password": "SecurePassword123!"
  }'
```

### Option C: Using Postman

1. Create a new POST request
2. URL: `http://localhost:3000/api/auth/create-admin`
3. Go to Headers tab and add:
   - Header: `X-Admin-Secret`
   - Value: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0`

4. Go to Body tab (select raw, JSON format):
```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}
```

5. Click Send

## Logging In as Admin

1. Go to the web app: `http://localhost:5173`
2. Click "Login"
3. Enter the admin email and password you just created
4. You'll be redirected to the Admin Dashboard

## What Can Admins Do?

Once logged in as an admin, you can:
- **View All Courses**: See all courses in the system
- **Delete Courses**: Remove courses from the system
- **View System Statistics**: 
  - Total courses
  - Total educators
  - Active users
  - Total enrollments

## Troubleshooting

### "Missing X-Admin-Secret header"
- Make sure you're sending the header exactly as shown
- Header name: `X-Admin-Secret`
- Header value: Your secret key from the .env file

### "Invalid admin secret key"
- The secret key in your header doesn't match the one in your .env file
- Copy the exact value from your .env file
- Make sure there are no extra spaces

### "User with this email already exists"
- An admin with this email is already created
- Use a different email address

### "Cannot connect to API"
- Make sure the backend server is running on port 3000
- Check that `NODE_ENV` is not set to production
- Verify your API_URL is correct (should be `http://localhost:3000/api`)

### Server not starting?
```bash
cd backend
npm install
npm start
```

If you get database connection errors:
- Check that PostgreSQL is running
- Verify DATABASE_URL in your .env file
- Run: `npm run db:init` to initialize the database

## Security Notes

⚠️ **Important Security Reminders:**

1. **Never share your ADMIN_SECRET_KEY**
   - Treat it like a password
   - Don't commit it to git
   - Use different keys for different environments

2. **Use HTTPS in Production**
   - Always use HTTPS when deploying to production
   - Never send the secret key over HTTP

3. **Secure Your Password**
   - Use a strong admin password (minimum 8 characters)
   - Include numbers, letters, and special characters
   - Example: `MyS3cur3@dmin!Pass`

4. **Change the Secret Periodically**
   - Rotate your admin secret key every 3-6 months in production
   - Store the old key temporarily in case you need it

## Next Steps

- Create educator accounts (educators can self-register or use the registration form)
- Create student accounts (students can self-register or use the registration form)
- Review [ADMIN_CREATION.md](./ADMIN_CREATION.md) for more detailed technical information

For complete API documentation, see [docs/API.md](../docs/API.md)
