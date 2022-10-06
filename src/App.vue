<script setup lang="ts">
import { Board, Cow, Wolf, Grass } from "./creatures";
import { makeRound, spawnRandomCreatures } from "@/logic";
import VueRendererBase from "./components/VueRendererBase.vue";
import { onMounted, ref, type ComponentPublicInstance } from "vue";

const renderer = ref<ComponentPublicInstance<typeof VueRendererBase> | null>(null);

const speed = 500;
const board = new Board(20, 20);

onMounted(() => {
  init();
  setInterval(() => {
    update();
  }, speed);
});

function init() {
  spawnRandomCreatures(board, Cow, 0.01);
  spawnRandomCreatures(board, Wolf, 0.005);
  spawnRandomCreatures(board, Grass, 0.05);
  //   board.add({ x: 1, y: 1 }, new Cow("my cow"));
  // board.add({ x: 10, y: 10 }, new Grass("my grass"));
  //   board.add({ x: 0, y: 0 }, new Wolf("my wolf"));
}

window.update = update;

function _update() {
  makeRound(board);
  renderer.value?.update();
}
const timePerFrame = ref(0);

function update() {
  const start = new Date().getTime();
  _update();
  const end = new Date().getTime();
  timePerFrame.value = end - start;
}
</script>

<template>
  <div>
    <div>Time per Frame: {{ timePerFrame }}</div>
    <VueRendererBase ref="renderer" :width="600" :height="600" :board="board" :transitionDuration="speed" />
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
