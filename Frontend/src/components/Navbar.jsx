import React, { useEffect, useState, useContext } from 'react';
import GrowUpLogo from '../assets/icons/growup-logo.png';
import { ThemeContext } from "../context/ThemeContext";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const headerClasses = scrolled
        ? theme === 'light'
            ? 'bg-white/90 backdrop-blur-lg shadow-md text-gray-900'
            : 'bg-gray-900/90 backdrop-blur-lg shadow-md text-white'
        : theme === 'light'
            ? 'bg-transparent text-gray-900'
            : 'bg-transparent text-white';

    return (
        <header className={`fixed w-full z-50 py-4 px-6 md:px-12 transition-all duration-300 ${headerClasses}`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center hover:brightness-110 transition-all duration-300">
                    <img src={GrowUpLogo} alt="GrowUp Logo" className="h-10 mr-2" />
                    <span className={`text-2xl font-extrabold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        GrowUp
                    </span>
                </div>

                {/* Nav + Theme toggle */}
                <nav className="flex items-center gap-4 md:gap-8">
                    {[{ label: 'Home', href: '/' }, { label: 'About', href: '#about' }, { label: 'Help', href: '#help' }, { label: 'How It Works', href: '#howitworks' }, { label: 'News', href: '#news' }].map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className={`hidden md:inline-block font-medium transition-colors duration-200 ${
                                theme === 'light'
                                    ? 'text-gray-700 hover:text-teal-600'
                                    : 'text-gray-300 hover:text-teal-400'
                            }`}
                        >
                            {item.label}
                        </a>
                    ))}

                    <button
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                            theme === 'light'
                                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                : 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                        }`}
                    >
                        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
