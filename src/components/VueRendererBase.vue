<template>
  <div>
    <div>Creatures: {{ creatures.size }}</div>
    <div class="relative border" :style="{ width: `${width}px`, height: `${height}px` }">
      <Columns :height="height" :count="columns - 1" :columnWidth="columnWidth" />
      <Rows :width="width" :count="rows - 1" :rowHeight="rowHeight" />
      <Creatures :creatures="creatures" :columnWidth="columnWidth" :rowHeight="rowHeight" :transitionDuration="transitionDuration" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Board, Creature } from "@/creatures";
import { computed, reactive, ref, toRaw } from "vue";
import Columns from "./Columns.vue";
import Rows from "./Rows.vue";
import Creatures from "./Creatures.vue";

const props = defineProps<{
  width: number;
  height: number;
  board: Board;
  transitionDuration: number;
}>();

const creatures = reactive<Map<Creature, { x: number; y: number }>>(new Map());
const columns = ref(props.board.width);
const rows = ref(props.board.height);

function update() {
  columns.value = props.board.width;
  rows.value = props.board.height;

  const temp = new Set<Creature>();
  for (const { cell, point } of props.board.getCells()) {
    for (const creature of cell.creatures) {
      if (creatures.has(creature)) {
        creatures.get(creature)!.x = point.x;
        creatures.get(creature)!.y = point.y;
      } else {
        creatures.set(creature, reactive({ x: point.x, y: point.y }));
      }
      temp.add(creature);
    }
  }
  for (const creature of creatures.keys()) {
    const rawCreature = toRaw(creature);
    if (!temp.has(rawCreature)) {
      creatures.delete(rawCreature);
    }
  }
}

const columnWidth = computed(() => props.width / columns.value);
const rowHeight = computed(() => props.height / rows.value);

defineExpose({ update });
</script>
