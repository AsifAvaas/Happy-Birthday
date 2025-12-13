/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Custom fonts
            fontFamily: {
                fredoka: ['"Fredoka One"', 'cursive'],
                bangers: ['"Bangers"', 'cursive'],
                luckiest: ['"Luckiest Guy"', 'cursive'],
                serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
            },

            // Custom colors (can use for gradients, shadows, backgrounds)
            colors: {
                gradientStart: "#0f0c29",
                gradientMid: "#302b63",
                gradientEnd: "#24243e",
                angryRed: "#ff4d4d",
                playfulPink: "#ff79a9",
                nightPurple: "#5d3fd3",
            },

            // Shadows
            boxShadow: {
                'purple-lg': '0 0 30px rgba(180, 140, 255, 0.35)',
                'soft-purple': '0 0 20px rgba(180,140,255,0.25)',
            },

            // Animations (if you want custom keyframes)
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-5deg)' },
                    '50%': { transform: 'rotate(5deg)' },
                },
            },
            animation: {
                float: 'float 3s ease-in-out infinite',
                wiggle: 'wiggle 0.5s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};
