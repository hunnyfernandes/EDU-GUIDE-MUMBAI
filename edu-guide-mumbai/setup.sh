#!/bin/bash

# Edu Guide Mumbai - Quick Setup Script
# This script helps you set up the project quickly

echo "============================================"
echo "  Edu Guide Mumbai - Quick Setup"
echo "============================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js is installed$(NC)"
echo "  Version: $(node -v)"
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}Warning: MySQL command not found${NC}"
    echo "Make sure MySQL is installed and running"
    echo ""
fi

# Backend Setup
echo "============================================"
echo "  Setting up Backend"
echo "============================================"
echo ""

cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠ Please update .env with your configuration${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo ""
echo "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install backend dependencies${NC}"
    exit 1
fi

cd ..

# Frontend Setup
echo ""
echo "============================================"
echo "  Setting up Frontend"
echo "============================================"
echo ""

cd frontend

echo "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install frontend dependencies${NC}"
    exit 1
fi

cd ..

# Database Setup Instructions
echo ""
echo "============================================"
echo "  Database Setup"
echo "============================================"
echo ""
echo "To set up the database, run the following commands:"
echo ""
echo "  mysql -u root -p"
echo "  source $(pwd)/database/schema.sql"
echo "  source $(pwd)/database/sample_data.sql"
echo ""

# Final Instructions
echo "============================================"
echo "  Setup Complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Update backend/.env with your configuration"
echo "   - Database credentials"
echo "   - JWT secret"
echo ""
echo "2. Set up the database (see instructions above)"
echo ""
echo "3. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "4. Start the frontend server (in a new terminal):"
echo "   cd frontend && npm start"
echo ""
echo "5. Access the application at http://localhost:3000"
echo ""
echo -e "${GREEN}Happy coding! 🎓${NC}"
echo ""
