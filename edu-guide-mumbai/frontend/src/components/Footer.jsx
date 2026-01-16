import React from 'react';
import { Link } from 'react-router-dom';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-neutral-900 text-neutral-400 mt-auto relative z-10">
            <div className="container-main py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <AcademicCapIcon className="w-8 h-8 text-primary-500" />
                            <span className="text-xl font-bold text-white">
                                EduGuide Mumbai
                            </span>
                        </div>
                        <p className="text-small">
                            Your trusted guide to finding the perfect college in Mumbai.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-small">
                            <li>
                                <Link to="/colleges" className="hover:text-primary-500">
                                    Browse Colleges
                                </Link>
                            </li>
                            <li>
                                <Link to="/compare" className="hover:text-primary-500">
                                    Compare Colleges
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-primary-500">
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2 text-small">
                            <li>
                                <Link to="/streams" className="hover:text-primary-500">
                                    Streams
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="hover:text-primary-500">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-primary-500">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-small">
                            <li>
                                <Link to="/privacy" className="hover:text-primary-500">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="hover:text-primary-500">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-small">
                    <p>© {currentYear} EduGuide Mumbai. All rights reserved. | Developed by Hunny Fernandes</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
