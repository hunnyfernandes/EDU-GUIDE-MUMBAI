import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/outline"; // XCircleIcon removed - unused
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Validate token format on mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      toast.error("Invalid reset link");
      navigate("/");
    } else if (!/^[a-f0-9]{64}$/.test(token)) {
      setTokenValid(false);
      toast.error("Invalid reset link format");
      navigate("/");
    }
  }, [token, navigate]);

  if (!tokenValid) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      await authAPI.resetPassword({
        token,
        newPassword: formData.password,
      });

      toast.success("Password reset successfully! Redirecting to login...");
      setSubmitted(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/");
        window.location.reload(); // Refresh to clear any auth state
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to reset password. Please try again.";
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

      // If token is invalid/expired, redirect
      if (error.response?.status === 400 || error.response?.data?.message?.includes("invalid") || error.response?.data?.message?.includes("expired")) {
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
          <CheckCircleIcon className="w-16 h-16 text-success mx-auto mb-4" />
          <h1 className="text-h2 text-success mb-2">Password Reset Successful!</h1>
          <p className="text-neutral-600 mb-6">
            Your password has been reset. Redirecting to login...
          </p>
          <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-t-lg">
          <h1 className="text-h2">Reset Your Password</h1>
          <p className="text-primary-100 mt-2">Create a new password for your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.password ? "border-error" : "border-neutral-400"
              }`}
              placeholder="Enter new password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-error">{errors.password}</p>
            )}
            <p className="mt-2 text-xs text-neutral-500">
              • At least 8 characters
              <br />
              • Include uppercase, lowercase, and numbers
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.confirmPassword ? "border-error" : "border-neutral-400"
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-error">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>

          {/* Back to Home */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm text-primary-500 font-semibold hover:underline"
            >
              Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
