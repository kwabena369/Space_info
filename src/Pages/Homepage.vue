<template>
    <div
     
    class="
  
    ">
     <div class="enjoy 
      p-5 flex flex-col items-center 
      justify-center text-white">
        <P>
         This web app is designed to cater to space enthusiasts 
         by providing information on various space-related categories. It offers real-time tracking of the International Space Station (ISS), including its location on a leaflet map and the distance from the user's current location. While the ISS section is fully functional,
           the Mars section is pending and will be developed further

        </P>
     </div>


    <div class="font-sans text-3xl 
    w-fit font-semibold
     text-white
  border-b-2 border-pink-400 p-2  m-auto  ">
     Categories
    </div>
         <div class=" flex flex-wrap
          space-y-2 
         items-center
         justify-center
          p-4
         space-x-4 ">
 <!--  here are the cards for the showing of the  -->
 

 <router-link 
 to="/iss"
 >
   
  <div class="card_one border-2 border-gray-700
   hover:border-blue-400
  font-sans text-2xl
  rounded-lg
bg-bg_ISS
 bg-center bg-cover bg-no-repeat
 flex items-center justify-center
w-64
h-80
   
  ">

     <span class="border-2 border-white text-white
     p-1 rounded-lg font-sans text-2xl">
         I.S.S-Info
     </span>
  </div>
</router-link>

   
   <router-link to="/mars">

  <div class="card_one border-2 border-gray-700
  font-sans text-2xl
  hover:border-blue-400

  rounded-lg
bg-bg_mars
 bg-center bg-cover bg-no-repeat
 flex items-center justify-center
w-64
h-80
   
  ">

     <span class="border-2 border-white text-white
     p-1 rounded-lg font-sans text-2xl">
         Mars-Info
     </span>
  </div>
</router-link>
   


         </div>

         
    </div>
</template>

<script>
    export default {
        name:"Home_Page"
    }
</script>

<style  scoped>

</style>