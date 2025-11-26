import type { State } from '../state.js';

export async function commandCatch(state: State, args: string[]) {
	if (args.length === 0) {
		throw new Error(
			'Please provide a Pokemon name. Usage: catch <pokemon-name>',
		);
	}

	const pokemonName = args[0];
	console.log(`Throwing a Pokeball at ${pokemonName}...`);

	try {
		const pokemon = await state.pokeAPI.fetchPokemon(pokemonName);

		// Determine if the Pokemon was caught (50% chance)
		const caught = Math.random() < 0.5;

		if (caught) {
			// Add Pokemon to pokedex
			state.pokedex[pokemon.name] = pokemon;
			console.log(`${pokemon.name} was caught!`);
		} else {
			console.log(`${pokemon.name} escaped!`);
		}
	} catch (error) {
		const err = error as Error;
		if (
			err.message.includes('404') ||
			err.message.includes('HTTP error! status: 404')
		) {
			throw new Error(`Could not find Pokemon: ${pokemonName}`);
		}
		throw error;
	}
}
