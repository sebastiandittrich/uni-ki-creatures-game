<template>
  <div
    class="bg-gray-100 absolute"
    v-for="index of count"
    :style="{
      width: '1px',
      top: 0,
      left: `${index * columnWidth}px`,
      height: `${height}px`,
    }"
  ></div>
</template>

<script setup lang="ts">
defineProps<{ height: number; count: number; columnWidth: number }>();
</script>
