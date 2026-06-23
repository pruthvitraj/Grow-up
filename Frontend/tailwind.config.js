// tailwind.config.js
module.exports = {
    darkMode: 'selector',
    content: [

        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-green': '#00f5d4',
                'brand-purple': '#9b5de5',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(0, 245, 212, 0.4)',
            },
        },
    },
    plugins: [],
};
