import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AcademicCapIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    BookmarkIcon,
    ChartBarIcon,
    MoonIcon,
    SunIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { useAuthStore, useUIStore } from '../context/store';
import { useTheme } from '../context/ThemeContext';
import SearchHistory from './SearchHistory';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const { openLoginModal, openSignupModal } = useUIStore();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [userMenuOpen, setUserMenuOpen] = React.useState(false);
    const [searchHistoryOpen, setSearchHistoryOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-white dark:bg-neutral-900 shadow-sm sticky top-0 z-50 transition-colors duration-200">
            <nav className="container-main py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <AcademicCapIcon className="w-8 h-8 text-primary-500" />
                        <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                            Edu<span className="text-primary-500">Guide</span> Mumbai
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/colleges" className="text-neutral-700 dark:text-neutral-300 hover:text-primary-500 font-medium transition-colors duration-200">
                            Colleges
                        </Link>
                        <Link to="/compare" className="text-neutral-700 dark:text-neutral-300 hover:text-primary-500 font-medium transition-colors duration-200">
                            Compare
                        </Link>

                        <Link to="/about" className="text-neutral-700 dark:text-neutral-300 hover:text-primary-500 font-medium transition-colors duration-200">
                            About
                        </Link>
                    </div>
                    {/* Auth Buttons & Theme Toggle */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
                            title="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <SunIcon className="w-6 h-6 text-neutral-700 dark:text-yellow-400" />
                            ) : (
                                <MoonIcon className="w-6 h-6 text-neutral-700" />
                            )}
                        </button>
                        {/* History Button - Available for All Users */}
                        <button
                            onClick={() => setSearchHistoryOpen(true)}
                            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
                            title="Search History"
                        >
                            <ClockIcon className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
                        </button>
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 text-neutral-700 hover:text-primary-500"
                                >
                                    <UserCircleIcon className="w-8 h-8" />
                                    <span className="font-medium">{user?.full_name}</span>
                                </button>

                                {/* User Dropdown Menu */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-2">
                                        <Link
                                            to="/dashboard"
                                            className="block px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <ChartBarIcon className="w-5 h-5" />
                                                Dashboard
                                            </div>
                                        </Link>
                                        <Link
                                            to="/saved-colleges"
                                            className="block px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <BookmarkIcon className="w-5 h-5" />
                                                Saved Colleges
                                            </div>
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <UserCircleIcon className="w-5 h-5" />
                                                Profile
                                            </div>
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="block px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border-t border-neutral-200 dark:border-neutral-700"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-t border-neutral-200 dark:border-neutral-700"
                                        >
                                            <div className="flex items-center gap-2">
                                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                                Logout
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={openLoginModal}
                                    className="btn-secondary"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={openSignupModal}
                                    className="btn-primary"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2"
                    >
                        {mobileMenuOpen ? (
                            <XMarkIcon className="w-6 h-6" />
                        ) : (
                            <Bars3Icon className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-4">
                        <Link
                            to="/colleges"
                            className="block text-neutral-700 hover:text-primary-500 font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Colleges
                        </Link>
                        <Link
                            to="/compare"
                            className="block text-neutral-700 hover:text-primary-500 font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Compare
                        </Link>
                        <Link
                            to="/about"
                            className="block text-neutral-700 hover:text-primary-500 font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            About
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="block text-neutral-700 hover:text-primary-500 font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block text-error font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <button
                                    onClick={openLoginModal}
                                    className="btn-secondary w-full"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={openSignupModal}
                                    className="btn-primary w-full"
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </nav>

            {/* Search History Modal */}
            <SearchHistory isOpen={searchHistoryOpen} onClose={() => setSearchHistoryOpen(false)} />
        </header>
    );
};

export default Header;
