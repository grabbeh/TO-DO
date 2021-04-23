module.exports = {
  purge: ['./pages/*.js', './components/*.js', './pages/*/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      primary: '#3490dc',
      secondary: '#ffed4a',
      danger: '#e3342f',
      lightYellow: '#fef5de'
    }),
    fontFamily: {
      sans: ['Segoe UI', 'system-ui'],
      nerko: ['NerkoOne'],
      serif: ['ui-serif', 'Georgia']
    },
    extend: {}
  },
  variants: {
    scrollbar: ['rounded']
  },
  plugins: [require('@tailwindcss/custom-forms'), require('tailwind-scrollbar')]
}
