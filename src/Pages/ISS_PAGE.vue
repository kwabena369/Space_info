<template>
  <div
  class="h-all">
    <div id="map"
     class="border-2 border-solid rounded-xl
       w-96 m-auto" style="height: 400px;">
      </div>
 

      <div class="title
       w-fit m-auto  text-2xl text-white font-semibold">
     <span>
       I.S.S
     </span>
   </div>
   
    <!-- here is the horizontal bar for the numerical 
    values of the iss -->
<div class="great_info
 flex flex-row space-x-2 items-center
  h-fit
  rounded-2xl p-1
bg-none
text-black
   m-auto w-fit 
 justify-center">

  <!-- for the distance -->
   
  
<div class="distance_btn flex
flex-col
 rounded-3xl
 p-5
 m-1
space-y-2 font-sans text-center 
items-center justify-center
text-2xl 
">
   <span
    class="border-b-2 border-solid
    border-blue-500 text-white
    ">
    Distance/km 
   </span>
    <span class="
    bg-gray-100 rounded-md p-2 ">
{{       distance
}}    </span>
</div>

</div>



</div>
 

</template>

<script>
import 'leaflet/dist/leaflet.css';
import {getDistance} from "geolib"
import L from 'leaflet';
import iss from "../sricpt/iss_info"
import customIconUrl from '../assets/space_images/iss.png'; // Replace with the correct path to your image
import customIconUrl_2 from '../assets/space_images/person.png'; // Replace with the correct path to your image
 export default {
   name:"ISS_INFO",
  data() {
    return {
      iss_cordinate: [0, 0],
       my_location : [0,0],
       polyline: null, // Add this variable to store the polyline
        line_cordinate : [0,0]
        ,
        distance : 0

    };
  },
  mounted() {
    this.initializeMap();
    this.Iss_updating();
    // this.Plot_my_location();
     
    //  checking if they are going to 
    //  allow the use of the navigation
    if(navigator.geolocation){
        // we are going to access the
      navigator.geolocation.watchPosition((position)=>{
          //  console.log(position.coords)
           this.my_location = [position.coords.latitude, position.coords.longitude];

        // Call the method to plot the location
        this.Plot_my_location(this.my_location);
        this.drawPolyline(); // Call drawPolyline when my_location changes

        })
      }
  },
  methods: {

    initializeMap() {
      // Initialize the map
      this.map = L.map('map').setView([0, 0], 2);

      // Add a tile layer (e.g., OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
    },
    Iss_updating() {
      setInterval(async () => {
        const issData = await iss._get_iss_location();
        const { longitude, latitude } = issData.iss_position;
        this.iss_cordinate = [latitude, longitude];
       this.line_cordinate = [this.iss_cordinate,this.my_location]


         // Remove the existing polyline if it exists
    if (this.polyline) {
      this.map.removeLayer(this.polyline);
    }

    // Create a new polyline between the ISS and your location
    this.polyline = L.polyline(this.line_cordinate, {
      color: 'blue', 
      opacity:0.7// You can customize the color and other options
    }).addTo(this.map);

    //   for the distance calculation


      }, 1000);
    },
    // this is method for
    // the repeated plotting of my current 
    // location
    Plot_my_location(my_location){

      const customIcon = L.icon({
    iconUrl: customIconUrl_2, // Replace with the actual path to your image file
    iconSize: [32, 32], // Adjust the size as needed
    iconAnchor: [16, 32], // Adjust the anchor point as needed
  });


            this.my_maker
             = L.marker(my_location,{icon:customIcon}).addTo(this.map);
    },

    drawPolyline() {
  
  },



  },
  watch: {
    iss_cordinate(newCordinates) {
      let lastUpdateTime = new Date();
      // Remove the previous marker
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }



  let location1 = { latitude: this.iss_cordinate[0],
     longitude: this.iss_cordinate[1] };
  let location2 = { latitude: this.my_location[0],
     longitude: this.my_location[1] };


  // Calculate the distance between the two locations (result in meters)
this.distance = getDistance(location2, location1)/1000;


  
      const customIcon_3 = L.icon({
    iconUrl: customIconUrl, // Replace with the actual path to your image file
    iconSize: [32, 32], // Adjust the size as needed
    iconAnchor: [16, 32], // Adjust the anchor point as needed
  });

      // Create a new marker with the updated coordinates
      this.marker = L.marker([newCordinates[0],newCordinates[1]],{icon:customIcon_3}).addTo(this.map);
      this.drawPolyline(); // Call drawPolyline when iss_cordinate changes

    },

    my_location(newLocation) {
    this.drawPolyline(); // Call drawPolyline when my_location changes
  },


  },
};
</script>
