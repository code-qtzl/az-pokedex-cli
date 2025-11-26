import { State } from './state.js';

export async function startREPL(state: State) {
	const { readline: rl, commands } = state;

	rl.prompt();

	rl.on('line', async (input) => {
		const words = cleanInput(input);
		if (words.length === 0) {
			rl.prompt();
			return;
		}

		const commandName = words[0];
		const cmd = commands[commandName];

		if (!cmd) {
			console.log(
				`Unknown command: "${commandName}". Type "help" for a list of commands.`,
			);
			rl.prompt();
			return;
		}

		try {
			const args = words.slice(1);
			await cmd.callback(state, args);
		} catch (e) {
			const error = e as Error;
			// Check for network-related errors
			if (
				error.message.includes('fetch') ||
				error.message.includes('network') ||
				error.message.includes('HTTP') ||
				error.message.includes('Failed to fetch') ||
				error.name === 'TypeError' ||
				error.name === 'NetworkError'
			) {
				console.log(`Network error: ${error.message}`);
			} else {
				console.log(error.message);
			}
		}

		rl.prompt();
	});
}

export const cleanInput = (input: string): string[] => {
	const cleaned = input
		.toLocaleLowerCase()
		.trim() // Remove leading and trailing whitespace
		.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
		.split(' '); // Split by space
	return cleaned.filter((word) => word.length > 0); // Filter out empty strings
};
