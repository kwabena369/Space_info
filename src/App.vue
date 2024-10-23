<!-- App.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 bg-fixed bg-cover bg-center relative">
    <!-- Animated stars background -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="stars-1"></div>
      <div class="stars-2"></div>
      <div class="stars-3"></div>
    </div>
    
    <div class="relative z-10">
      <Header />
      <router-view class="min-h-[calc(100vh-160px)]"></router-view>
      <Footer />
    </div>
  </div>
</template>

<script>
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
export default {
  name: "Layout",
  components: {
    Header,
    Footer
  }
}
</script>

<style>
@keyframes twinkle {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

.stars-1, .stars-2, .stars-3 {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(white 1px, transparent 1px);
  background-size: 50px 50px;
  animation: twinkle 3s infinite;
}

.stars-2 {
  background-size: 100px 100px;
  animation-delay: 1s;
}

.stars-3 {
  background-size: 150px 150px;
  animation-delay: 2s;
}
</style>