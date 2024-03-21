/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: [],
	theme: {
		screens: {
			lg: "1024px",
			// => @media (min-width: 1024px) { ... }

			xl: "1280px",
			// => @media (min-width: 1280px) { ... }

			"2xl": "1536px",
			// => @media (min-width: 1536px) { ... }

			"3xl": "1600px",
			// => @media (min-width: 1600px) { ... }

			"4xl": "1920px",
			// => @media (min-width: 1920px) { ... }
		},
		extend: {
			boxShadow: {
				"3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
				opaq: "0 4px 16px 6px rgba(0,0,0,0.4)",
				full: "0 3px 1px -2px rgba(0,0,0, 0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12) ",
			},
			colors: {
				primary: {
					50: "#fef2f2",
					100: "#fce9e7", // #FFEBEB
					200: "#f9d2d2",
					300: "#f4adad",
					400: "#ed7f82",
					500: "#e25158",
					600: "#d34553", // BASE
					700: "#ad2334",
					800: "#912031",
					900: "#7c1f30",
					950: "#450c15",
				},

				"sheger-gray": {
					100: "#524848",
					200: "#B5B5B5",
					300: "#D1D5DB",
					400: "#6B7280",
					500: "#E5E5E5",
					600: "#4F4F4F",
					700: "#F3F4F6",
				},

				"sheger-green": {
					50: "#f1fcf4",
					100: "#defae7", // #D1FAE5
					200: "#bff3cf",
					300: "#8ce9aa",
					400: "#53d57d",
					500: "#2cbb5b",
					600: "#22ab4f", // BASE
					700: "#1c793b",
					800: "#1b6032",
					900: "#184f2c",
					950: "#082b15",
				},
				"sheger-blue": {
					50: "#eff3ff",
					100: "#dbe3fe",
					200: "#bfcefe",
					300: "#93acfd",
					400: "#6084fa",
					500: "#3b67f6",
					600: "#2553eb",
					700: "#1d49d8",
					800: "#1e40af",
					900: "#1e378a",
					950: "#172554",
				},
			},
		},
	},
	plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
