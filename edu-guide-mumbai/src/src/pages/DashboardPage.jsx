import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../context/store";
import { userAPI, reviewAPI } from "../services/api";
// import CollegeCard from "../components/CollegeCard"; // not used in dashboard
import toast from "react-hot-toast";
import {
  BookmarkIcon,
  StarIcon,
  // ChartBarIcon, // unused icon
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const DashboardPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedColleges, setSavedColleges] = useState([]);
  const [myReviews, setMyReviews] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to access dashboard");
      return;
    }
    fetchDashboardData();
    fetchSavedColleges();
    fetchMyReviews();
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const response = await userAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedColleges = async () => {
    try {
      const response = await userAPI.getSavedColleges();
      setSavedColleges(response.data.data);
    } catch (error) {
      console.error("Failed to load saved colleges");
    }
  };

  const fetchMyReviews = async () => {
    try {
      const response = await reviewAPI.getMyReviews();
      setMyReviews(response.data.data);
    } catch (error) {
      console.error("Failed to load reviews");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container-main py-8 text-center">
        <p className="text-neutral-600 dark:text-neutral-300">
          Please login to access your dashboard
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-main py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <p className="mt-4 text-neutral-600 dark:text-neutral-300">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-primary-600 dark:text-primary-300">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Here's an overview of your activity
        </p>
      </div>

      {/* Stats Cards */}
      {dashboardData?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">
                  Saved Colleges
                </p>
                <p className="text-3xl font-bold text-primary-500 dark:text-primary-300">
                  {dashboardData.stats.saved_colleges}
                </p>
              </div>
              <BookmarkIcon className="w-12 h-12 text-primary-500 dark:text-primary-300 opacity-50" />
            </div>
            <Link
              to="/saved-colleges"
              className="mt-4 inline-flex items-center gap-2 text-primary-500 dark:text-primary-300 hover:underline text-sm"
            >
              View all <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">
                  Total Reviews
                </p>
                <p className="text-3xl font-bold text-warning dark:text-warning">
                  {dashboardData.stats.total_reviews}
                </p>
              </div>
              <StarIcon className="w-12 h-12 text-warning opacity-50" />
            </div>
            <Link
              to="/my-reviews"
              className="mt-4 inline-flex items-center gap-2 text-primary-500 dark:text-primary-300 hover:underline text-sm"
            >
              View all <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Saved Colleges */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-h2 text-neutral-900 dark:text-white">
              Recent Saved Colleges
            </h2>
            <Link
              to="/saved-colleges"
              className="text-primary-500 dark:text-primary-300 hover:underline text-sm"
            >
              View all
            </Link>
          </div>
          {savedColleges.length > 0 ? (
            <div className="space-y-4">
              {savedColleges.slice(0, 5).map((college) => (
                <Link
                  key={college.college_id}
                  to={`/colleges/${college.college_id}`}
                  className="block p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
                >
                  <h3 className="font-semibold mb-1 text-neutral-900 dark:text-white">
                    {college.college_name}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {college.city}
                  </p>
                  {college.average_rating > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <StarIcon className="w-4 h-4 fill-warning text-warning" />
                      <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-100">
                        {parseFloat(college.average_rating).toFixed(1)}
                      </span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-neutral-600 dark:text-neutral-300 text-center py-8">
              No saved colleges yet. Start exploring!
            </p>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-h2 text-neutral-900 dark:text-white">
              My Recent Reviews
            </h2>
            <Link
              to="/my-reviews"
              className="text-primary-500 dark:text-primary-300 hover:underline text-sm"
            >
              View all
            </Link>
          </div>
          {myReviews.length > 0 ? (
            <div className="space-y-4">
              {myReviews.slice(0, 5).map((review) => (
                <div
                  key={review.review_id}
                  className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Link
                      to={`/colleges/${review.college_id}`}
                      className="font-semibold text-neutral-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-300"
                    >
                      {review.college_name}
                    </Link>
                    <span
                      className={`tag text-xs ${
                        review.status === "approved"
                          ? "bg-success"
                          : review.status === "pending"
                          ? "bg-warning"
                          : "bg-error"
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>
                  {review.review_title && (
                    <h4 className="font-semibold mb-1 text-neutral-900 dark:text-white">
                      {review.review_title}
                    </h4>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-warning text-warning"
                            : "text-neutral-500 dark:text-neutral-400"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
                    {review.review_text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-600 dark:text-neutral-300 text-center py-8">
              No reviews yet. Share your experience!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
