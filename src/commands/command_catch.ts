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
			console.log('You may now inspect it with the inspect command.');
		} else {
			console.log(`${pokemon.name} escaped!`);
		}
	} catch (error) {
		console.log(`Could not find Pokemon: ${pokemonName}`);
	}
}
