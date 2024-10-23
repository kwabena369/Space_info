<!-- Header.vue -->
<template>
  <header class="py-6 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-center items-center">
        <div class="group cursor-pointer">
          <span class="text-white text-3xl font-bold border-2 border-white/50 rounded-lg px-6 py-3
                     backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-300
                     shadow-lg hover:shadow-white/20">
            Space.Info
            <span class="inline-block ml-2 transform group-hover:rotate-45 transition-transform duration-300">
              🚀
            </span>
          </span>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header"
}
</script>