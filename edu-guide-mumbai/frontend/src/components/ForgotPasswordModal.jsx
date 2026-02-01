import React, { useState } from "react";
import { XMarkIcon, EnvelopeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useUIStore } from "../context/store";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const ForgotPasswordModal = () => {
  const { isForgotPasswordModalOpen, closeForgotPasswordModal, openLoginModal } = useUIStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!isForgotPasswordModalOpen) return null;

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({});
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      
      toast.success("Password reset link sent to your email!");
      setSubmitted(true);
      setEmail("");
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        closeForgotPasswordModal();
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send reset link. Please try again.";
      toast.error(errorMessage);

      // Handle field-specific errors if available
      const apiErrors = error.response?.data?.errors;
      if (apiErrors) {
        if (Array.isArray(apiErrors)) {
          const mapped = {};
          apiErrors.forEach((err) => {
            const key = err.field || err.path || err.param || 'error';
            if (mapped[key]) mapped[key] += `, ${err.message || err.msg || ''}`;
            else mapped[key] = err.message || err.msg || '';
          });
          setErrors(mapped);
        } else if (typeof apiErrors === 'object') {
          setErrors(apiErrors);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    closeForgotPasswordModal();
    openLoginModal();
    setEmail("");
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-neutral-400">
            <h2 className="text-h2">Check Your Email</h2>
            <button
              onClick={closeForgotPasswordModal}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Success Message */}
          <div className="p-6 space-y-4 text-center">
            <CheckCircleIcon className="w-16 h-16 text-success mx-auto" />
            <div>
              <h3 className="text-h3 text-success mb-2">Email Sent!</h3>
              <p className="text-neutral-600">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-neutral-500 mt-2">
                The link will expire in 1 hour. Please check your inbox and spam folder.
              </p>
            </div>

            {/* Back to Login Button */}
            <button
              onClick={handleBackToLogin}
              className="w-full btn-primary mt-6"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-neutral-400">
          <h2 className="text-h2">Forgot Password?</h2>
          <button
            onClick={closeForgotPasswordModal}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Description */}
          <p className="text-sm text-neutral-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {/* Email */}
          <div>
            <label htmlFor="reset-email" className="block text-sm font-semibold mb-2">
              Email Address
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
              <input
                type="email"
                id="reset-email"
                value={email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.email ? "border-error" : "border-neutral-400"
                }`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-error">{errors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {/* Back to Login */}
          <div className="text-center text-sm">
            <span className="text-neutral-400">Remember your password? </span>
            <button
              type="button"
              onClick={handleBackToLogin}
              className="text-primary-500 font-semibold hover:underline"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
