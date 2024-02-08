/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/views/**/*.pug',],
  theme: {
    extend: {fontWeight: {
      'extrabolder': 900, // Puedes ajustar este valor según tus preferencias
    },colors: {

      JS: '#151A40',
      Titulos: '#003785', 
      Texto: '1465bb',
      Botones: '#A1C9F1'

      
     },
     fontFamily:{
      'Custom':['Roboto', 'Arial', 'sans-serif']
     }
    },
  },
  plugins: [],
}