import { createApp } from 'vue'
import "./style.css"
import "leaflet/dist/leaflet.css";
import App from './App.vue'
//  here is the making use of the router there in the system
 import main_router from "./routers/router.js"

createApp(App).use(main_router).mount('#app')
