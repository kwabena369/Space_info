<template>
  <div class="min-h-screen bg-gray-900 p-4 md:p-8">
    <!-- Header -->
    <header class="max-w-6xl mx-auto mb-8">
      <h1 class="text-4xl md:text-5xl font-bold text-center text-white mb-4">
        Mars Rover Photos
        <span class="inline-block w-3 h-3 ml-2 rounded-full bg-red-500 animate-pulse"></span>
      </h1>
      <p class="text-gray-300 text-center text-lg">Explore photos taken by NASA's Mars rovers</p>
    </header>

    <!-- Controls -->
    <div class="max-w-6xl mx-auto mb-8">
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-gray-300 text-sm mb-2">Rover</label>
          <select 
            v-model="selectedRover"
            class="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
          >
            <option value="curiosity">Curiosity</option>
            <option value="opportunity">Opportunity</option>
            <option value="spirit">Spirit</option>
          </select>
        </div>
        
        <div class="flex-1 min-w-[200px]">
          <label class="block text-gray-300 text-sm mb-2">Camera</label>
          <select 
            v-model="selectedCamera"
            class="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
          >
            <option value="">All Cameras</option>
            <option value="fhaz">Front Hazard Camera</option>
            <option value="rhaz">Rear Hazard Camera</option>
            <option value="mast">Mast Camera</option>
            <option value="chemcam">Chemistry and Camera Complex</option>
            <option value="mahli">Mars Hand Lens Imager</option>
            <option value="mardi">Mars Descent Imager</option>
            <option value="navcam">Navigation Camera</option>
          </select>
        </div>

        <div class="flex-1 min-w-[200px]">
          <label class="block text-gray-300 text-sm mb-2">Sol (Martian Day)</label>
          <input 
            type="number" 
            v-model="sol"
            min="0"
            class="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
          >
        </div>

        <div class="flex-1 min-w-[200px] flex items-end">
          <button 
            @click="fetchPhotos"
            class="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg p-2 transition-colors"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Loading...' : 'Get Photos' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="max-w-6xl mx-auto text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-6xl mx-auto">
      <div class="bg-red-500/20 text-red-200 p-4 rounded-xl text-center">
        {{ error }}
      </div>
    </div>

    <!-- Photos Grid -->
    <div v-else class="max-w-6xl mx-auto">
      <div v-if="photos.length === 0 && !isLoading" class="text-center text-gray-400 py-12">
        No photos found for the selected criteria. Try different settings.
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="photo in photos" 
          :key="photo.id"
          class="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden group hover:transform hover:scale-[1.02] transition-all duration-300"
        >
          <div class="relative aspect-square">
            <img 
              :src="photo.img_src"
              :alt="'Mars photo by ' + photo.rover.name"
              class="w-full h-full object-cover"
              @click="selectedPhoto = photo"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <p class="text-white font-medium">{{ photo.camera.full_name }}</p>
                <p class="text-gray-300 text-sm">
                  Sol: {{ photo.sol }} | Earth Date: {{ formatDate(photo.earth_date) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-8 flex justify-center gap-4">
        <button 
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span class="px-4 py-2 bg-gray-800 text-white rounded-lg">
          Page {{ currentPage }}
        </span>
        <button 
          @click="nextPage"
          :disabled="photos.length < 25"
          class="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Photo Modal -->
    <div 
      v-if="selectedPhoto"
      class="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
      @click="selectedPhoto = null"
    >
      <div class="max-w-4xl w-full" @click.stop>
        <img 
          :src="selectedPhoto.img_src"
          :alt="'Mars photo by ' + selectedPhoto.rover.name"
          class="w-full h-auto rounded-xl shadow-2xl"
        >
        <div class="mt-4 text-white">
          <h3 class="text-xl font-bold">{{ selectedPhoto.camera.full_name }}</h3>
          <p class="text-gray-300">
            Taken by {{ selectedPhoto.rover.name }} on Sol {{ selectedPhoto.sol }}
            ({{ formatDate(selectedPhoto.earth_date) }})
          </p>
          <button 
            @click="selectedPhoto = null"
            class="mt-4 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Mars',
  
  data() {
    return {
      photos: [],
      isLoading: false,
      error: null,
      selectedRover: 'curiosity',
      selectedCamera: '',
      sol: 1000,
      currentPage: 1,
      selectedPhoto: null,
      API_KEY: 'VdpZZjj84ywVqHzTsGE4yn26EIs4KoZaHF3oHc6T'
    }
  },

  mounted() {
    this.fetchPhotos()
  },

  methods: {
    async fetchPhotos() {
      this.isLoading = true
      this.error = null
      this.photos = []

      try {
        const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${this.selectedRover}/photos`
        
        const params = {
          sol: this.sol,
          page: this.currentPage,
          api_key: this.API_KEY
        }

        // Only add camera parameter if a camera is selected
        if (this.selectedCamera) {
          params.camera = this.selectedCamera
        }

        const response = await axios.get(url, { params })
        this.photos = response.data.photos
        
        if (this.photos.length === 0) {
          this.error = 'No photos found for the selected criteria. Try different settings.'
        }
      } catch (error) {
        console.error('Error fetching Mars photos:', error)
        this.error = 'Failed to fetch Mars photos. Please try again later.'
      } finally {
        this.isLoading = false
      }
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchPhotos()
      }
    },

    nextPage() {
      if (this.photos.length === 25) {  // NASA API returns 25 photos per page
        this.currentPage++
        this.fetchPhotos()
      }
    }
  }
}
</script>

<style scoped>
.aspect-square {
  aspect-ratio: 1;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>