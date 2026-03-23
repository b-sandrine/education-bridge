#!/bin/bash

# EduBridge Complete Stack Setup Script
# This script helps set up and run all components of the EduBridge system

echo "================================"
echo "EduBridge Stack Setup Assistant"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Function to setup a service
setup_service() {
    local service_name=$1
    local service_path=$2
    
    echo "Setting up $service_name..."
    cd "$service_path" || exit 1
    
    if [ -f "package.json" ]; then
        npm install
        echo "✅ $service_name setup complete"
    else
        echo "❌ package.json not found in $service_path"
    fi
    
    echo ""
}

# Get the base path
BASE_PATH=$(pwd)

# Setup Backend
read -p "Setup Backend API? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    setup_service "Backend API" "$BASE_PATH/backend"
fi

# Setup Web Frontend
read -p "Setup Web Frontend? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    setup_service "Web Frontend" "$BASE_PATH/web"
fi

# Setup Mobile App
read -p "Setup Mobile App? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    setup_service "Mobile App" "$BASE_PATH/mobile"
fi

# Setup USSD Gateway
read -p "Setup USSD Gateway? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    setup_service "USSD Gateway" "$BASE_PATH/ussd"
fi

echo ""
echo "================================"
echo "Setup Instructions"
echo "================================"
echo ""
echo "Before running the services, you need to:"
echo ""
echo "1. Set up PostgreSQL database:"
echo "   createdb edubridge"
echo "   psql edubridge < backend/src/database/schema.sql"
echo ""
echo "2. Create .env files:"
echo ""
echo "   Backend (.env):"
echo "   - Copy backend/.env.example to backend/.env"
echo "   - Configure DB credentials"
echo "   - Set JWT_SECRET"
echo "   - Add AI service API keys"
echo ""
echo "   Web (.env.local):"
echo "   - VITE_API_URL=http://localhost:3000/api"
echo ""
echo "   Mobile (.env):"
echo "   - EXPO_PUBLIC_API_URL=http://localhost:3000/api"
echo ""
echo "   USSD (.env):"
echo "   - USSD_PORT=3001"
echo "   - USSD_API_URL=http://localhost:3000/api"
echo ""
echo "================================"
echo "Running Services"
echo "================================"
echo ""
echo "In separate terminal windows, run:"
echo ""
echo "Backend:"
echo "  cd backend && npm run dev"
echo ""
echo "Web Frontend:"
echo "  cd web && npm run dev"
echo ""
echo "Mobile App:"
echo "  cd mobile && npm start"
echo ""
echo "USSD Gateway:"
echo "  cd ussd && npm start"
echo ""
echo "================================"
echo "Testing the Stack"
echo "================================"
echo ""
echo "Backend Health Check:"
echo "  curl http://localhost:3000/api/health"
echo ""
echo "Register a User:"
echo "  curl -X POST http://localhost:3000/api/auth/register \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@example.com\",\"password\":\"password123\",\"role\":\"student\"}'"
echo ""
echo "Login:"
echo "  curl -X POST http://localhost:3000/api/auth/login \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"email\":\"john@example.com\",\"password\":\"password123\"}'"
echo ""
echo "Get Courses:"
echo "  curl http://localhost:3000/api/content/courses"
echo ""
echo "Web App:"
echo "  Open http://localhost:5173 in your browser"
echo ""
echo "USSD Test:"
echo "  curl -X POST http://localhost:3001/ussd \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"phoneNumber\":\"+250123456789\",\"text\":\"\"}'"
echo ""
echo "================================"
echo "Documentation"
echo "================================"
echo ""
echo "See IMPLEMENTATION_SUMMARY.md for complete documentation"
echo "See individual README.md files for service-specific details"
echo ""
