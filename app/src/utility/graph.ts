import {array_safe_includes} from './util';

class Graph {
	public nodes: string[];
	public edges: string[][];

	constructor() {
		this.nodes = [];
		this.edges = [];
	}

	public includesNode(node: string): boolean {
		return this.nodes.includes(node);
	}

	// automatically add new nodes by when creating edges
	public addByEdge(node1: string, node2: string): void {
		if (!this.includesNode(node1))
			this.nodes.push(node1);

		if (!this.includesNode(node2))
			this.nodes.push(node2);

		if (!array_safe_includes(this.edges, [node1, node2]))
			this.edges.push([node1, node2]);
	}
}

export default Graph;
