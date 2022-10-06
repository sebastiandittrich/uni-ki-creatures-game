<template>
  <div
    class="bg-gray-100 absolute"
    v-for="index of count"
    :style="{
      height: '1px',
      left: 0,
      top: `${index * rowHeight}px`,
      width: `${width}px`,
    }"
  ></div>
</template>

<script setup lang="ts">
defineProps<{ width: number; count: number; rowHeight: number }>();
</script>
