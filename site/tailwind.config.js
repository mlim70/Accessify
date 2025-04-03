/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ["class"],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: '#e5e7eb',
  			input: '#e5e7eb',
  			ring: '#000000',
  			background: '#ffffff',
  			foreground: '#000000',
  			primary: {
  				DEFAULT: '#FF9900',
  				foreground: '#000000'
  			},
  			secondary: {
  				DEFAULT: '#232F3E',
  				foreground: '#ffffff'
  			},
  			destructive: {
  				DEFAULT: '#ef4444',
  				foreground: '#ffffff'
  			},
  			muted: {
  				DEFAULT: '#f3f4f6',
  				foreground: '#6b7280'
  			},
  			accent: {
  				DEFAULT: '#FF9900',
  				foreground: '#000000'
  			},
  			popover: {
  				DEFAULT: '#ffffff',
  				foreground: '#000000'
  			},
  			card: {
  				DEFAULT: '#ffffff',
  				foreground: '#000000'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: '0.5rem',
  			md: 'calc(0.5rem - 2px)',
  			sm: 'calc(0.5rem - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: 0
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: 0
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

