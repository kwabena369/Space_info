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
      updateInterval: null,
      issIcon: null,
      userIcon: null
    }
  },

  mounted() {
    this.createCustomIcons()
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
    createCustomIcons() {
      // Modern ISS icon
      this.issIcon = L.divIcon({
        html: `
          <div class="iss-icon bg-red-400 w-[32px] h-[32px] bg-opacity-sm rounded-3xl ">
            <div class="iss-symbol">
              <div class="iss-body"></div>
             <SvgFile/>
              <div class="iss-panels"></div>
            </div>
          </div>`,
        className: 'iss-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      })

      // User location icon
      this.userIcon = L.divIcon({
        html: `
          <div class="user-icon">
            <div class="ping"></div>
            <div class="center-dot"></div>
          </div>`,
        className: 'user-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
    },

    initMap() {
      this.map = L.map('map').setView([0, 0], 2)
      
      // Modern, vibrant map style
      L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '©OpenTopoMap, ©OpenStreetMap contributors',
        maxZoom: 17
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
        this.marker = L.marker(this.issCoordinate, {
          icon: this.issIcon
        }).bindTooltip('ISS Location', {
          permanent: true,
          direction: 'top',
          offset: [0, -25],
          className: 'iss-tooltip'
        }).addTo(this.map)
      }
    },

    updateMyMarker() {
      if (this.myMarker) {
        this.myMarker.setLatLng(this.myLocation)
      } else {
        this.myMarker = L.marker(this.myLocation, {
          icon: this.userIcon
        }).bindTooltip('Your Location', {
          permanent: true,
          direction: 'top',
          offset: [0, -20],
          className: 'user-tooltip'
        }).addTo(this.map)
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
          color: '#2563eb',
          weight: 2,
          opacity: 0.8,
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
      const text = `This is so cool 😍 the iss  is Currently at: ${this.issCoordinate[0].toFixed(2)}, ${this.issCoordinate[1].toFixed(2)}`
      window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`)
    },

    copyCoordinates() {
      const coords = `${this.issCoordinate[0].toFixed(4)}, ${this.issCoordinate[1].toFixed(4)}`
      navigator.clipboard.writeText(coords)
    }
  },

  //  
}
</script>
 
<style scoped>
.leaflet-container {
  background: #f5f5f5;
}

.iss-marker {
  filter: drop-shadow(0 0 5px rgba(37, 99, 235, 0.5));
}

.iss-icon {
  width: 40px;
  height: 40px;
  position: relative;
}

.iss-symbol {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.iss-body {
  width: 24px;
  height: 12px;
  background: #2563eb;
  border-radius: 6px;
  position: relative;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.5);
}

.iss-panels {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 4px;
  background: #60a5fa;
  border-radius: 2px;
}

.iss-panels::before,
.iss-panels::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background: #93c5fd;
  border-radius: 50%;
  top: -2px;
}

.iss-panels::before {
  left: -4px;
}

.iss-panels::after {
  right: -4px;
}

.iss-tooltip {
  background: rgba(37, 99, 235, 0.9);
  border: none;
  color: white;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-marker .ping {
  width: 20px;
  height: 20px;
  background: rgba(220, 38, 38, 0.2);
  border-radius: 50%;
  animation: ping 1.5s ease-in-out infinite;
}

.user-marker .center-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: #dc2626;
  border-radius: 50%;
  border: 2px solid white;
}

.user-tooltip {
  background: rgba(220, 38, 38, 0.9);
  border: none;
  color: white;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}
</style>