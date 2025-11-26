import { Cache } from './pokecache.js';
import { describe, expect, test } from 'vitest';

describe('Cache', () => {
	test.concurrent.each([
		{ key: 'url1', value: { data: 'test1' } },
		{ key: 'url2', value: { data: 'test2' } },
		{ key: 'url3', value: { data: 'test3' } },
	])('should add and retrieve value for $key', ({ key, value }) => {
		const cache = new Cache(10000);
		cache.add(key, value);
		const retrieved = cache.get(key);
		expect(retrieved).toEqual(value);
		cache.stopReapLoop();
	});
});

test.concurrent.each([
	{
		key: 'https://example.com',
		val: 'testdata',
		interval: 500, // 0.5 seconds
	},
	{
		key: 'https://example.com/path',
		val: 'moretestdata',
		interval: 1000, // 1 second
	},
])('Test Caching $interval ms', async ({ key, val, interval }) => {
	const cache = new Cache(interval);

	cache.add(key, val);
	const cached = cache.get(key);
	expect(cached).toBe(val);

	await new Promise((resolve) => setTimeout(resolve, interval * 2));
	const reaped = cache.get(key);
	expect(reaped).toBe(undefined);

	cache.stopReapLoop();
});
