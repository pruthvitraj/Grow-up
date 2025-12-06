import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Footer = () => {
    const { theme } = useContext(ThemeContext);

    const footerClasses = theme === 'light'
        ? 'bg-gray-50 text-gray-800'
        : 'bg-[#051d3e] text-gray-200';

    const linkColor = theme === 'light'
        ? 'text-teal-700 hover:text-teal-800'
        : 'text-teal-400 hover:text-teal-300';

    const muted = theme === 'light' ? 'text-gray-600' : 'text-gray-400';

    const year = new Date().getFullYear();

    return (
        <footer className={`${footerClasses} py-10 px-6 transition-colors duration-300`}>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 mb-4 md:mb-0">
                        GrowUp
                    </div>
                    <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
                        <a href="#about" className={linkColor}>About</a>
                        <a href="#howitworks" className={linkColor}>How It Works</a>
                        <a href="#news" className={linkColor}>News</a>
                        <a href="#help" className={linkColor}>Help</a>
                        <a href="#" className={linkColor}>Privacy</a>
                        <a href="#" className={linkColor}>Terms</a>
                    </nav>
                </div>

                <hr className={theme === 'light' ? 'border-gray-200' : 'border-gray-700'} />

                <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className={`text-xs ${muted}`}>
                        &copy; {year} GrowUp. All rights reserved. Building connections for a brighter future.
                    </p>
                    <div className="flex gap-3 text-xs">
                        {['Twitter', 'LinkedIn', 'Instagram'].map((s) => (
                            <a key={s} href="#" className={`${linkColor} font-medium`}>
                                {s}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;