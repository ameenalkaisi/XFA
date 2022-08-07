import { readdirSync, readFileSync } from 'fs';

function loadSampleGraph(file: string): string {
	return readFileSync(file).toString();
}

export function loadSampleGraphs(): string[] {
	const graphs: string[] = [];

	// note: if working dir is in xfa/app, assets is in src/assets
	const files = readdirSync("src/assets/samples");
	for (const file of files) {
		const filePath = "src/assets/samples/" + file;

		graphs.push(loadSampleGraph(filePath));
	}

	return graphs;
}
