import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

/**
 * A ultra-premium, animated theme toggle component.
 * Synced with global ThemeContext.
 */
const ThemeToggle = () => {
    const context = useContext(ThemeContext);
    
    // Safety check if context is not available
    if (!context) {
        console.warn("ThemeToggle: ThemeContext not found. Make sure ThemeProvider wraps your App.");
        return null;
    }

    const { theme, toggleTheme } = context;
    const isDark = theme === "dark";

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
                e.stopPropagation();
                toggleTheme();
            }}
            className={`

                relative flex items-center w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-500 ease-in-out
                ${isDark ? "bg-slate-900 border border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" : "bg-sky-100 border border-sky-200 shadow-inner"}
                focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                overflow-hidden select-none
            `}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
            {/* Subtle background icons */}
            <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none opacity-20">
                <Sun size={12} className={isDark ? "text-slate-500" : "text-amber-500"} />
                <Moon size={12} className={isDark ? "text-indigo-400" : "text-slate-400"} />
            </div>

            {/* Moving Thumb */}
            <motion.div
                initial={false}
                animate={{
                    x: isDark ? 28 : 0,
                    backgroundColor: isDark ? "#4f46e5" : "#ffffff", // indigo-600 or white
                    rotate: isDark ? 360 : 0
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                }}
                className="z-10 flex items-center justify-center w-5 h-5 rounded-full shadow-md border border-black/5"
            >
                <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                        <motion.div
                            key="moon"
                            initial={{ scale: 0, rotate: -90, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Moon size={10} className="text-white fill-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ scale: 0, rotate: 90, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sun size={10} className="text-amber-500 fill-amber-500" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;
