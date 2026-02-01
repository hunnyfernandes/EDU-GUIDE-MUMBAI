# Edu Guide Mumbai - College Information System

A comprehensive web-based platform designed to assist students in making informed decisions about higher education in Mumbai. The system provides centralized college information with search, comparison, reviews, and detailed college profiles.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Design System](#design-system)

## 🎯 Overview

Edu Guide Mumbai is a full-stack web application that replicates and enhances educational guidance platforms. It enables students to:

- Search and explore colleges across multiple streams
- View detailed college profiles with admission info, fees, facilities, and placements
- Read and submit verified reviews
- Compare colleges side-by-side
- Save favorite colleges for later reference
- Access admin dashboard for content management

## ✨ Features

### For Students

- **Advanced Search & Filters**: Search by name, stream, college type, rating, and fees
- **Detailed College Profiles**: Complete information including:
  - Admission process and cutoff trends
  - Fee structure and course details
  - Facilities and infrastructure
  - Placement records
  - Student reviews and ratings
- **College Comparison**: Side-by-side comparison of up to 4 colleges
- **Review System**: Read verified reviews and submit your own
- **Saved Colleges**: Bookmark colleges for easy access
- **User Dashboard**: Track saved colleges and submitted reviews

### For Administrators

- **Dashboard Analytics**: View statistics and key metrics
- **College Management**: Add, update, or remove colleges
- **Review Moderation**: Approve or reject user-submitted reviews
- **User Management**: View and manage registered users
- **Content Control**: Full control over college information

### Technical Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **JWT Authentication**: Secure user authentication and authorization
- **RESTful API**: Well-structured backend API
- **Real-time Search**: Autocomplete search functionality
- **Pagination**: Efficient handling of large datasets
- **Error Handling**: Comprehensive error handling and validation

## 🛠 Technology Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Zustand** - State management
- **React Hot Toast** - Notifications
- **Heroicons** - SVG icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Helmet** - Security middleware
- **Express Rate Limit** - API rate limiting

## 📁 Project Structure

```
edu-guide-mumbai/
├── frontend/                    # React frontend application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   └── CollegeCard.js
│   │   ├── pages/               # Page components
│   │   │   ├── HomePage.js
│   │   │   ├── CollegesPage.js  # (To be implemented)
│   │   │   ├── CollegeDetailPage.js
│   │   │   ├── ComparePage.js
│   │   │   ├── DashboardPage.js
│   │   │   └── AdminDashboard.js
│   │   ├── services/            # API services
│   │   │   └── api.js
│   │   ├── context/             # State management
│   │   │   └── store.js
│   │   ├── styles/              # CSS styles
│   │   │   └── index.css
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                     # Node.js backend application
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/             # Request handlers
│   │   ├── authController.js
│   │   ├── collegeController.js
│   │   ├── reviewController.js
│   │   ├── userController.js
│   │   └── adminController.js
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/                  # Database models (optional)
│   ├── routes/                  # API routes
│   │   ├── authRoutes.js
│   │   ├── collegeRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   ├── .env.example             # Environment variables template
│   ├── server.js                # Application entry point
│   └── package.json
│
└── database/                    # Database scripts
    ├── schema.sql               # Database schema
    └── sample_data.sql          # Sample data

```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd edu-guide-mumbai
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your configuration
# Update DB credentials and JWT secret
```

**Backend .env Configuration:**

```env
PORT=5002
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=edu_guide_mumbai
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file (optional)
# Add REACT_APP_API_URL=http://localhost:5002/api
```

## 🗄 Database Setup

### 1. Create Database

```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source /path/to/edu-guide-mumbai/database/schema.sql

# Load sample data (optional)
source /path/to/edu-guide-mumbai/database/sample_data.sql
```

### 2. Database Schema

The database includes the following main tables:

- **users** - User accounts (students and admins)
- **colleges** - College information
- **streams** - Academic streams (Commerce, Arts, Science, etc.)
- **courses** - Courses offered by colleges
- **facilities** - College facilities
- **reviews** - User reviews and ratings
- **saved_colleges** - Bookmarked colleges
- **admission_info** - Admission details
- **placements** - Placement records

## ▶️ Running the Application

### Start Backend Server

```bash
cd backend
npm run dev  # Development mode with nodemon
# OR
npm start    # Production mode
```

Backend will run on `http://localhost:5002`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

Frontend will run on `http://localhost:3000`

### Default Admin Account

After loading sample data, you can login with:
- **Email**: admin@eduguide.com
- **Password**: Use bcrypt to hash your password and update in the database

## 📡 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/me              - Get current user (Protected)
PUT    /api/auth/profile         - Update profile (Protected)
PUT    /api/auth/change-password - Change password (Protected)
```

### College Endpoints

```
GET    /api/colleges              - Get all colleges with filters
GET    /api/colleges/:id          - Get college details
GET    /api/colleges/featured     - Get featured colleges
POST   /api/colleges/compare      - Compare colleges
GET    /api/colleges/search/autocomplete - Autocomplete search
```

### Review Endpoints

```
GET    /api/reviews/college/:collegeId - Get college reviews
POST   /api/reviews                    - Create review (Protected)
GET    /api/reviews/my-reviews         - Get user's reviews (Protected)
PUT    /api/reviews/:id                - Update review (Protected)
DELETE /api/reviews/:id                - Delete review (Protected)
PUT    /api/reviews/:id/helpful        - Mark helpful
```

### User Endpoints

```
GET    /api/user/dashboard              - Get dashboard stats (Protected)
POST   /api/user/saved-colleges         - Save college (Protected)
GET    /api/user/saved-colleges         - Get saved colleges (Protected)
DELETE /api/user/saved-colleges/:id     - Remove saved college (Protected)
GET    /api/user/saved-colleges/check/:id - Check if saved (Protected)
```

### Admin Endpoints

```
GET    /api/admin/dashboard           - Get admin dashboard (Admin)
GET    /api/admin/reviews/pending     - Get pending reviews (Admin)
PUT    /api/admin/reviews/:id/status  - Update review status (Admin)
POST   /api/admin/colleges            - Create college (Admin)
PUT    /api/admin/colleges/:id        - Update college (Admin)
DELETE /api/admin/colleges/:id        - Delete college (Admin)
GET    /api/admin/users               - Get all users (Admin)
GET    /api/admin/streams             - Get all streams (Admin)
```

## 👥 User Roles

### Student (Default)
- Browse and search colleges
- View detailed college information
- Read and write reviews
- Save favorite colleges
- Compare colleges
- Manage profile

### Admin
- All student capabilities
- Approve/reject reviews
- Add/edit/delete colleges
- Manage users
- View analytics
- Content moderation

## 🎨 Design System

### Color Palette

- **Primary Blue**: #3366FF - Main CTA, links, active states
- **Neutral Grays**: #F8F9FA to #212529 - Text and backgrounds
- **Success Green**: #28A745 - Success messages
- **Warning Yellow**: #FFC107 - Warnings and ratings
- **Error Red**: #DC3545 - Error messages

### Typography

- **Font**: Inter (Google Fonts)
- **H1**: 48px, Bold - Page titles
- **H2**: 32px, Bold - Section titles
- **H3**: 24px, SemiBold - Card titles
- **Body**: 16px, Regular - Content
- **Small**: 14px, Regular - Metadata

### Components

- **Cards**: White background, 12px radius, subtle shadow
- **Buttons**: 48px height, 12px radius, smooth transitions
- **Inputs**: 44px height, 8px radius, focus ring
- **Pills**: Rounded full, primary color background

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Helmet for security headers
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚧 Future Enhancements

- Email verification
- Password reset functionality
- Advanced analytics for admins
- File upload for college logos
- Social media integration
- Chat support
- Mobile app (React Native)
- Multi-language support
- Export college comparisons as PDF

## 📄 License

This project is created for educational and demonstration purposes.

## 👨‍💻 Author

**MiniMax Agent**

---

## 🐛 Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check MySQL is running
   - Verify credentials in .env file
   - Ensure database exists

2. **CORS errors**
   - Verify CLIENT_URL in backend .env
   - Check frontend is running on correct port

3. **JWT token errors**
   - Clear browser localStorage
   - Check JWT_SECRET is set in .env

4. **Module not found**
   - Run `npm install` in both frontend and backend
   - Delete node_modules and reinstall

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Happy Coding! 🎓**
