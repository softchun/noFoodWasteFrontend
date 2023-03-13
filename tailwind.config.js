/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
				'mobile': '414px',
				'tablet': '744px',
				'desktop': '1280px',
			},
			fontSize: {
				'3xs': ['8px', {lineHeight: '10px'}],
				'2xs': ['10px', {lineHeight: '12px'}],
				xs: ['12px', {lineHeight: '15px'}],
				sm: ['14px', {lineHeight: '17px'}],
				base: ['16px', {lineHeight: '19px'}],
				lg: ['18px', {lineHeight: '22px'}],
				'2xl': ['24px', {lineHeight: '29px'}],
				'4xl': ['36px', {lineHeight: '44px'}],
			},
			colors: {
				primary: '#5F6F5A',
				brandprimary: '#F5F6F6',
				disabledgray: '#d9d9d9',
				info: '#899E69',
				warning: '#ffc259',
				error: '#eb5757',

				success: '#27ae60',
				update: '#e63946',
				black: {
					1: '#000000',
					2: '#1d1d1d',
					3: '#282828'
				},
				white: '#ffffff',
				gray: {
					1: '#333333',
					2: '#4f4f4f',
					3: '#828282',
					4: '#bdbdbd',
					5: '#e0e0e0',
					6: '#f2f2f2',
					7: '#f8f8f8',
					8: '#fdfdfd'
				},
			},
    },
  },
  plugins: [],
}
