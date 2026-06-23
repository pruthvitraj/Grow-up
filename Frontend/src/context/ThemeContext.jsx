import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;
        if (theme === "dark") {
            root.classList.add("dark");
            root.classList.remove("light");
            body.classList.add("dark");
            body.classList.remove("light");
        } else {
            root.classList.add("light");
            root.classList.remove("dark");
            body.classList.add("light");
            body.classList.remove("dark");
        }
    }, [theme]);





    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
