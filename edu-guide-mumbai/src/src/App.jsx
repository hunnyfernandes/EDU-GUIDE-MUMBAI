import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context
import { ThemeProvider } from "./context/ThemeContext";

// Layout Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import ForgotPasswordModal from "./components/ForgotPasswordModal";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatbotWidget from "./components/ChatbotWidget";

// Pages
import HomePage from "./pages/HomePage";
import CollegesPage from "./pages/CollegesPage";
import CollegeDetailPage from "./pages/CollegeDetailPage";
import ComparePage from "./pages/ComparePage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AboutPage from "./pages/AboutPage";


function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#fff",
                  color: "#343A40",
                  boxShadow: "0 4px 12px rgba(51, 102, 255, 0.1)",
                },
                success: {
                  iconTheme: {
                    primary: "#28A745",
                    secondary: "#fff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#DC3545",
                    secondary: "#fff",
                  },
                },
              }}
            />

            <Header />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/colleges" element={<CollegesPage />} />
                <Route path="/colleges/:id" element={<CollegeDetailPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            <Footer />

            {/* Modals */}
            <LoginModal />
            <SignupModal />
            <ForgotPasswordModal />

            {/* Chatbot Widget */}
            <ChatbotWidget />
          </div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
