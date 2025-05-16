import { computed, onMounted, ref } from "vue"
import { GameStatus,type Pokemon, type PokemonListResponse } from "../interfaces"
import { pokemonApi } from "../api/pokemonApi";
import confetti from 'canvas-confetti';


export const usePokemonGame = () => {


    const gameStatus = ref<GameStatus>(GameStatus.Playing);
    const pokemons = ref<Pokemon[]>([]);
    const pokemonOptions = ref<Pokemon[]>([]);

    const randomPokemon = computed(() =>{
        return pokemonOptions.value[Math.floor(Math.random() * pokemonOptions.value.length)]
    })

    const isloading = computed(() => pokemons.value.length === 0);


    const getPokemons = async (): Promise<Pokemon[]> => {
    const response = await pokemonApi.get<PokemonListResponse>('/?limit=151');

    const pokemonsArray = response.data.results.map((pokemon) => {
        // Extraer el ID de forma robusta con regex
        const id = Number(pokemon.url.match(/\/(\d+)\/?$/)?.[1]) || 0;

        return {
            name: pokemon.name,
            id,
        };
    });

    // Mezclar los pokemons aleatoriamente
    return pokemonsArray.sort(() => Math.random() - 0.5);
};


    const getNextOptions = (howmany: number = 5) => { 
        gameStatus.value = GameStatus.Playing;
        pokemonOptions.value = pokemons.value.slice(0, howmany);
        pokemons.value = pokemons.value.slice(howmany);
    }


    const checkAnswer = (id: number) => {
        const hasWon = randomPokemon.value.id === id;

        if (hasWon) {
            gameStatus.value = GameStatus.Won;
            confetti({
                particleCount: 300,
                spread: 70,
                origin: {
                    y: 0.6
                }
            });
            return;
        } 

        gameStatus.value = GameStatus.Lost;
    }

    onMounted(async() =>{

        await new Promise((resolve) => setTimeout(resolve, 1000));
        pokemons.value = await getPokemons();
        getNextOptions();

        console.log(pokemonOptions.value);
    });

    return{
        gameStatus,
        isloading,
        pokemonOptions,
        randomPokemon,
        //Metodos
        getNextOptions,
        checkAnswer,
    };
}