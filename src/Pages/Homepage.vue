<template>
  <div class="min-h-full px-4 py-8 md:py-12">
    <!-- Hero Section -->
    <div class="max-w-4xl mx-auto mb-12">
      <div class="bg-black/30 backdrop-blur-sm rounded-lg p-6 md:p-8 text-white">
        <h1 class="text-3xl md:text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Welcome to Space.Info
        </h1>
        <p class="text-lg md:text-xl leading-relaxed text-center text-gray-200">
          This web app is designed to cater to space enthusiasts by providing information on various space-related categories. It offers real-time tracking of the International Space Station (ISS), including its location on a leaflet map and the distance from your current location. While the ISS section is fully functional, the Mars section is pending and will be developed further.
        </p>
      </div>
    </div>

    <!-- Categories Section -->
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-white mb-8">
        <span class="border-b-4 border-pink-400 pb-2">Categories</span>
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
        <!-- ISS Card -->
        <router-link to="/iss" class="transform transition-all duration-300 hover:scale-105">
          <div class="relative group w-72 h-96 md:w-80 md:h-96 rounded-xl overflow-hidden">
            <div class="absolute inset-0 bg-bg_ISS bg-center bg-cover bg-no-repeat transition-transform duration-300 group-hover:scale-110"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="bg-black/50 backdrop-blur-sm border-2 border-white/50 rounded-lg p-4 transform transition-all duration-300 group-hover:scale-110">
                <span class="text-2xl font-bold text-white">
                  I.S.S-Info
                </span>
              </div>
            </div>
            <!-- Status Badge -->
            <div class="absolute top-4 right-4 bg-green-500 text-white text-sm px-3 py-1 rounded-full">
              Live
            </div>
          </div>
        </router-link>

        <!-- Mars Card -->
        <router-link to="/Mars" class="transform transition-all duration-300 hover:scale-105">
          <div class="relative group w-72 h-96 md:w-80 md:h-96 rounded-xl overflow-hidden">
            <div class="absolute inset-0 bg-bg_mars bg-center bg-cover bg-no-repeat transition-transform duration-300 group-hover:scale-110"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="bg-black/50 backdrop-blur-sm border-2 border-white/50 rounded-lg p-4 transform transition-all duration-300 group-hover:scale-110">
                <span class="text-2xl font-bold text-white">
                  Mars-Info
                </span>
              </div>
            </div>
            <!-- Status Badge -->
            <div class="absolute top-4 right-4 bg-yellow-500 text-white text-sm px-3 py-1 rounded-full">
              Coming Soon
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage"
}
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.router-link-active {
  animation: float 4s ease-in-out infinite;
}
</style>