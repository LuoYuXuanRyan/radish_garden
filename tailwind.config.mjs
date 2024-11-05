/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {},
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            bodyLight: '#ffffff',
            bodyDark: '#2f2e2e',
            bgLight: '#fafaf9',
            bgDark: '#3f3f46',
            fontLight: '#52525b',
            fontDark: '#e4e4e7',
            foilLight: '#fefce8',
            foilDark: '#71717a',
            profileTextLight: '#3f3f46',
            profileTextDark: '#f5f5f4',
            descriptionTextLight: '#a1a1aa',
            descriptionTextDark: '#d4d4d8',
            ringLight: '#fef08a',
            ringDark: '#c2410c',
            headingHighlight: '#ea580c',
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
