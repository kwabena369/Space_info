<template>
  <div class="min-h-full p-4 md:p-8">
    <!-- Header -->
    <header class="max-w-6xl mx-auto mb-8">
      <h1 class="text-4xl md:text-5xl font-bold text-center text-white mb-4">
        ISS Live Tracker
        <span class="inline-block w-3 h-3 ml-2 rounded-full bg-red-500 animate-pulse"></span>
      </h1>
      <p class="text-gray-300 text-center text-lg">Track the International Space Station in real-time</p>
    </header>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <!-- Map Container -->
      <div class="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700">
        <div 
          id="map" 
          class="h-[500px] w-full rounded-xl overflow-hidden shadow-2xl"
        ></div>
        
        <!-- Stats Display -->
        <div class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div class="bg-gray-800/50 rounded-xl p-4">
            <h3 class="text-gray-400 text-sm">Distance</h3>
            <p class="text-2xl font-bold text-white">
              {{ Math.round(distance).toLocaleString() }} km
            </p>
          </div>
          <div class="bg-gray-800/50 rounded-xl p-4">
            <h3 class="text-gray-400 text-sm">Altitude</h3>
            <p class="text-2xl font-bold text-white">408 km</p>
          </div>
          <div class="bg-gray-800/50 rounded-xl p-4">
            <h3 class="text-gray-400 text-sm">Speed</h3>
            <p class="text-2xl font-bold text-white">7.66 km/s</p>
          </div>
        </div>
      </div>

      <!-- Info Panels -->
      <div class="space-y-6">
        <!-- Crew Panel -->
        <div class="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 class="text-2xl font-bold text-white mb-4">
            <span class="mr-2">👨‍🚀</span> Current Crew
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="(member, index) in crewMembers" 
              :key="index"
              class="bg-gray-800/50 rounded-xl p-4"
            >
              <div class="flex items-center space-x-3">
                <div class="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span class="text-xl">👨‍🚀</span>
                </div>
                <div>
                  <h3 class="text-white font-medium">{{ member.name }}</h3>
                  <p class="text-gray-400 text-sm">{{ member.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Share Panel -->
        <div class="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 class="text-2xl font-bold text-white mb-4">Share Location</h2>
          <div class="flex space-x-4">
            <button 
              @click="shareLocation" 
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 transition-colors"
            >
              Share Position
            </button>
            <button 
              @click="copyCoordinates" 
              class="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-2 px-4 transition-colors"
            >
              Copy Coordinates
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { getDistance } from 'geolib'
import iss from '../sricpt/iss_info'

export default {
  name: 'IssInfo',

  data() {
    return {
      map: null,
      marker: null,
      myMarker: null,
      polyline: null,
      issCoordinate: [0, 0],
      myLocation: [0, 0],
      distance: 0,
      crewMembers: [
        { name: 'Raja Chari', role: 'Commander' },
        { name: 'Tom Marshburn', role: 'Pilot' },
        { name: 'Kayla Barron', role: 'Mission Specialist' },
        { name: 'Matthias Maurer', role: 'Flight Engineer' }
      ],
      updateInterval: null
    }
  },

  mounted() {
    this.initMap()
    this.startTracking()
    this.initGeolocation()
  },

  beforeUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    if (this.map) {
      this.map.remove()
    }
  },

  methods: {
    initMap() {
      this.map = L.map('map').setView([0, 0], 2)
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap, ©CartoDB',
        maxZoom: 19
      }).addTo(this.map)
    },

    async startTracking() {
      const updatePosition = async () => {
        try {
          const issData = await iss._get_iss_location()
          this.issCoordinate = [
            parseFloat(issData.iss_position.latitude),
            parseFloat(issData.iss_position.longitude)
          ]
          this.updateIssMarker()
          this.updatePolyline()
          this.calculateDistance()
        } catch (error) {
          console.error('Failed to update ISS position:', error)
        }
      }

      await updatePosition()
      this.updateInterval = setInterval(updatePosition, 1000)
    },

    initGeolocation() {
      if (!navigator.geolocation) return

      navigator.geolocation.watchPosition(
        (position) => {
          this.myLocation = [
            position.coords.latitude,
            position.coords.longitude
          ]
          this.updateMyMarker()
          this.updatePolyline()
          this.calculateDistance()
        },
        (error) => {
          console.error('Geolocation error:', error)
        },
        { enableHighAccuracy: true }
      )
    },

    updateIssMarker() {
      if (this.marker) {
        this.marker.setLatLng(this.issCoordinate)
      } else {
        this.marker = L.marker(this.issCoordinate).addTo(this.map)
      }
    },

    updateMyMarker() {
      if (this.myMarker) {
        this.myMarker.setLatLng(this.myLocation)
      } else {
        this.myMarker = L.marker(this.myLocation).addTo(this.map)
      }
    },

    updatePolyline() {
      if (this.myLocation[0] === 0) return

      if (this.polyline) {
        this.map.removeLayer(this.polyline)
      }

      this.polyline = L.polyline(
        [this.issCoordinate, this.myLocation],
        {
          color: '#4CAF50',
          weight: 2,
          opacity: 0.6,
          dashArray: '5, 10'
        }
      ).addTo(this.map)
    },

    calculateDistance() {
      if (this.myLocation[0] === 0) return

      this.distance = getDistance(
        { latitude: this.issCoordinate[0], longitude: this.issCoordinate[1] },
        { latitude: this.myLocation[0], longitude: this.myLocation[1] }
      ) / 1000
    },

    shareLocation() {
      const text = `Check out the ISS! Currently at: ${this.issCoordinate[0].toFixed(2)}, ${this.issCoordinate[1].toFixed(2)}`
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`)
    },

    copyCoordinates() {
      const coords = `${this.issCoordinate[0].toFixed(4)}, ${this.issCoordinate[1].toFixed(4)}`
      navigator.clipboard.writeText(coords)
    }
  }
}
</script>

<style scoped>
.leaflet-container {
  background: #1a1a1a;
}
</style>