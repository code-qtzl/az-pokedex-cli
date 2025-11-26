import type { State } from '../state.js';

export async function commandPokedex(state: State, args: string[]) {
	const pokemonNames = Object.keys(state.pokedex).sort();

	console.log('Your Pokedex:');
	if (pokemonNames.length === 0) {
		console.log(' (empty)');
	} else {
		for (const name of pokemonNames) {
			console.log(` - ${name}`);
		}
	}
}
