<template>
  <footer class="backdrop-blur-md bg-black/50 py-6 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col items-center space-y-2 text-white/90">
        <div class="flex items-center space-x-2">
          <img src="https://www.nasa.gov/wp-content/themes/nasa/assets/images/nasa-logo.svg" 
               alt="NASA Logo" 
               class="h-8 w-auto filter brightness-0 invert" />
          <span class="text-lg font-medium">NASA-Sponsored</span>
        </div>
        <div class="text-sm text-white/70">
          Exploring the cosmos, one byte at a time
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer"
}
</script>