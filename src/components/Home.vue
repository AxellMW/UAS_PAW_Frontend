<template>
  <v-carousel>
    <v-carousel-item 
        v-for="(item, i) in items" 
        :key="i" :src="item.src" 
        reverse-transition="fade-transition" 
        transition="fade-transition">
    </v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  data: () => ({
    model: 0,
    items: [
      {
        src: "https://i.postimg.cc/pXc0NVjS/1.png",
      },
      {
        src: "https://i.postimg.cc/FzWxQGYS/2.jpg",
      },
      {
        src: "https://i.postimg.cc/4ySp0d0b/3.jpg",
      },
      {
        src: "https://i.postimg.cc/YSMLbY9B/4.jpg",
      },
    ],
  }),
};
</script>