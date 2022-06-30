import Graph from './graph';

export function convertNFAtoDFA(graph: Graph): Graph {
	// somehow do it omega lol
}

export function followNode(graph: Graph, node: string): string[] {
	if(graph.edges[node])
		return graph.edges[node];

	return [];
}
