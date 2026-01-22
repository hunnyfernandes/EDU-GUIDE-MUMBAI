import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { collegeAPI, userAPI } from '../services/api';
import { useAuthStore } from '../context/store';
import CollegeCard from '../components/CollegeCard';
import ScrollReveal from '../components/ScrollReveal';
import toast from 'react-hot-toast';
import { openGoogleSearch } from '../services/googleSearchService';

const streams = [
    'Commerce',
    'Arts',
    'Science',
    'Management',
    'Engineering',
    'Information Technology'
];

const HomePage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [featuredColleges, setFeaturedColleges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedColleges();
    }, []);

    const fetchFeaturedColleges = async () => {
        try {
            const response = await collegeAPI.getFeatured();
            setFeaturedColleges(response.data.data);
        } catch (error) {
            toast.error('Failed to load featured colleges');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // IMPORTANT: Open Google search FIRST (synchronously, in response to user action)
            const googleOpened = openGoogleSearch(searchQuery.trim());
            
            console.log('Search initiated:', searchQuery);
            console.log('Google search opened:', googleOpened);
            
            // Non-blocking search history logging
            if (isAuthenticated) {
                userAPI.logSearch({
                    search_query: searchQuery.trim(),
                    filters_applied: { search_platform: 'both', google_opened: googleOpened },
                    results_count: 0,
                }).catch(err => {
                    console.warn("Failed to log search:", err.message);
                });
            }
            
            // Navigate to database search
            navigate(`/colleges?search=${encodeURIComponent(searchQuery)}`);
            toast.success('Searching colleges in database and Google...');
        }
    };

    const handleStreamClick = (stream) => {
        // IMPORTANT: Open Google search FIRST (synchronously, in response to user action)
        const googleOpened = openGoogleSearch(stream, { stream });
        
        console.log('Stream search initiated:', stream);
        console.log('Google search opened:', googleOpened);
        
        // Non-blocking search history logging for stream selection
        if (isAuthenticated) {
            userAPI.logSearch({
                search_query: stream,
                filters_applied: { stream, search_platform: 'both', google_opened: googleOpened },
                results_count: 0,
            }).catch(err => {
                console.warn("Failed to log search:", err.message);
            });
        }
        // Navigate to database search
        navigate(`/colleges?stream=${encodeURIComponent(stream)}`);
    };

    return (
        <div className="min-h-screen animate-fade-in">
            {/* Hero Section with Background Image */}
            {/* Hero Section with Background Image */}
            <section className="relative py-jumbo overflow-hidden">
                {/* Animated Background Image */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-ken-burns-slow"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&h=700&fit=crop&q=90')`
                        }}
                    ></div>
                </div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/60 animate-fade-in z-0"></div>

                {/* Content */}
                <div className="container-main text-center relative z-10 px-4 sm:px-6">
                    <h1 className="mb-4 sm:mb-6 text-white drop-shadow-2xl text-3xl sm:text-4xl md:text-5xl animate-slide-down">
                        Find Your Future College in Mumbai
                    </h1>
                    <div className="animate-fade-in-up delay-100">
                        <p className="text-base sm:text-lg md:text-xl text-white/95 mb-8 sm:mb-12 max-w-2xl mx-auto drop-shadow-lg font-medium">
                            Discover the best colleges, compare programs, read reviews, and make informed decisions about your education
                        </p>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto mb-6 sm:mb-8 animate-fade-in-up delay-200 px-2 sm:px-0">
                        <div className="relative transform transition-transform active:scale-95 sm:hover:scale-[1.02] duration-300 group">
                            <MagnifyingGlassIcon className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 w-5 sm:w-6 h-5 sm:h-6 text-white/70 group-hover:text-primary-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search colleges, courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-bar w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-3 sm:py-4 shadow-2xl border border-white/30 backdrop-blur-md bg-white/10 focus:bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base active:scale-95 sm:hover:bg-white sm:hover:text-primary-600 sm:hover:placeholder-primary-400 transition-colors rounded-lg"
                            />
                        </div>
                    </form>

                    {/* Category Pills */}
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 animate-fade-in-up delay-300 px-2 sm:px-0">
                        {streams.map((stream, index) => (
                            <button
                                key={stream}
                                onClick={() => handleStreamClick(stream)}
                                className="category-pill bg-white/20 hover:bg-white text-white hover:text-primary-600 border border-white/30 backdrop-blur-sm font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-full active:scale-95 min-h-[44px] flex items-center justify-center"
                                style={{ animationDelay: `${300 + (index * 50)}ms` }}
                            >
                                {stream}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <ScrollReveal animation="animate-slide-in-up" delay="300ms">
                <section className="py-16 bg-white dark:bg-neutral-800 transition-colors duration-200 relative z-20 -mt-8 mx-4 md:mx-auto max-w-6xl rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-700">
                    <div className="container-main">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-100 dark:divide-neutral-700">
                            <div className="group p-4 hover:-translate-y-1 transition-transform duration-300">
                                <h2 className="text-primary-500 mb-2 text-4xl font-bold group-hover:scale-110 transition-transform duration-300">200+</h2>
                                <p className="text-neutral-600 dark:text-neutral-300 font-medium text-lg">Colleges Listed</p>
                            </div>
                            <div className="group p-4 hover:-translate-y-1 transition-transform duration-300">
                                <h2 className="text-primary-500 mb-2 text-4xl font-bold group-hover:scale-110 transition-transform duration-300">10,000+</h2>
                                <p className="text-neutral-600 dark:text-neutral-300 font-medium text-lg">Student Reviews</p>
                            </div>
                            <div className="group p-4 hover:-translate-y-1 transition-transform duration-300">
                                <h2 className="text-primary-500 mb-2 text-4xl font-bold group-hover:scale-110 transition-transform duration-300">6</h2>
                                <p className="text-neutral-600 dark:text-neutral-300 font-medium text-lg">Major Streams</p>
                            </div>
                        </div>
                    </div>
                </section>
            </ScrollReveal>



            {/* Featured Colleges Section */}
            <section className="py-24 relative bg-neutral-50 dark:bg-neutral-900 transition-colors duration-200 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10 pointer-events-none"
                    style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')` }}>
                </div>

                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>

                <div className="container-main relative z-10">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h2 className="mb-4 text-neutral-900 dark:text-white text-3xl font-bold">Top Rated Colleges</h2>
                            <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
                                Explore the highest-rated educational institutions in Mumbai, handpicked for their excellence in education
                            </p>
                        </div>
                    </ScrollReveal>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                            <p className="mt-4 text-neutral-400 font-medium animate-pulse">Loading colleges...</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredColleges.map((college, index) => (
                                    <ScrollReveal
                                        key={college.college_id}
                                        delay={`${index * 200}ms`}
                                        className="h-full"
                                    >
                                        <CollegeCard college={college} />
                                    </ScrollReveal>
                                ))}
                            </div>

                            <div className="text-center mt-16 animate-fade-in-up delay-300">
                                <Link to="/colleges" className="btn-primary inline-flex items-center gap-2 group">
                                    View All Colleges
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-neutral-800 transition-colors duration-200">
                <div className="container-main">
                    <div className="text-center mb-16">
                        <h2 className="mb-4 text-neutral-900 dark:text-white text-3xl font-bold">Why Choose EduGuide Mumbai?</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                            Everything you need to make the right college choice
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ScrollReveal delay="0ms" className="h-full">
                            <div className="group text-center p-8 bg-neutral-50 dark:bg-neutral-700/50 rounded-2xl border border-neutral-100 dark:border-neutral-700 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-2 transition-all duration-300 h-full">
                                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-300 flex items-center justify-center mx-auto mb-6">
                                    <MagnifyingGlassIcon className="w-10 h-10 text-primary-500 -rotate-3 group-hover:-rotate-6 transition-transform duration-300" />
                                </div>
                                <h3 className="mb-4 text-xl text-neutral-900 dark:text-white font-bold">Easy Search & Filter</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    Find colleges based on streams, fees, ratings, and location with our advanced filters
                                </p>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay="200ms" className="h-full">
                            <div className="group text-center p-8 bg-neutral-50 dark:bg-neutral-700/50 rounded-2xl border border-neutral-100 dark:border-neutral-700 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-2 transition-all duration-300 h-full">
                                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-2xl -rotate-3 group-hover:-rotate-6 transition-transform duration-300 flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-primary-500 rotate-3 group-hover:rotate-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="mb-4 text-xl text-neutral-900 dark:text-white font-bold">Detailed Information</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    Get comprehensive details about courses, fees, facilities, and placements
                                </p>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay="400ms" className="h-full">
                            <div className="group text-center p-8 bg-neutral-50 dark:bg-neutral-700/50 rounded-2xl border border-neutral-100 dark:border-neutral-700 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-2 transition-all duration-300 h-full">
                                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-300 flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-primary-500 -rotate-3 group-hover:-rotate-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                    </svg>
                                </div>
                                <h3 className="mb-4 text-xl text-neutral-900 dark:text-white font-bold">Compare Colleges</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    Side-by-side comparison of colleges to make the best decision
                                </p>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary-500 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 animate-pulse-slow"></div>
                <div className="container-main text-center relative z-10">
                    <h2 className="mb-6 text-white text-4xl font-bold">Ready to Find Your Perfect College?</h2>
                    <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                        Join thousands of students who trust EduGuide Mumbai for their college search
                    </p>
                    <Link to="/colleges" className="btn-secondary bg-white text-primary-600 hover:bg-white/90 hover:scale-105 active:scale-95 shadow-xl border-none text-lg px-8 py-4 inline-flex items-center gap-2">
                        Start Exploring
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </section>
        </div >
    );
};

export default HomePage;
