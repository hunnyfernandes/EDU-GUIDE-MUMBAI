import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/store";
import { authAPI } from "../services/api"; // userAPI removed - using store instead
import toast from "react-hot-toast";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user: authUser } = useAuthStore();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    fetchUserProfile();
  }, [isAuthenticated, navigate]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getMe();
      const userData = response.data.data || response.data;
      setUser(userData);
      setFormData({
        full_name: userData.full_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await authAPI.updateProfile(formData);
      setUser({ ...user, ...formData });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user.full_name || "",
      email: user.email || "",
      phone: user.phone || "",
    });
    setIsEditing(false);
  };

  if (loading && !user) {
    return (
      <div className="container-main py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 text-primary-600 dark:text-primary-300 mb-2">
            My Profile
          </h1>
          <p className="text-neutral-700 dark:text-neutral-400">
            Manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-8 mb-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-700">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-h2 text-neutral-900 dark:text-white mb-1">
                {user?.full_name}
              </h2>
              <p className="text-neutral-700 dark:text-neutral-400 mb-2">
                {user?.email}
              </p>
              <div className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                Active Member
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-300 mb-2">
                <UserIcon className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-neutral-800 dark:text-neutral-300 py-3 px-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                  {user?.full_name || "Not provided"}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-300 mb-2">
                <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <p className="text-neutral-800 dark:text-neutral-300 py-3 px-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                {user?.email}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-300 mb-2">
                <PhoneIcon className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="text-neutral-800 dark:text-neutral-300 py-3 px-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                  {user?.phone || "Not provided"}
                </p>
              )}
            </div>

            {/* Account Created */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-300 mb-2">
                <CalendarIcon className="w-4 h-4 inline mr-2" />
                Account Created
              </label>
              <p className="text-neutral-800 dark:text-neutral-300 py-3 px-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not available"}
              </p>
            </div>

            {/* User Role */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-300 mb-2">
                Role
              </label>
              <p className="text-neutral-800 dark:text-neutral-300 py-3 px-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                <span className="capitalize font-semibold text-primary-600 dark:text-primary-400">
                  {user?.role || "Student"}
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 pt-8 border-t border-neutral-200 dark:border-neutral-700">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 flex-1"
                >
                  <CheckIcon className="w-5 h-5" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="btn-secondary flex items-center gap-2 flex-1"
                >
                  <XMarkIcon className="w-5 h-5" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center gap-2 flex-1"
              >
                <PencilIcon className="w-5 h-5" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Additional Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="card text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-2">📚</div>
            <h3 className="text-h4 text-neutral-900 dark:text-white mb-1">
              Saved Colleges
            </h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-400">
              View your saved colleges
            </p>
          </button>
          <button className="card text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-h4 text-neutral-900 dark:text-white mb-1">
              My Reviews
            </h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-400">
              View your college reviews
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
