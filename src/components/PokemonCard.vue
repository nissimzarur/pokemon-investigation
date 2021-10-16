<template>
  <div class="card">
    <h1>title</h1>
    <h1>some text...</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PokemonCard",
});
</script>

<style scoped>
.card {
  display: flex;
  justify-content: center;
  flex-flow: column;
  border-style: solid;
  border-width: 1px;
  max-width: 200px;
  padding: 5px;
  margin: 5px;
}
</style>
