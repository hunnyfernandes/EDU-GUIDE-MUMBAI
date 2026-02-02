# =============================================================================
# EduGuide Mumbai - Automated Deployment Script (Windows PowerShell)
# =============================================================================
# This script automates the deployment process for frontend
# Make sure you have Netlify CLI installed: npm install -g netlify-cli
# =============================================================================

Write-Host "🚀 Starting EduGuide Mumbai Deployment..." -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""

# =============================================================================
# STEP 1: Check Prerequisites
# =============================================================================

Write-Host "Step 1: Checking Prerequisites..." -ForegroundColor Cyan

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "✗ Node.js is not installed" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Node.js found" -ForegroundColor Green

# Check if Netlify CLI is installed
if (-not (Get-Command netlify -ErrorAction SilentlyContinue)) {
    Write-Host "✗ Netlify CLI is not installed" -ForegroundColor Red
    Write-Host "Installing Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
}
Write-Host "✓ Netlify CLI found" -ForegroundColor Green
Write-Host ""

# =============================================================================
# STEP 2: Build Frontend
# =============================================================================

Write-Host "Step 2: Building Frontend..." -ForegroundColor Cyan

Set-Location "frontend"

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Creating production build..." -ForegroundColor Yellow
npm run build

if (Test-Path "build" -PathType Container) {
    Write-Host "✓ Frontend build successful" -ForegroundColor Green
    Get-ChildItem "build" | ForEach-Object {
        Write-Host "  - $($_.Name)"
    }
} else {
    Write-Host "✗ Frontend build failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# =============================================================================
# STEP 3: Deploy to Netlify
# =============================================================================

Write-Host "Step 3: Deploying to Netlify..." -ForegroundColor Cyan
Write-Host "Please log in to Netlify when prompted..." -ForegroundColor Yellow
Write-Host ""

netlify deploy --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Frontend deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Netlify deployment failed" -ForegroundColor Red
    exit 1
}

Set-Location ".."
Write-Host ""

# =============================================================================
# STEP 4: Display Backend Deployment Instructions
# =============================================================================

Write-Host "Step 4: Backend Deployment (Manual)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your frontend is now deployed! Now you need to deploy the backend." -ForegroundColor Yellow
Write-Host ""
Write-Host "Option A: Render (Recommended)" -ForegroundColor Yellow
Write-Host "  1. Go to https://render.com"
Write-Host "  2. Create a new Web Service"
Write-Host "  3. Connect your GitHub repository"
Write-Host "  4. Configure:"
Write-Host "     - Name: edu-guide-mumbai-backend"
Write-Host "     - Root Directory: backend"
Write-Host "     - Build Command: npm install"
Write-Host "     - Start Command: npm start"
Write-Host "  5. Add environment variables (see DEPLOYMENT_STEPS.md)"
Write-Host ""

Write-Host "Option B: Railway" -ForegroundColor Yellow
Write-Host "  1. Go to https://railway.app"
Write-Host "  2. Create a new project"
Write-Host "  3. Follow Railway's deployment instructions"
Write-Host ""

Write-Host "Option C: Heroku" -ForegroundColor Yellow
Write-Host "  1. Go to https://heroku.com"
Write-Host "  2. Create a new app"
Write-Host "  3. Connect your GitHub repository"
Write-Host "  4. Set environment variables"
Write-Host ""

# =============================================================================
# STEP 5: Summary
# =============================================================================

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✓ Frontend Deployment Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

Write-Host "📌 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Deploy backend (see options above)"
Write-Host "2. Get your backend API URL"
Write-Host "3. Add REACT_APP_API_URL to Netlify environment variables"
Write-Host "4. Test all features on your live site"
Write-Host "5. Monitor logs and performance"
Write-Host ""

Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "  - DEPLOYMENT_STEPS.md (Quick start guide)"
Write-Host "  - DEPLOYMENT_READY.md (Complete checklist)"
Write-Host "  - DEPLOYMENT_GUIDE.md (Detailed instructions)"
Write-Host ""

# Ask to open site in browser
$choice = Read-Host "Would you like to open your site in the browser? (y/n)"
if ($choice -eq 'y' -or $choice -eq 'Y') {
    Write-Host "Opening site in browser..." -ForegroundColor Green
    Write-Host ""
    Write-Host "Your Netlify dashboard: https://app.netlify.com/sites" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🎉 Your frontend is now live!" -ForegroundColor Green
Write-Host ""
