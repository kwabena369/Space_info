/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.vue',
    // Add more patterns or file paths as needed
  ],
  
  theme: {
    extend: {
      backgroundImage:{
         "bg_header":"url(../src/assets/space_images/bg-image.jpeg)",
          "bg_mars":"url(../src/assets/space_images/mars-Picture.jpg)"
      ,
      "bg_ISS":"url(../src/assets/space_images/iss.png)"
      ,
      "bg_whole_page":"url(../src/assets/space_images/General_bg.jpeg)"
        }
        ,
         height:{
           "all":"100vh"
         }
    },
  },
  plugins: [],
}

