<template>
  <section class="p-4 max-w-5xl mx-auto gap-10">
    <h2 class="text-2xl font-bold mb-4 text-center">Lista de Pokémon</h2>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      <div
        v-for="pokemon in pagedPokemons"
        :key="pokemon.name"
        class="bg-white rounded-lg shadow p-4 flex flex-col items-center"
      >
        <img
          :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${extractId(pokemon.url)}.png`"
          :alt="pokemon.name"
          class="w-20 h-20 hover:scale-105 transition-transform duration-300 ease-in-out hover:bg-gradient-to-t from-zinc-900 to-slate-200 p-4 rounded-lg"
        />
        <p class="capitalize mt-2 font-medium text-gray-700">{{ pokemon.name }}</p>
      </div>
    </div>

    <div class="h-[100px] flex justify-between items-center space-x-3 select-none">
      <button
        @click="prevPage"
        :disabled="paginaActual === 1"
        class="px-6 py-3 rounded-full bg-green-500 text-white font-semibold shadow-md hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-40 disabled:cursor-not-allowed transition duration-300 ease-in-out select-none"
      >
        « Anterior
      </button>

      <template v-for="page in visiblePages" :key="page">
        <button
          @click="paginaActual = page"
          :class="paginaActual === page
            ? 'bg-green-500 text-white font-bold cursor-default'
            : 'bg-green-400 hover:bg-green-300 text-green-900 font-semibold cursor-pointer'"
          class="w-10 h-10 flex items-center justify-center rounded-full transition shadow-md"
          aria-label="'Página ' + page"
        >
          {{ page }}
        </button>
      </template>

      <button
        @click="nextPage"
        :disabled="paginaActual === totalPaginas"
        class="px-6 py-3 rounded-full bg-green-500 text-white font-semibold shadow-md hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-40 disabled:cursor-not-allowed transition duration-300 ease-in-out select-none"
      >
        Siguiente »
      </button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted } from 'vue'

const paginaActual = ref(1)
const registrosPorPagina = 10
const totalPokemons = ref(0)
const pokemons = ref([] as any[])

// Traer lista de pokemons con paginación
const fetchPokemons = async () => {
  const offset = (paginaActual.value - 1) * registrosPorPagina
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${registrosPorPagina}&offset=${offset}`

  const res = await fetch(url)
  const data = await res.json()
  totalPokemons.value = data.count
  pokemons.value = data.results
}

onMounted(fetchPokemons)
watch(paginaActual, fetchPokemons)

const totalPaginas = computed(() => Math.ceil(totalPokemons.value / registrosPorPagina))

const pagedPokemons = computed(() => pokemons.value)

const prevPage = () => {
  if (paginaActual.value > 1) paginaActual.value--
}

const nextPage = () => {
  if (paginaActual.value < totalPaginas.value) paginaActual.value++
}

const extractId = (url: string) => {
  const parts = url.split('/')
  return parts[parts.length - 2]
}

// Generar un rango limitado de páginas para mostrar (e.g. 2 antes y después)
const visiblePages = computed(() => {
  const total = totalPaginas.value
  const current = paginaActual.value
  const delta = 2
  let start = Math.max(1, current - delta)
  let end = Math.min(total, current + delta)

  if (current <= delta) {
    end = Math.min(total, 5)
  } else if (current + delta >= total) {
    start = Math.max(1, total - 4)
  }

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})
</script>
