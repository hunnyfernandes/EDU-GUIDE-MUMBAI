import React from 'react';
import { Link } from 'react-router-dom';
import {
    MapPinIcon,
    StarIcon,
    BookmarkIcon,
    CheckCircleIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { useAuthStore, useComparisonStore } from '../context/store';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';
import { getCollegeTypeConfig, getTypeIcon } from '../utils/collegeTypeColors';

const CollegeCard = ({ college, saved = false, onSaveToggle }) => {
    const { isAuthenticated } = useAuthStore();
    const { addCollege, removeCollege, selectedColleges } = useComparisonStore();
    const [isSaved, setIsSaved] = React.useState(saved);
    const [isLoading, setIsLoading] = React.useState(false);
    const [imageLoaded, setImageLoaded] = React.useState(false);
    // imageError state removed - using imageLoaded state instead

    const isInComparison = selectedColleges.some(c => c.college_id === college.college_id);

    const handleSave = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error('Please login to save colleges');
            return;
        }

        setIsLoading(true);
        try {
            if (isSaved) {
                await userAPI.removeSavedCollege(college.college_id);
                setIsSaved(false);
                toast.success('College removed from saved list');
                if (onSaveToggle) onSaveToggle();
            } else {
                await userAPI.saveCollege(college.college_id);
                setIsSaved(true);
                toast.success('College saved successfully');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save college');
        } finally {
            setIsLoading(false);
        }
    };

    const handleComparisonToggle = (e) => {
        e.preventDefault();

        if (isInComparison) {
            removeCollege(college.college_id);
            toast.success('Removed from comparison');
        } else {
            if (selectedColleges.length >= 4) {
                toast.error('You can compare maximum 4 colleges');
                return;
            }
            addCollege(college);
            toast.success('Added to comparison');
        }
    };

    const streams = college.streams?.split(',') || [];
    const rating = parseFloat(college.average_rating) || 0;
    const typeConfig = getCollegeTypeConfig(college.college_type);
    const typeIcon = getTypeIcon(college.college_type);

    return (
        <div className="card group overflow-hidden flex flex-col bg-white dark:bg-neutral-800 transition-colors duration-200">
            {/* College Background Image */}
            <div className={`relative h-40 mb-3 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-700 shadow-md transform transition-transform duration-700`}>
                {/* Image Selection Logic */}
                {(() => {
                    // Deterministic image selection based on college ID or Name
                    const fallbackImages = [
                        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1592280771884-13a15aa9babb?w=600&h=400&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=600&h=400&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?w=600&h=400&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=600&h=400&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&h=400&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop&q=80'
                    ];

                    // Use college_id if number, or simple hash of string
                    let index = 0;
                    if (typeof college.college_id === 'number') {
                        index = college.college_id % fallbackImages.length;
                    } else if (college.college_name) {
                        index = college.college_name.length % fallbackImages.length;
                    }

                    const imageUrl = college.cover_image_url || fallbackImages[index];

                    return (
                        <>
                            {!imageLoaded && (
                                <div className={`absolute inset-0 bg-gradient-to-br ${typeConfig.gradient} animate-pulse`} />
                            )}
                            <img
                                src={imageUrl}
                                alt={college.college_name}
                                loading="lazy"
                                onLoad={() => setImageLoaded(true)}
                                onError={() => setImageLoaded(false)}
                                className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                            />
                            {/* Subtle overlay for image clarity */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80"></div>
                        </>
                    );
                })()}

                {/* Type Badge Overlay */}
                <div className="absolute top-3 left-3 z-10">
                    {(college.college_type === 'Government' || college.college_type === 'Private') ? (
                        <div
                            className="px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-lg bg-black/50 backdrop-blur-md border border-white/20 flex items-center gap-1"
                        >
                            <div className={`w-2 h-2 rounded-full ${college.college_type === 'Government' ? 'bg-orange-500' : 'bg-purple-500'}`}></div>
                            <span className="tracking-wider uppercase">{college.college_type}</span>
                        </div>
                    ) : (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white ${typeConfig.bgColor} shadow-lg tracking-wider uppercase bg-opacity-90 backdrop-blur-sm`}>
                            {college.college_type}
                        </span>
                    )}
                </div>
            </div>

            {/* Card Content */}
            <Link to={`/colleges/${college.college_id}`} className="p-5 flex-1 flex flex-col">
                {/* College Name */}
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary-500 text-neutral-800 dark:text-white transition-colors line-clamp-2">
                    {college.college_name}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 mb-3">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">{college.city}, {college.state}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, index) => (
                            <StarIcon
                                key={index}
                                className={`w-4 h-4 ${index < Math.floor(rating)
                                    ? 'fill-warning text-warning'
                                    : 'text-neutral-400 dark:text-neutral-600'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">{rating.toFixed(1)}</span>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">
                        ({college.total_reviews} reviews)
                    </span>
                </div>

                {/* Streams */}
                {streams.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">📚 Programs:</p>
                        <div className="flex flex-wrap gap-2">
                            {streams.slice(0, 3).map((stream, index) => (
                                <span key={index} className="inline-block px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px] font-medium border border-blue-200 dark:border-blue-700/50">
                                    {stream.trim()}
                                </span>
                            ))}
                            {streams.length > 3 && (
                                <span className="inline-block px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded text-[10px] font-medium border border-neutral-200 dark:border-neutral-700">
                                    +{streams.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* View Details Button */}
                <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                    <span className="text-primary-500 font-semibold text-sm group-hover:underline flex items-center gap-1">
                        View Details <span className="text-lg">→</span>
                    </span>
                </div>
            </Link>

            {/* Action Buttons */}
            <div className="px-5 pb-5 flex gap-2">
                {college.website && (
                    <a
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center justify-center border border-neutral-200 dark:border-neutral-700"
                        title="Visit Website"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GlobeAltIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                    </a>
                )}
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center justify-center border border-neutral-200 dark:border-neutral-700"
                    title={isSaved ? 'Remove from saved' : 'Save college'}
                >
                    {isSaved ? (
                        <BookmarkSolidIcon className="w-5 h-5 text-primary-500" />
                    ) : (
                        <BookmarkIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                    )}
                </button>
                <button
                    onClick={handleComparisonToggle}
                    className={`flex-1 p-2 rounded-lg transition-colors flex items-center justify-center border ${isInComparison
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                        }`}
                    title={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
                >
                    <CheckCircleIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default CollegeCard;
