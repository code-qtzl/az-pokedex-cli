import { startREPL } from './repl.js';
import { initState } from './state.js';

export async function main() {
	const state = initState();
	await startREPL(state);
}

main().catch((error) => {
	console.error('Fatal error:', error);
	process.exit(1);
});
