<template>
  <div
  class="bg-bg_header
  flex flex-col items-stretch justify-between

    bg-center bg-cover bg-no-repeat">
    
  
   <Header />
       

  <router-view class="h-[90%]"></router-view>
   
  <Footer />
  </div>
</template>

<script>
 import Header from './components/Header.vue';
  import Footer from './components/footer.vue';
  export default {
     name:"layouts", 
     components:{
      Header,
      Footer
     }
  }
</script>

<style scoped>

</style>