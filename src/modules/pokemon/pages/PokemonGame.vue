<template>
  <!-- Loading -->
  <section
    v-if="isloading || randomPokemon.id === null"
    class="flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-b from-red-400 via-red-300 to-red-400"
  >
    <img
      src="@/assets/images/pokebola.png"
      alt="Pokebola cargando"
      class="pokeball-loader w-20 h-20 mb-4 drop-shadow-lg"
    />
    <p class="animate-pulse text-xl font-semibold text-white drop-shadow-md mb-2">
      Cargando los Pokemons
    </p>
  </section>

  <!-- Juego -->
  <section
    v-else
    class="flex flex-col items-center justify-center w-screen min-h-screen bg-gradient-to-t from-zinc-900 to-slate-200 p-4"
  >
    <!-- Título -->
    <h1
      class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-gray-100 to-red-400 drop-shadow-md text-center mb-6"
    >
      ¿Quién es este Pokémon?
    </h1>

    <!-- Botón de reinicio -->
    <div class="h-20 flex items-center justify-center">
      <button
        v-if="gameStatus !== GameStatus.Playing"
        @click="getNextOptions(5)"
        class="w-40 sm:w-48 h-10 sm:h-12 px-4 sm:px-8 py-2 sm:py-3 rounded-lg text-white text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500 border border-blue-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
      >
        Jugar de Nuevo
      </button>
    </div>

    <!-- Imagen del Pokémon -->
    <PokemonPicture
      :pokemon-id="randomPokemon.id"
      :show-pokemon="gameStatus === GameStatus.Won"
    />

    <!-- Opciones -->
    <PokemonOptions
      :options="options"
      :block-selection="gameStatus !== GameStatus.Playing"
      :correct-answer="randomPokemon.id"
      @selected-option="checkAnswer"
    />

    <PokemonList></PokemonList>

  </section>
</template>

<script setup lang="ts">
import PokemonPicture from '../components/PokemonPicture.vue';
import PokemonOptions from '../components/PokemonOptions.vue';
import PokemonList from '../components/PokemonList.vue';

import { usePokemonGame } from '../composables/usePokemonGame';
import { GameStatus } from '../interfaces';

const {
  getNextOptions,
  randomPokemon,
  isloading,
  gameStatus,
  pokemonOptions: options,
  checkAnswer,
} = usePokemonGame();
</script>
