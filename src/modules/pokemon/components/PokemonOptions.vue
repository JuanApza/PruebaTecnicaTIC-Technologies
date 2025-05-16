<template>
  <section class="mt-5 flex flex-wrap justify-center">
    <button
      v-for="{ name, id } in options"
      :key="id"
      @click="$emit('selectedOption', id)"
      :class="['capitalize disabled:shadow-none disabled:bg-gray-100 disabled:cursor-not-allowed',
        {correct: id === correctAnswer && blockSelection,
          inconrrect: id !== correctAnswer && blockSelection,
        }
      ]"
      :disabled="blockSelection"
    >
      {{ name }}
    </button>
  </section>
</template>

<script setup lang="ts">
import type { Pokemon } from '../interfaces';

interface Props {
  options: Pokemon[];
  blockSelection: boolean;
  correctAnswer: number;
}

defineProps<Props>();

defineEmits<{
    selectedOption: [id: number];
}>();

</script>
<style scoped>
@reference "@/assets/styles.css";
button {
 @apply bg-neutral-50 shadow-md rounded-lg p-3 m-2 cursor-pointer  w-40 text-center transition-all hover:bg-gray-200;
}

.correct{
  @apply bg-green-200;
}

.inconrrect{
  @apply bg-red-200;
}
</style>
