import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../context/store";
import { adminAPI } from "../services/api";
import toast from "react-hot-toast";
import {
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      toast.error("Access denied. Admin only.");
      return;
    }
    fetchDashboardData();
    fetchPendingReviews();
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingReviews = async () => {
    try {
      const response = await adminAPI.getPendingReviews();
      setPendingReviews(response.data.data);
    } catch (error) {
      console.error("Failed to load pending reviews");
    }
  };

  const handleReviewStatus = async (reviewId, status) => {
    try {
      await adminAPI.updateReviewStatus(reviewId, status);
      toast.success(
        `Review ${status === "approved" ? "approved" : "rejected"}`
      );
      fetchPendingReviews();
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to update review status");
    }
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="container-main py-8 text-center">
        <p className="text-neutral-400">Access denied. Admin only.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-main py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <p className="mt-4 text-neutral-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <div className="mb-8">
        <h1 className="mb-2">Admin Dashboard</h1>
        <p className="text-neutral-400">Manage colleges, reviews, and users</p>
      </div>

      {/* Stats Cards */}
      {dashboardData?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Total Colleges</p>
                <p className="text-3xl font-bold text-primary-500">
                  {dashboardData.stats.total_colleges}
                </p>
              </div>
              <AcademicCapIcon className="w-12 h-12 text-primary-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-blue-500">
                  {dashboardData.stats.total_users}
                </p>
              </div>
              <UserGroupIcon className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Pending Reviews</p>
                <p className="text-3xl font-bold text-warning">
                  {dashboardData.stats.pending_reviews}
                </p>
              </div>
              <DocumentTextIcon className="w-12 h-12 text-warning opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Total Reviews</p>
                <p className="text-3xl font-bold text-success">
                  {dashboardData.stats.total_reviews}
                </p>
              </div>
              <StarIcon className="w-12 h-12 text-success opacity-50" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-h2 mb-4">Pending Reviews</h2>
          {pendingReviews.length > 0 ? (
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <div
                  key={review.review_id}
                  className="p-4 border border-neutral-400 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{review.college_name}</h3>
                      <p className="text-sm text-neutral-400">
                        by {review.user_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-warning text-warning"
                              : "text-neutral-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.review_title && (
                    <h4 className="font-semibold mb-1">
                      {review.review_title}
                    </h4>
                  )}
                  <p className="text-sm text-neutral-700 mb-3 line-clamp-2">
                    {review.review_text}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleReviewStatus(review.review_id, "approved")
                      }
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleReviewStatus(review.review_id, "rejected")
                      }
                      className="flex-1 btn-secondary flex items-center justify-center gap-2"
                    >
                      <XCircleIcon className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-400 text-center py-8">
              No pending reviews
            </p>
          )}
        </div>

        {/* Top Rated Colleges */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-h2 mb-4">Top Rated Colleges</h2>
          {dashboardData?.top_colleges &&
          dashboardData.top_colleges.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.top_colleges.map((college) => (
                <Link
                  key={college.college_id}
                  to={`/colleges/${college.college_id}`}
                  className="block p-4 border border-neutral-400 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold mb-1">
                        {college.college_name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-4 h-4 fill-warning text-warning" />
                          <span className="font-semibold">
                            {parseFloat(college.average_rating).toFixed(1)}
                          </span>
                        </div>
                        <span className="text-sm text-neutral-400">
                          ({college.total_reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-neutral-400 text-center py-8">
              No colleges with reviews yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;










