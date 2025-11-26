export type CacheEntry<T> = {
	val: T;
	createdAt: number;
};

export class Cache {
	#cache = new Map<string, CacheEntry<any>>();
	#reapIntervalID: NodeJS.Timeout | undefined = undefined; // used as a timer to know when to clean up old entries
	#interval: number; // to hold the interval (in milliseconds) for the timer.

	constructor(interval: number) {
		this.#interval = interval;
		this.#startReapLoop();
	}

	public add<T>(key: string, val: T): void {
		this.#cache.set(key, { val, createdAt: Date.now() });
	}

	public get<T>(key: string): T | undefined {
		const entry = this.#cache.get(key);
		if (!entry) {
			return undefined;
		}
		return entry.val;
	}

	#reap(): void {
		const now = Date.now();
		const cutoff = now - this.#interval;

		for (const [key, entry] of this.#cache.entries()) {
			if (entry.createdAt < cutoff) {
				this.#cache.delete(key);
			}
		}
	}

	#startReapLoop(): void {
		this.#reapIntervalID = setInterval(() => {
			this.#reap();
		}, this.#interval);
	}

	public stopReapLoop(): void {
		if (this.#reapIntervalID) {
			clearInterval(this.#reapIntervalID);
		}
	}
}
