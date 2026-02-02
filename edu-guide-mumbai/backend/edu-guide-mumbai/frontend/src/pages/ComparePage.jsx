import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collegeAPI } from "../services/api";
import { useComparisonStore } from "../context/store";
import toast from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ComparePage = () => {
  const navigate = useNavigate();
  const { selectedColleges, removeCollege, clearComparison } =
    useComparisonStore();
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedColleges.length === 0) {
      toast.error("Please select colleges to compare");
      navigate("/colleges");
    } else if (selectedColleges.length >= 2) {
      fetchComparisonData();
    }
  }, [selectedColleges]);

  const fetchComparisonData = async () => {
    setLoading(true);
    try {
      const collegeIds = selectedColleges.map((c) => c.college_id);
      const response = await collegeAPI.compare(collegeIds);
      setComparisonData(response.data.data);
    } catch (error) {
      toast.error("Failed to load comparison data");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (collegeId) => {
    removeCollege(collegeId);
    if (selectedColleges.length <= 2) {
      navigate("/colleges");
    }
  };

  return (
    <div className="container-main py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1>Compare Colleges</h1>
        <button onClick={clearComparison} className="btn-secondary">
          Clear All
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading comparison...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="border-b border-neutral-400">
                <th className="p-4 text-left">Attribute</th>
                {comparisonData.map((college) => (
                  <th key={college.college_id} className="p-4">
                    <div className="flex justify-between items-start">
                      <span>{college.college_name}</span>
                      <button
                        onClick={() => handleRemove(college.college_id)}
                        className="ml-2 p-1 hover:bg-red-100 rounded"
                      >
                        <XMarkIcon className="w-4 h-4 text-error" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Rating */}
              <tr className="border-b border-neutral-400">
                <td className="p-4 font-semibold">Rating</td>
                {comparisonData.map((college) => (
                  <td key={college.college_id} className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-semibold">
                        {parseFloat(college.average_rating || 0).toFixed(1)}
                      </span>
                      <span className="text-warning">⭐</span>
                      <span className="text-sm text-neutral-400">
                        ({college.total_reviews || 0} reviews)
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* College Type */}
              <tr className="border-b border-neutral-400 bg-neutral-50">
                <td className="p-4 font-semibold">College Type</td>
                {comparisonData.map((college) => (
                  <td key={college.college_id} className="p-4 text-center">
                    <span className="tag">{college.college_type || "N/A"}</span>
                  </td>
                ))}
              </tr>

              {/* Established Year */}
              <tr className="border-b border-neutral-400">
                <td className="p-4 font-semibold">Established Year</td>
                {comparisonData.map((college) => (
                  <td key={college.college_id} className="p-4 text-center">
                    {college.established_year || "N/A"}
                  </td>
                ))}
              </tr>

              {/* Location */}
              <tr className="border-b border-neutral-400 bg-neutral-50">
                <td className="p-4 font-semibold">Location</td>
                {comparisonData.map((college) => (
                  <td key={college.college_id} className="p-4 text-center">
                    <div>
                      <p className="font-semibold">{college.city || "N/A"}</p>
                      {college.address && (
                        <p className="text-sm text-neutral-400">
                          {college.address}
                        </p>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Streams */}
              <tr className="border-b border-neutral-400">
                <td className="p-4 font-semibold">Streams</td>
                {comparisonData.map((college) => (
                  <td key={college.college_id} className="p-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {college.streams && college.streams.length > 0 ? (
                        college.streams.map((stream, index) => (
                          <span key={index} className="tag text-xs">
                            {stream}
                          </span>
                        ))
                      ) : (
                        <span className="text-neutral-400">N/A</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Average Fees */}
              <tr className="border-b border-neutral-400 bg-neutral-50">
                <td className="p-4 font-semibold">Fee Range</td>
                {comparisonData.map((college) => (
                  <td key={college.college_id} className="p-4 text-center">
                    {college.fee_range ? (
                      <div>
                        {college.fee_range.min_fee &&
                          college.fee_range.max_fee ? (
                          <p className="font-semibold">
                            ₹
                            {parseFloat(
                              college.fee_range.min_fee
                            ).toLocaleString()}{" "}
                            - ₹
                            {parseFloat(
                              college.fee_range.max_fee
                            ).toLocaleString()}
                          </p>
                        ) : (
                          <p className="font-semibold">
                            {college.fee_range.min_fee
                              ? `₹${parseFloat(
                                college.fee_range.min_fee
                              ).toLocaleString()}`
                              : "N/A"}
                          </p>
                        )}
                        <p className="text-sm text-neutral-400">per year</p>
                      </div>
                    ) : (
                      <span className="text-neutral-400">N/A</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Facilities */}
              <tr className="border-b border-neutral-400">
                <td className="p-4 font-semibold">Facilities</td>
                {comparisonData.map((college) => (
                  <td key={college.college_id} className="p-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {college.facilities && college.facilities.length > 0 ? (
                        college.facilities
                          .slice(0, 5)
                          .map((facility, index) => (
                            <span key={index} className="tag text-xs">
                              {facility}
                            </span>
                          ))
                      ) : (
                        <span className="text-neutral-400">N/A</span>
                      )}
                      {college.facilities && college.facilities.length > 5 && (
                        <span className="text-xs text-neutral-400">
                          +{college.facilities.length - 5} more
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Placement Stats */}
              {comparisonData.some((c) => c.placement_info) && (
                <>
                  <tr className="border-b border-neutral-400 bg-neutral-50">
                    <td className="p-4 font-semibold">Average Package</td>
                    {comparisonData.map((college) => (
                      <td key={college.college_id} className="p-4 text-center">
                        {college.placement_info?.average_package ? (
                          <p className="font-semibold">
                            ₹
                            {parseFloat(
                              college.placement_info.average_package
                            ).toLocaleString()}{" "}
                            LPA
                          </p>
                        ) : (
                          <span className="text-neutral-400">N/A</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-neutral-400">
                    <td className="p-4 font-semibold">Highest Package</td>
                    {comparisonData.map((college) => (
                      <td key={college.college_id} className="p-4 text-center">
                        {college.placement_info?.highest_package ? (
                          <p className="font-semibold">
                            ₹
                            {parseFloat(
                              college.placement_info.highest_package
                            ).toLocaleString()}{" "}
                            LPA
                          </p>
                        ) : (
                          <span className="text-neutral-400">N/A</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-neutral-400 bg-neutral-50">
                    <td className="p-4 font-semibold">Placement Rate</td>
                    {comparisonData.map((college) => (
                      <td key={college.college_id} className="p-4 text-center">
                        {college.placement_info?.placement_rate ? (
                          <p className="font-semibold">
                            {college.placement_info.placement_rate}%
                          </p>
                        ) : (
                          <span className="text-neutral-400">N/A</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </>
              )}

              {/* Website */}
              <tr className="border-b border-neutral-400">
                <td className="p-4 font-semibold">Website</td>
                {comparisonData.map((college) => (
                  <td key={college.college_id} className="p-4 text-center">
                    {college.website ? (
                      <a
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:underline"
                      >
                        Visit Website
                      </a>
                    ) : (
                      <span className="text-neutral-400">N/A</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
