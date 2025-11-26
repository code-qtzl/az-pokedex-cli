import { Cache } from './pokecache.js';

export class PokeAPI {
	private static readonly baseURL = 'https://pokeapi.co/api/v2';
	private cache: Cache;

	constructor(cacheInterval: number = 300000) {
		this.cache = new Cache(cacheInterval);
	}

	async fetchLocations(pageURL?: string | null): Promise<ShallowLocations> {
		const fullURL = `${
			pageURL ? pageURL : PokeAPI.baseURL + '/location-area'
		}`;
		const cached = this.cache.get<ShallowLocations>(fullURL);
		if (cached) {
			return cached;
		}
		const response = await fetch(fullURL, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'User-Agent':
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
			},
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const r = await response.json();
		this.cache.add(fullURL, r);
		return r;
	}

	async fetchLocation(locationName: string): Promise<Root> {
		const fullURL = PokeAPI.baseURL + '/location-area/' + locationName;
		const cached = this.cache.get<Root>(fullURL);
		if (cached) {
			return cached;
		}
		const response = await fetch(fullURL, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'User-Agent':
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
			},
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const r = await response.json();
		this.cache.add(fullURL, r);
		return r;
	}

	async fetchPokemon(pokemonName: string): Promise<Pokemon> {
		const fullURL =
			PokeAPI.baseURL + '/pokemon/' + pokemonName.toLowerCase();
		const cached = this.cache.get<Pokemon>(fullURL);
		if (cached) {
			return cached;
		}
		const response = await fetch(fullURL, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'User-Agent':
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
			},
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const r = await response.json();
		this.cache.add(fullURL, r);
		return r;
	}
}

export type Root = {
	id: number;
	name: string;
	game_index: number;
	location: Location;
	names: Name[];
};

export type ShallowLocations = {
	count: number;
	next: string | null;
	previous: string | null;
	results: {
		name: string;
		url: string;
	}[];
};

export type Location = {
	name: string;
	url: string;
};

export type Name = {
	name: string;
	language: Language;
};

export type Language = {
	name: string;
	url: string;
};

export type Pokemon = {
	id: number;
	name: string;
	base_experience: number;
	height: number;
	weight: number;
	abilities: Array<{
		ability: {
			name: string;
			url: string;
		};
	}>;
	types: Array<{
		type: {
			name: string;
			url: string;
		};
	}>;
};
