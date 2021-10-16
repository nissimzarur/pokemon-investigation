<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <div class="container">
      <div>
        <h1>Pokemon Investigation</h1>
      </div>
      <div class="card-container">
        <PokemonCard />
        <PokemonCard />
        <PokemonCard />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import PokemonCard from "@/components/PokemonCard.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    PokemonCard,
  },
});
</script>

<style scoped>
.container {
  display: flex;
  text-align: center;
  justify-content: center;
  flex-flow: column;
  align-items: center;
}
.card-container {
  display: flex;
  justify-content: center;
  max-width: 800px;
  flex-wrap: wrap;
}
</style>
