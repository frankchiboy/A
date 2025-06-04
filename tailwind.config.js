/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  safelist: [
    'text-navy-700',
    'bg-gradient-soft'
  ],
  theme: {
    extend: {
      colors: {
        'amber': {
          50: '#fff8e6',
          100: '#ffedbd',
          200: '#fee295',
          300: '#fece48',
          400: '#fdc224',
          500: '#f5a80b',
          600: '#db8305',
          700: '#b55f08',
          800: '#944a0e',
          900: '#7a3d10',
          950: '#461f05',
        },
        'teal': {
          50: '#effefb',
          100: '#cafcf1',
          200: '#93f5e4',
          300: '#4fe8d2',
          400: '#1fd3be',
          500: '#00b7a5',
          600: '#009389',
          700: '#00756f',
          800: '#005d5a',
          900: '#004d4a',
          950: '#002b2b',
        },
        'navy': {
          50: '#f0f5ff',
          100: '#e3eaff',
          200: '#c9d8ff',
          300: '#a8bcff',
          400: '#8096ff',
          500: '#4f67ff',
          600: '#3f47fa',
          700: '#302eeb',
          800: '#2927cd',
          900: '#2528a4',
          950: '#181764',
        }
      },
      fontFamily: {
        'display': ['"Clash Display"', 'sans-serif'],
        'sans': ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-wave': 'linear-gradient(60deg, var(--tw-gradient-stops))',
        'gradient-soft': 'linear-gradient(120deg, var(--tw-gradient-stops))',
        'noise': "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAElBMVEUAAAD8/vz08vT09vT8+vzs7uxH16TeAAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAuFJREFUOI0Vk+3NLiEIRG1B8ClAYAsQ2AIEt4D9ePtv5Xp/mZgYJ2fOFJKEfInkVWY2aglmQFkimRTV7MblYyVqD7HXyhKsSuPX12MeDhRHLtGvRG+P+B/S0Vu4OswR9tmvwNPyhdCDbVayJGads/WiUWcjCvCnruTBNHS9gmX2VzVbk7ZvB1gb1hkWFGl+A/n+/FowcJFJj0sK0K/YG4x1HnHPYRfFW6c3xXoz0/Q5lku3qKcPcX5fsvwEd4u+be3GxTAnGT8MV/prieQ6yMdYo1uTvxC+YXrj1sPHWBcbJfN3FakMprLKPLiLGVVLKqG/E4mQWUcp+STFNM1sPFQtPOl9rJWzpRKvZ4UCTY2HbpWQTbNFJUCw1mTDZjTVQ7xnCW2xnqsKELiJwgO6iFm0wTJ2qiJoO/iK9YAdy8ShsqREaxQh7EEbI1LCjJPrG+sGdyJeGeCcEYg2SHqMX7BdvVqCbqdrhSTy+QtGubCw7sAm2QiDwJFH22hqxMW4DWDVkGoRNkPQ2VgP+GAsZk08TjE/y8FgShMbJFUBK8XcXJQxFjSGYQncxQ2sx5h2AqVOvtXSXEGJVUJWjRgZGJKMH8wzZBz0r+anWGMZdmUlRrHmx0EVohB0LiK/zbQVYin3/KZkxTz58Gor/eK4n/x4nQiwJ8xPkXoDSndGvktPAiE/mrVd/xGRHlP8IUvMm5JYHaUxRG1x4ajhayDR7XmMf7BUz1U/uFX78T3WBzC6LjZXsP5EVjt4EZ/5B6iKS56doDAfr/A/QI5ZjIXKnOzzwHsg4ax/rCP2xnoxQtVYExXMRYsy1typbjQXMXsCZMCWUiKYK0FRlbgI/oC1nwUjxUVygZmn/RkbzM7VFImHDTGJr9YQv9ZLmFMV/37tRRYyOVqXXVcoKK+8XT0wO6TwWy9QlEzb6/N1Rl8y7t1HSqT+1r298v1hHWt3K0qIPUvml45q/QNPaUxhsUWBaAAAAABJRU5ErkJggg==')",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 25px rgba(0, 173, 159, 0.15)',
      },
    },
  },
  plugins: [],
}