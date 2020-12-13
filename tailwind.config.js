module.exports = {
  purge: ['./pages/*.js', './components/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Segoe UI', 'system-ui'],
      nerko: ['NerkoOne'],
      serif: ['ui-serif', 'Georgia']
    },
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/custom-forms')]
}
