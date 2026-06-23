import React, { useContext } from "react";
import sideMp4 from "../assets/demo.mp4";
import { ThemeContext } from "../context/ThemeContext";

const Hero = () => {
  const { theme } = useContext(ThemeContext);

  const sectionClasses =
    theme === "light"
      ? "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900"
      : "bg-gradient-to-br from-gray-900 to-gray-800 text-white";

  const bgGradient =
    theme === "light"
      ? "bg-gradient-to-br from-white via-blue-50 to-emerald-50"
      : "bg-gradient-to-br from-gray-900 via-blue-900/30 to-emerald-900/20";

  const glow1 = theme === "light" ? "bg-teal-400/20" : "bg-teal-400/10";
  const glow2 = theme === "light" ? "bg-emerald-400/20" : "bg-emerald-400/10";

  const titleGradient =
    theme === "light"
      ? "from-green-600 via-emerald-600 to-teal-600"
      : "from-green-400 via-emerald-400 to-teal-400";

  // ✅ FIX: Missing variable that caused blank screen
  const neonFrameGlow =
    theme === "light"
      ? "from-teal-400/40 via-emerald-400/30 to-blue-400/40"
      : "from-teal-500/20 via-emerald-500/20 to-blue-500/20";

  return (
    <section
      id="home"
      className={`relative min-h-screen flex items-center overflow-hidden py-28 md:py-40 transition-colors duration-300 ${sectionClasses}`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 ${bgGradient}`} />

      {/* Accent floating glows */}
      <div className={`absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl animate-pulse ${glow1}`} />
      <div className={`absolute bottom-20 right-28 w-72 h-72 rounded-full blur-3xl animate-pulse delay-1000 ${glow2}`} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
        {/* LEFT Content */}
        <div className="text-center md:text-left animate-fade-in-up">
          <h1
            className={`text-5xl md:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r ${titleGradient}`}
          >
            Fuel Innovation.
            <br />
            Fund the Future.
          </h1>

          <p
            className={`mt-6 text-lg md:text-xl max-w-xl mx-auto md:mx-0 drop-shadow-lg leading-relaxed ${theme === "light" ? "text-gray-700" : "text-gray-200/90"
              }`}
          >
            Connecting visionary startups with strategic investors to build the next generation of industry leaders.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start">
            <a
              href="/register"
              className="px-10 py-4 text-lg font-semibold rounded-full bg-gradient-to-r 
              from-green-400 via-emerald-400 to-teal-400 text-black shadow-xl 
              hover:shadow-emerald-400/40 hover:-translate-y-1 transition-all duration-300"
            >
              Get Started Today
            </a>

            <a
              href="#news"
              className={`px-10 py-4 text-lg font-semibold rounded-full border transition-all duration-300 ${theme === "light"
                ? "border-gray-300 text-gray-800 hover:border-teal-500 hover:text-teal-600"
                : "border-white/30 text-white hover:border-teal-400/60 hover:text-teal-300"
                }`}
            >
              Learn More →
            </a>
          </div>
        </div>

        {/* RIGHT Video */}
        <div className="flex justify-center md:justify-end animate-fade-in-up">
          <div className="relative w-full max-w-lg">
            {/* Neon Glow */}
            <div className={`absolute -inset-3 bg-gradient-to-r ${neonFrameGlow} blur-2xl rounded-xl`} />

            <video
              className="relative w-full rounded-xl shadow-2xl border border-white/20 backdrop-blur-xl"
              src={sideMp4}
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
