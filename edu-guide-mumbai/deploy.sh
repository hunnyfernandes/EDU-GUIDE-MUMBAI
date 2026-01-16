#!/bin/bash

# =============================================================================
# EduGuide Mumbai - Automated Deployment Script
# =============================================================================
# This script automates the deployment process for both frontend and backend
# Make sure you have Netlify CLI and necessary credentials set up
# =============================================================================

echo "🚀 Starting EduGuide Mumbai Deployment..."
echo "==========================================="

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# =============================================================================
# STEP 1: Frontend Deployment to Netlify
# =============================================================================

echo -e "${BLUE}Step 1: Deploying Frontend to Netlify...${NC}"

cd "frontend" || exit

# Build frontend
echo -e "${YELLOW}Building frontend...${NC}"
npm run build

if [ -d "build" ]; then
  echo -e "${GREEN}✓ Frontend build successful${NC}"
else
  echo -e "${RED}✗ Frontend build failed${NC}"
  exit 1
fi

# Deploy to Netlify
echo -e "${YELLOW}Uploading to Netlify...${NC}"
netlify deploy --prod

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Frontend deployed successfully${NC}"
  
  # Get site URL
  SITE_URL=$(netlify env:get SITE_URL 2>/dev/null)
  if [ -z "$SITE_URL" ]; then
    read -p "Enter your Netlify site URL (e.g., https://your-site.netlify.app): " SITE_URL
  fi
  echo -e "${GREEN}Frontend URL: ${SITE_URL}${NC}"
else
  echo -e "${RED}✗ Frontend deployment failed${NC}"
  exit 1
fi

cd ..

# =============================================================================
# STEP 2: Backend Deployment Instructions
# =============================================================================

echo ""
echo -e "${BLUE}Step 2: Backend Deployment to Render${NC}"
echo -e "${YELLOW}Please follow these steps manually:${NC}"
echo ""
echo "1. Go to https://render.com and sign in"
echo "2. Create a new Web Service"
echo "3. Configure:"
echo "   - Name: edu-guide-mumbai-backend"
echo "   - Root Directory: backend"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo ""
echo "4. Add these environment variables:"
echo "   - NODE_ENV: production"
echo "   - DB_HOST: your-database-host"
echo "   - DB_USER: your-database-user"
echo "   - DB_PASSWORD: your-database-password"
echo "   - DB_NAME: edu_guide_mumbai"
echo "   - JWT_SECRET: your-secure-random-string"
echo "   - CLIENT_URL: $SITE_URL"
echo ""
echo -e "${GREEN}After backend is deployed, note the backend URL and update:${NC}"
echo "   - REACT_APP_API_URL in Netlify environment variables"
echo ""

# =============================================================================
# STEP 3: Summary
# =============================================================================

echo ""
echo -e "${GREEN}==========================================="
echo "✓ Deployment Process Complete!"
echo "==========================================${NC}"
echo ""
echo "📌 Important Next Steps:"
echo "1. Deploy backend to Render (see instructions above)"
echo "2. Update REACT_APP_API_URL in Netlify with your backend URL"
echo "3. Test all features on your live site"
echo "4. Set up monitoring and error tracking"
echo ""
echo -e "${GREEN}Frontend is live at: ${SITE_URL}${NC}"
echo ""
echo "For more information, see:"
echo "  - DEPLOYMENT_STEPS.md"
echo "  - DEPLOYMENT_READY.md"
echo "  - DEPLOYMENT_GUIDE.md"
echo ""

# =============================================================================
# STEP 4: Optional - Test the deployment
# =============================================================================

read -p "Would you like to open the frontend in your browser? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  if command -v start &> /dev/null; then
    start "$SITE_URL"  # Windows
  elif command -v open &> /dev/null; then
    open "$SITE_URL"   # macOS
  elif command -v xdg-open &> /dev/null; then
    xdg-open "$SITE_URL"  # Linux
  fi
fi

echo -e "${GREEN}Done! Your application is now live! 🎉${NC}"
