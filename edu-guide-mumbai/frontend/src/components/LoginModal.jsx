import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useUIStore, useAuthStore } from "../context/store";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal, openSignupModal, openForgotPasswordModal } = useUIStore();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isLoginModalOpen) return null;

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

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
      const response = await authAPI.login(formData);
      const { data, accessToken } = response.data;

      // Store accessToken and user data
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(data));

      setAuth(data, accessToken);
      toast.success("Login successful!");
      closeLoginModal();
      setFormData({ email: "", password: "" });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);

      // Show field-specific errors if available
      // Server may return errors either as an array (validation middleware) or
      // as an object keyed by field. Normalize both shapes into an object
      // mapping fieldName -> message so the UI can read errors.email / errors.password.
      const apiErrors = error.response?.data?.errors;
      if (apiErrors) {
        if (Array.isArray(apiErrors)) {
          const mapped = {};
          apiErrors.forEach((err) => {
            // validators middleware returns { field, message, value }
            const key = err.field || err.path || err.param || 'error';
            // If there are multiple messages for same field, join them
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

  const handleSwitchToSignup = () => {
    closeLoginModal();
    openSignupModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-neutral-400">
          <h2 className="text-h2">Login</h2>
          <button
            onClick={closeLoginModal}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.email ? "border-error" : "border-neutral-400"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2"
            >
              Password
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
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-error">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={openForgotPasswordModal}
              className="text-sm text-primary-500 font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Switch to Signup */}
          <div className="text-center text-sm">
            <span className="text-neutral-400">Don't have an account? </span>
            <button
              type="button"
              onClick={handleSwitchToSignup}
              className="text-primary-500 font-semibold hover:underline"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;










