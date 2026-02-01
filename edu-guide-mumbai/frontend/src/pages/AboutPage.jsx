import React from 'react';
import { Link } from 'react-router-dom';
import {
    AcademicCapIcon,
    LightBulbIcon,
    RocketLaunchIcon,
    CheckBadgeIcon,
    MagnifyingGlassIcon,
    ArrowsRightLeftIcon,
    RectangleGroupIcon,
} from '@heroicons/react/24/outline';
import ScrollReveal from '../components/ScrollReveal';

const AboutPage = () => {
    return (
        <div className="min-h-screen relative transition-colors duration-300 bg-neutral-50 dark:bg-neutral-900">
            {/* Main Background Image with Overlay */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img
                    src="https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=1920&q=80"
                    alt="Mumbai Skyline Background"
                    className="w-full h-full object-cover opacity-[0.35] dark:opacity-[0.25]"
                />
                {/* Theme-aware overlay */}
                <div className="absolute inset-0 bg-neutral-50/50 dark:bg-neutral-900/75 transition-colors duration-500"></div>
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="relative pt-xxxl pb-jumbo overflow-hidden">
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
                        <div className="absolute top-[40%] -right-[5%] w-[30%] h-[30%] bg-secondary-500/5 rounded-full blur-3xl" style={{ animationDelay: '2s' }}></div>
                    </div>

                    <div className="container-main relative z-10">
                        <div className="grid lg:grid-cols-2 gap-xl items-center">
                            <ScrollReveal animation="animate-slide-in-up">
                                <h4 className="text-primary-600 dark:text-primary-400 font-bold tracking-wider uppercase mb-md">
                                    Empowering Mumbai's Students
                                </h4>
                                <h1 className="text-h1 mb-lg font-extrabold leading-tight text-neutral-900 dark:text-white">
                                    Your Gateway to Education in <span className="text-primary-500">Mumbai</span>
                                </h1>
                                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-xl max-w-xl">
                                    EduGuide Mumbai is the city's dedicated platform designed to simplify the college search process. We help students navigate the complexities of higher education with ease and confidence.
                                </p>
                                <div className="flex flex-wrap gap-md">
                                    <Link to="/colleges" className="btn-primary">
                                        Browse Colleges
                                    </Link>
                                    <Link to="/compare" className="btn-secondary">
                                        Compare Now
                                    </Link>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal animation="animate-float" delay="200ms" className="hidden lg:block relative">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                                    <img
                                        src="https://images.unsplash.com/photo-1523240715639-9a67a0e71d8b?w=1600&h=1200&fit=crop&q=80"
                                        alt="Students studying"
                                        className="w-full h-[500px] object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent"></div>
                                </div>
                                {/* Floating elements */}
                                <div className="absolute -bottom-6 -left-6 glass p-md rounded-xl shadow-lg border border-white/20 dark:border-neutral-700">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-success/20 rounded-lg">
                                            <CheckBadgeIcon className="w-6 h-6 text-success" />
                                        </div>
                                        <div>
                                            <p className="text-small font-bold text-neutral-900 dark:text-white">100% Verified</p>
                                            <p className="text-[10px] text-neutral-500 dark:text-neutral-400">College Data</p>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* Who We Are Section */}
                <section className="py-xxxl bg-white dark:bg-neutral-800/80 transition-colors duration-300">
                    <div className="container-main">
                        <div className="flex flex-col md:flex-row items-center gap-xl">
                            <ScrollReveal className="md:w-1/2 text-center md:text-left">
                                <h2 className="text-h2 mb-xl text-neutral-900 dark:text-white">Who We Are</h2>
                                <p className="text-body text-neutral-600 dark:text-neutral-400 leading-relaxed mb-lg">
                                    EduGuide Mumbai is the city's premier educational discovery platform, born out of a simple realization: finding the right college should be as easy as it is important. In a city like Mumbai, where opportunities are endless but the noise is equally loud, we act as a compass for students and parents alike.
                                </p>
                                <p className="text-body text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    Our platform focuses exclusively on the Mumbai educational landscape, bringing hyper-local expertise to students after their 10th and 12th grades. We bridge the gap between aspirations and reality by providing a centralized, ad-free, and student-first environment.
                                </p>
                            </ScrollReveal>
                            <ScrollReveal animation="animate-fade-in" delay="200ms" className="md:w-1/2">
                                <div className="rounded-2xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-700">
                                    <img
                                        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80"
                                        alt="Students collaborating"
                                        className="w-full h-80 object-cover"
                                    />
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* Our Mission & Vision */}
                <section className="py-xxxl">
                    <div className="container-main">
                        <div className="grid md:grid-cols-2 gap-xl">
                            <ScrollReveal className="card flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-lg">
                                    <LightBulbIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                                </div>
                                <h3 className="text-h3 mb-md text-neutral-900 dark:text-white">Our Mission</h3>
                                <p className="text-body text-neutral-600 dark:text-neutral-400">
                                    Helping students make informed decisions. We strive to empower every student in Mumbai with accurate, transparent, and easy-to-use tools for choosing the right educational path.
                                </p>
                            </ScrollReveal>

                            <ScrollReveal className="card flex flex-col items-center text-center" delay="200ms">
                                <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900/30 rounded-2xl flex items-center justify-center mb-lg">
                                    <RocketLaunchIcon className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
                                </div>
                                <h3 className="text-h3 mb-md text-neutral-900 dark:text-white">Our Vision</h3>
                                <p className="text-body text-neutral-600 dark:text-neutral-400">
                                    Becoming Mumbai’s most trusted education platform. We envision a future where every student beginning their higher education journey in Mumbai starts their search with EduGuide.
                                </p>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* What We Offer */}
                <section className="py-xxxl bg-neutral-100/50 dark:bg-neutral-900/50 transition-colors duration-300">
                    <div className="container-main">
                        <ScrollReveal className="text-center mb-xxl">
                            <h2 className="text-h2 mb-md text-neutral-900 dark:text-white">What We Offer</h2>
                            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                                Comprehensive tools designed specifically for the Mumbai education system.
                            </p>
                        </ScrollReveal>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-lg">
                            {[
                                {
                                    icon: <RectangleGroupIcon />,
                                    title: "College Listings",
                                    desc: "Filter through Mumbai colleges by stream, location, and preferences."
                                },
                                {
                                    icon: <ArrowsRightLeftIcon />,
                                    title: "Smart Comparison",
                                    desc: "Compare multiple colleges side-by-side to see which truly fits your goals."
                                },
                                {
                                    icon: <AcademicCapIcon />,
                                    title: "Detailed Streams",
                                    desc: "Information on Science, Commerce, Arts, and vocational courses."
                                },
                                {
                                    icon: <MagnifyingGlassIcon />,
                                    title: "Expert Guidance",
                                    desc: "Data-driven insights to help you navigate the admission process."
                                }
                            ].map((item, idx) => (
                                <ScrollReveal key={idx} delay={`${idx * 100}ms`} className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm p-xl rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 text-primary-500 mb-md">
                                        {React.cloneElement(item.icon, { className: "w-full h-full" })}
                                    </div>
                                    <h4 className="text-h4 mb-sm text-neutral-900 dark:text-white">{item.title}</h4>
                                    <p className="text-small text-neutral-600 dark:text-neutral-400">{item.desc}</p>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="py-xxxl overflow-hidden">
                    <div className="container-main">
                        <div className="flex flex-col lg:flex-row items-center gap-xxl">
                            <div className="lg:w-1/2">
                                <ScrollReveal className="text-center lg:text-left">
                                    <h2 className="text-h2 mb-xl text-neutral-900 dark:text-white">Why Choose EduGuide Mumbai?</h2>
                                    <div className="space-y-lg">
                                        {[
                                            {
                                                title: "Accuracy",
                                                desc: "We prioritize real-time data and verified information from college authorities."
                                            },
                                            {
                                                title: "Mumbai-Focused",
                                                desc: "We understand the nuances of Mumbai University and the local education board better than anyone."
                                            },
                                            {
                                                title: "Student-First",
                                                desc: "Our interface is built for students, not for corporate advertisers. We prioritize your needs."
                                            }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex gap-md">
                                                <div className="mt-1 flex-shrink-0">
                                                    <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                                                        <CheckBadgeIcon className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>
                                                <div className="text-left">
                                                    <h4 className="text-body font-bold mb-xs text-neutral-900 dark:text-white">{item.title}</h4>
                                                    <p className="text-small text-neutral-600 dark:text-neutral-400">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollReveal>
                            </div>
                            <div className="lg:w-1/2 relative">
                                <ScrollReveal animation="animate-slide-in-up" delay="300ms">
                                    <div className="p-xl bg-primary-500 rounded-3xl text-white relative z-10 overflow-hidden shadow-2xl shadow-primary-500/20">
                                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
                                        <h3 className="text-h3 mb-lg relative z-10 text-white">Still unsure where to start?</h3>
                                        <p className="text-white/80 mb-xl relative z-10">
                                            Join thousands of Mumbai students who have found their dream college through EduGuide. Your future starts here.
                                        </p>
                                        <div className="flex items-center gap-md relative z-10">
                                            <div className="flex -space-x-3">
                                                {[1, 2, 3, 4].map(n => (
                                                    <div key={n} className="w-10 h-10 rounded-full border-2 border-primary-500 bg-neutral-200 overflow-hidden">
                                                        <img src={`https://i.pravatar.cc/100?img=${n + 10}`} alt="Student" />
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-small font-medium text-white">Trusted by students across Mumbai</span>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Student Testimonials */}
                <section className="py-xxxl bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800 transition-colors duration-300">
                    <div className="container-main">
                        <ScrollReveal className="text-center mb-xxl">
                            <h2 className="text-h2 mb-md text-neutral-900 dark:text-white">What Students Say</h2>
                            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                                Real experiences from Mumbai students who found their perfect college through EduGuide.
                            </p>
                        </ScrollReveal>

                        <div className="grid md:grid-cols-3 gap-lg">
                            {[
                                {
                                    name: "Priya Sharma",
                                    college: "Mithibai College",
                                    stream: "Commerce",
                                    image: "https://i.pravatar.cc/150?img=5",
                                    rating: 5,
                                    feedback: "EduGuide made my college search so much easier! I could compare all the commerce colleges in Mumbai and found the perfect fit for me. The detailed information helped me make an informed decision."
                                },
                                {
                                    name: "Arjun Patel",
                                    college: "Jai Hind College",
                                    stream: "Science",
                                    image: "https://i.pravatar.cc/150?img=12",
                                    rating: 5,
                                    feedback: "As someone new to Mumbai, I had no idea where to start. EduGuide's platform gave me all the information I needed about science colleges. The comparison feature was a game-changer!"
                                },
                                {
                                    name: "Sneha Desai",
                                    college: "St. Xavier's College",
                                    stream: "Arts",
                                    image: "https://i.pravatar.cc/150?img=9",
                                    rating: 5,
                                    feedback: "I loved how easy it was to filter colleges by location and stream. Found my dream college within minutes! The platform is super user-friendly and has accurate information."
                                }
                            ].map((testimonial, idx) => (
                                <ScrollReveal key={idx} delay={`${idx * 150}ms`} className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm p-xl rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center gap-md mb-lg">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-primary-500"
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-body font-bold text-neutral-900 dark:text-white">{testimonial.name}</h4>
                                            <p className="text-small text-neutral-600 dark:text-neutral-400">{testimonial.stream} • {testimonial.college}</p>
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div className="flex gap-1 mb-md">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                        ))}
                                    </div>

                                    <p className="text-small text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                                        "{testimonial.feedback}"
                                    </p>
                                </ScrollReveal>
                            ))}
                        </div>

                        {/* Trust Badge */}
                        <ScrollReveal delay="400ms" className="mt-xxl text-center">
                            <div className="inline-flex items-center gap-md px-xl py-lg bg-primary-50 dark:bg-primary-900/20 rounded-full border border-primary-200 dark:border-primary-800">
                                <CheckBadgeIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                <span className="text-body font-semibold text-primary-900 dark:text-primary-300">
                                    Trusted by 10,000+ Mumbai Students
                                </span>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-jumbo">
                    <div className="container-main">
                        <ScrollReveal className="bg-primary-900 rounded-[2.5rem] p-xxxl text-center relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-white rounded-full blur-3xl"></div>
                                <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-primary-400 rounded-full blur-3xl"></div>
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-h1 text-white mb-lg">Ready to find your college?</h2>
                                <p className="text-xl text-primary-100/80 mb-xl max-w-2xl mx-auto">
                                    Explore colleges or compare options to make the best choice for your career.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-md justify-center">
                                    <Link to="/colleges" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-extrabold text-lg hover:bg-white hover:text-primary-900 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                                        Explore Colleges
                                    </Link>
                                    <Link to="/compare" className="px-8 py-4 bg-transparent text-white border border-white/40 rounded-xl font-extrabold text-lg hover:bg-white hover:text-primary-900 hover:-translate-y-1 transition-all duration-300">
                                        Compare Now
                                    </Link>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
