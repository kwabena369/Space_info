import { createRouter,createWebHistory } from "vue-router";
 
 import Home_Page from "../Pages/Homepage.vue"
  import ISS_P from "../Pages/ISS_PAGE.vue"
//  here is the making of the route
 
 const routes =[
    {
         path:"/",
         name:"Home_Page",
         component : Home_Page
    }
     ,
    //   for the iss page
     {
         path : "/ISS",
         name : "ISS_PAGE",
         component:ISS_P
     }
 ]
  
//   for the doing of the real deal
 const main_router  = createRouter({
     history : createWebHistory(import.meta.env.BASE_URL),
      routes
 })
 
 export default main_router
