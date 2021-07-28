const purge = process.env.NODE_ENV === 'production' ? true : false;

module.exports = {
  purge: { enabled: purge, content: ['/renderer/resources/**/*.html']},
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
