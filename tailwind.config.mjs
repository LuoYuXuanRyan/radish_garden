/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {},
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            bodyLight: '#f1f1f1',
            bodyDark: '#212121',
            bgLight: '#E7EAEF',
            bgDark: '#292929',
            fontLight: '#52525b',
            fontDark: '#e1e1e4',
            foilLight: '#FBFBFB',
            foilDark: '#333333',
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
