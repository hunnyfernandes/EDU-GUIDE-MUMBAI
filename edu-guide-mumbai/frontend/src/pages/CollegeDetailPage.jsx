import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { collegeAPI, userAPI } from "../services/api";
import { useAuthStore } from "../context/store";
import toast from "react-hot-toast";
import {
  StarIcon,
  MapPinIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";

const CollegeDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const fetchCollegeDetails = useCallback(async () => {
    try {
      const response = await collegeAPI.getCollegeById(id);
      const collegeData = response.data.data;
      setCollege(collegeData);
      setLoading(false);

      // Log view if user is authenticated
      if (isAuthenticated && collegeData) {
        try {
          await userAPI.logView(collegeData.college_id, collegeData.college_name);
        } catch (error) {
          // Silently fail - don't disrupt user experience
          console.error("Failed to log view:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching college:", error);
      toast.error(error.response?.data?.message || "Failed to load college details");
      setLoading(false);
    }
  }, [id, isAuthenticated]);

  const checkIfSaved = useCallback(async () => {
    try {
      const response = await userAPI.checkSavedCollege(id);
      setIsSaved(response.data.is_saved);
    } catch (error) {
      // Ignore error
    }
  }, [id]);

  useEffect(() => {
    fetchCollegeDetails();
    if (isAuthenticated) {
      checkIfSaved();
    }
  }, [id, isAuthenticated, fetchCollegeDetails, checkIfSaved]);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save colleges");
      return;
    }

    try {
      if (isSaved) {
        await userAPI.removeSavedCollege(id);
        setIsSaved(false);
        toast.success("College removed from saved list");
      } else {
        await userAPI.saveCollege(id);
        setIsSaved(true);
        toast.success("College saved successfully");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update saved status"
      );
    }
  };

  if (loading) {
    return <div className="container-main py-8">Loading...</div>;
  }

  if (!college) {
    return <div className="container-main py-8">College not found</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Section */}
      <div className="bg-white border-b border-neutral-400">
        <div className="container-main py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="mb-2">{college.college_name}</h1>
              <div className="flex items-center gap-4 text-neutral-400">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5" />
                  <span>{college.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-5 h-5 fill-warning text-warning" />
                  <span className="font-semibold text-neutral-700">
                    {parseFloat(college.average_rating).toFixed(1)}
                  </span>
                  <span>({college.total_reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isAuthenticated && (
              <button
                onClick={handleSaveToggle}
                className="btn-secondary flex items-center gap-2"
              >
                {isSaved ? (
                  <>
                    <BookmarkSolidIcon className="w-5 h-5" />
                    Saved
                  </>
                ) : (
                  <>
                    <BookmarkIcon className="w-5 h-5" />
                    Save College
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container-main py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            {college.description && (
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-h2 mb-4">About</h2>
                <p className="text-neutral-700 leading-relaxed">
                  {college.description}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-neutral-400">
                  <div>
                    <p className="text-sm text-neutral-400">Established</p>
                    <p className="font-semibold">
                      {college.established_year || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Type</p>
                    <p className="font-semibold">{college.college_type}</p>
                  </div>
                  {college.affiliation && (
                    <div>
                      <p className="text-sm text-neutral-400">Affiliation</p>
                      <p className="font-semibold">{college.affiliation}</p>
                    </div>
                  )}
                  {college.website && (
                    <div>
                      <p className="text-sm text-neutral-400">Website</p>
                      <a
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary-500 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Courses Section */}
            {college.courses && college.courses.length > 0 && (
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-h2 mb-4">Courses Offered</h2>
                <div className="space-y-4">
                  {college.courses.map((course) => (
                    <div
                      key={course.course_id}
                      className="border-b border-neutral-400 pb-4 last:border-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {course.course_name}
                          </h3>
                          <p className="text-sm text-neutral-400">
                            {course.degree_type}
                          </p>
                        </div>
                        {course.fees_per_year && (
                          <div className="text-right">
                            <p className="font-semibold">
                              ₹
                              {parseFloat(
                                course.fees_per_year
                              ).toLocaleString()}
                            </p>
                            <p className="text-sm text-neutral-400">per year</p>
                          </div>
                        )}
                      </div>
                      {course.description && (
                        <p className="text-neutral-700 mt-2 text-sm">
                          {course.description}
                        </p>
                      )}
                      {course.duration_years && (
                        <p className="text-sm text-neutral-400 mt-2">
                          Duration: {course.duration_years} years
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Facilities Section */}
            {college.facilities && college.facilities.length > 0 && (
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-h2 mb-4">Facilities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {college.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span>{facility.facility_name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Admission Info Section */}
            {college.admission_info && (
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-h2 mb-4">Admission Information</h2>
                <div className="space-y-3">
                  {college.admission_info.entrance_exam && (
                    <div>
                      <p className="text-sm text-neutral-400">Entrance Exam</p>
                      <p className="font-semibold">
                        {college.admission_info.entrance_exam}
                      </p>
                    </div>
                  )}
                  {college.admission_info.application_process && (
                    <div>
                      <p className="text-sm text-neutral-400">
                        Application Process
                      </p>
                      <p className="text-neutral-700">
                        {college.admission_info.application_process}
                      </p>
                    </div>
                  )}
                  {college.admission_info.important_dates && (
                    <div>
                      <p className="text-sm text-neutral-400">
                        Important Dates
                      </p>
                      <p className="text-neutral-700">
                        {college.admission_info.important_dates}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Placements Section */}
            {college.placement_info && (
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-h2 mb-4">Placement Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {college.placement_info.average_package && (
                    <div>
                      <p className="text-sm text-neutral-400">
                        Average Package
                      </p>
                      <p className="font-semibold text-lg">
                        ₹
                        {parseFloat(
                          college.placement_info.average_package
                        ).toLocaleString()}{" "}
                        LPA
                      </p>
                    </div>
                  )}
                  {college.placement_info.highest_package && (
                    <div>
                      <p className="text-sm text-neutral-400">
                        Highest Package
                      </p>
                      <p className="font-semibold text-lg">
                        ₹
                        {parseFloat(
                          college.placement_info.highest_package
                        ).toLocaleString()}{" "}
                        LPA
                      </p>
                    </div>
                  )}
                  {college.placement_info.placement_rate && (
                    <div>
                      <p className="text-sm text-neutral-400">Placement Rate</p>
                      <p className="font-semibold text-lg">
                        {college.placement_info.placement_rate}%
                      </p>
                    </div>
                  )}
                  {college.placement_info.companies_visited && (
                    <div>
                      <p className="text-sm text-neutral-400">
                        Companies Visited
                      </p>
                      <p className="font-semibold text-lg">
                        {college.placement_info.companies_visited}
                      </p>
                    </div>
                  )}
                </div>
                {college.placement_info.top_recruiters && (
                  <div className="mt-4 pt-4 border-t border-neutral-400">
                    <p className="text-sm text-neutral-400 mb-2">
                      Top Recruiters
                    </p>
                    <p className="text-neutral-700">
                      {college.placement_info.top_recruiters}
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* Reviews Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-h2 mb-4">Reviews</h2>
              {college.reviews && college.reviews.length > 0 ? (
                <div className="space-y-4">
                  {college.reviews.map((review) => (
                    <div
                      key={review.review_id}
                      className="border-b border-neutral-400 pb-4 last:border-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{review.user_name}</p>
                          <p className="text-sm text-neutral-400">
                            {review.course_studied &&
                              `${review.course_studied} • `}
                            {review.batch_year && `Batch ${review.batch_year}`}
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
                      <p className="text-neutral-700">{review.review_text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-400">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-h3 mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-400">Location</p>
                  <p className="font-semibold">{college.address}</p>
                  <p className="text-sm text-neutral-400">
                    {college.city}, {college.pincode}
                  </p>
                </div>
                {college.phone && (
                  <div>
                    <p className="text-sm text-neutral-400">Phone</p>
                    <p className="font-semibold">{college.phone}</p>
                  </div>
                )}
                {college.email && (
                  <div>
                    <p className="text-sm text-neutral-400">Email</p>
                    <p className="font-semibold">{college.email}</p>
                  </div>
                )}
                {college.streams && college.streams.length > 0 && (
                  <div>
                    <p className="text-sm text-neutral-400 mb-2">Streams</p>
                    <div className="flex flex-wrap gap-2">
                      {college.streams.map((stream, index) => (
                        <span key={index} className="tag text-xs">
                          {stream.stream_name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetailPage;
