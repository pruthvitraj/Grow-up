import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import OverviewSection from '../components/OverviewSection';
import LoginSection from '../components/LoginSection';
import AboutSection from '../components/AboutSection';
import HelpSection from '../components/HelpSection';
import HowItWorksSection from '../components/HowItWorksSection';
import NewsSection from '../components/NewsSection';

function Home() {
    const { theme } = useContext(ThemeContext);

    const wrapperClasses = theme === 'dark'
        ? 'min-h-screen bg-gray-900 text-white'
        : 'min-h-screen bg-white text-gray-900';

    return (
        <div className={`${wrapperClasses} transition-colors duration-300`}>
            <Navbar />
            <Hero />
            <OverviewSection />
            <LoginSection />
            <AboutSection />
            <HelpSection />
            <HowItWorksSection />
            <NewsSection />
            <Footer />
        </div>
    );
}

export default Home;