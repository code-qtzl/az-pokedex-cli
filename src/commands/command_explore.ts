import type { State } from '../state.js';

export async function commandExplore(state: State, args: string[]) {
	if (args.length === 0) {
		throw new Error(
			'Please provide a location area name or id. Usage: explore <location-area-name-or-id>',
		);
	}

	const locationAreaNameOrId = args[0];
	const location = await state.pokeAPI.fetchLocation(locationAreaNameOrId);

	// List the found Pokemon in this location
	if (location && Array.isArray((location as any).pokemon_encounters)) {
		const encounters = (location as any).pokemon_encounters;
		if (encounters.length === 0) {
			console.log('Found Pokemon: None');
		} else {
			const pokemonNames = encounters.map((enc: any) => enc.pokemon.name);
			console.log('Found Pokemon:');
			for (const name of pokemonNames) {
				console.log(` - ${name}`);
			}
		}
	} else {
		console.log('Could not list pokemon for that location.');
	}
}
