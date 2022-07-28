import CustomMap, { CustomMapSchema } from '../utility/CustomMap';
import { z } from 'zod';

export const GraphSchema = z.object({
	nodes: z.array(z.string()),
	startNodes: z.array(z.string()),
	finalNodes: z.array(z.string()),
	inputs: z.array(z.string()),
	edges: CustomMapSchema
});

class Graph {
	public nodes: string[];

	public startNodes: string[];
	public finalNodes: string[];
	public inputs: string[];

	// Map of structure [Node, Input] -> ConnectedNodes
	// note the Node and Input are joined by a literal comma
	public edges: CustomMap;

	constructor() {
		this.nodes = [];
		this.startNodes = [];
		this.finalNodes = [];
		this.inputs = [];
		this.edges = new CustomMap();
	}

	public includesNode(node: string): boolean {
		return this.nodes.includes(node);
	}

	public includesInput(input: string): boolean {
		return this.inputs.includes(input);
	}

	// automatically add new nodes by when creating edges
	public addByEdge(node1: string, input: string, node2: string): void {
		if (!this.includesNode(node1))
			this.nodes.push(node1);

		if (!this.includesNode(node2))
			this.nodes.push(node2);

		if (!this.inputs.includes(input))
			this.inputs.push(input);

		// if node 1 edges have never been initialized
		// initialize it with one element node2
		// otherwise look for it then add it if it's 
		// not there
		const key: string = node1 + "," + input;
		if (!this.edges.has(key))
			this.edges.set(key, [node2]);
		// note, it definetly has the key
		// as every time it doesn't it will set it to 
		// an array of single element
		else if (!this.edges.get(key)?.includes(node2))
			this.edges.get(key)?.push(node2);
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

	public addInputs(...inputs: string[]): void {
		inputs.forEach((input: string, _index: number): void => {
			this.inputs.push(input);
		});
	}

	toSchemaGraph(): z.infer<typeof GraphSchema> {
		return {
			nodes: this.nodes,
			startNodes: this.startNodes,
			finalNodes: this.finalNodes,
			inputs: this.inputs,
			edges: {
				keys: this.edges.keys,
				values: this.edges.values
			}
		}
	}

	initFromSchemaGraph(graphSchema: z.infer<typeof GraphSchema>) {
		this.startNodes = graphSchema.startNodes.slice();
		this.finalNodes = graphSchema.finalNodes.slice();
		this.nodes = graphSchema.nodes.slice();
		this.inputs = graphSchema.inputs.slice();
		this.edges.values = graphSchema.edges.values;
		this.edges.keys = graphSchema.edges.keys.slice();
	}
}

export default Graph;
