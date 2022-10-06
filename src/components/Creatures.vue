<template>
  <div
    v-for="[creature, point] of creatures"
    :key="creature.id"
    :class="{
      'transition-[top_left]': transitionDuration > 0,
      'grid grid-cols-1 absolute items-stretch justify-items-stretch': true,
    }"
    :style="{
      width: `${columnWidth}px`,
      height: `${rowHeight}px`,
      left: `${columnWidth * point.x}px`,
      top: `${rowHeight * point.y}px`,
      ...(transitionDuration > 0 ? { transitionDuration: `${transitionDuration}ms` } : {}),
    }"
  >
    <Component :is="CreatureVue" :creature="creature" />
  </div>
</template>

<script setup lang="ts">
import { CreatureVue } from "../VueRenderer";
import type { Creature } from "@/creatures";

defineProps<{ creatures: Map<Creature, { x: number; y: number }>; columnWidth: number; rowHeight: number; transitionDuration: number }>();
</script>
