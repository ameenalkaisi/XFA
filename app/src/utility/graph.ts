class Graph {
	public nodes: string[];

	public startNodes: string[];
	public finalNodes: string[];

	// Map of structure [Node, Input] -> ConnectedNodes
	// note the Node and Input are joined by a literal comma
	public edges: Map<string, string[]>;

	constructor() {
		this.nodes = [];
		this.startNodes = [];
		this.finalNodes = [];
		this.edges = new Map<string, string[]>();
	}

	public includesNode(node: string): boolean {
		return this.nodes.includes(node);
	}

	// automatically add new nodes by when creating edges
	public addByEdge(node1: string, input: string, node2: string): void {
		if (!this.includesNode(node1))
			this.nodes.push(node1);

		if (!this.includesNode(node2))
			this.nodes.push(node2);

		// if node 1 edges have never been initialized
		// initialize it with one element node2
		// otherwise look for it then add it if it's 
		// not there
		const key: string = node1 + "," + input;
		if(!this.edges.has(key))
			this.edges.set(key, [node2]);
		//@ts-ignore
		else if(!this.edges.get(key).includes(node2))
			//@ts-ignore
			this.edges.get(key).push(node2);
	}

	// after pushing every node, set the nodes that are 
	// meant to be start nodes
	public addStartNodes(...nodes: string[]): void {
		nodes.forEach((node: string, _index: number): void => {
			this.startNodes.push(node);
		});
	}
	
	// after pushing every node, set the nodes that are 
	// meant to be final nodes
	public addFinalNodes(...nodes: string[]): void {
		nodes.forEach((node: string, _index: number): void => {
			this.finalNodes.push(node);
		});
	}
}

export default Graph;
