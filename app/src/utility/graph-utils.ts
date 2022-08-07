import Graph from './graph';
import { Queue, array_safe_includes } from './util';

export function convertNFAtoDFA(graph: Graph): Graph {
	// if empty graph, just return itself without any changes
	if (graph.nodes.length === 0)
		return graph;

	let result: Graph = new Graph();
	result.addStartNodes(graph.startNodes[0]);

	let visitedSubsets: string[][] = [];

	let nextVisit = new Queue<string[]>();
	nextVisit.enqueue([graph.startNodes[0]]);

	// keep going until all nodes are visited
	while (nextVisit.size() != 0) {
		const nodes: string[] | undefined = nextVisit.dequeue();

		if (!nodes || array_safe_includes(visitedSubsets, nodes))
			continue;

		visitedSubsets.push(nodes);

		// for each input
		for (const input of graph.inputs) {
			let generatedSublist: string[] = [];

			// find the list of nodes that this sublist can go into
			for (const node of nodes) {
				// for each input, apply it with node[i],
				// if NFA doesn't have input defined for that node, it must be a cycle
				//  so add self to generatedSublist
				// if it is there push sumn
				const nodesNext = graph.edges.get(node + ',' + input);
				if (nodesNext)
					generatedSublist.push(...nodesNext);
				else generatedSublist.push(node);
			}

			// add it into the resulting graph
			// filter to only have unique elements
			generatedSublist = generatedSublist.filter((value, index, self) => {
				return self.indexOf(value) === index;
			});

			// sort so that array_safe_includes always returns the correct result
			// when checking against visited list
			generatedSublist = generatedSublist.sort();

			nextVisit.enqueue(generatedSublist);

			// format generatedSublist and nodes so they have
			// names suitable for output
			let genString: string = generatedSublist[0];
			for (let i = 1; i < generatedSublist.length; ++i)
				genString += "-" + generatedSublist[i];

			let nodeString: string = nodes[0];
			for (let i = 1; i < nodes.length; ++i)
				nodeString += "-" + nodes[i];

			result.addByEdge(nodeString, input, genString);

			// add to final nodes if any of the current nodes have a final node in them
			if (generatedSublist.some((val: string): boolean => {
				return graph.finalNodes.includes(val);
			}))
				result.addFinalNodes(genString);
		}
	}

	return result;
}

// todo: it is a "pane" that lets you create graphs inside of import
// has options of graph objecs: 1. <start node>, 2. <end node>, 3. <middle node>, 4. <line segment>
// note: 1-3 options could be one if possible
// "infer text-option" button
// otherwise make it only through this, and add syntax parsing related stuff
// format: node can be [0-9a-zA-Z]*\[[sf]\]
// node->node[,node]*
export function findNodeType(node: string): 's' | 'f' | 'm' | 'sf' {
	// looks for text in between brackets
	const matches = node.match(/\[(.*)\]/);

	if (!matches)
		return 'm';

	// eventually will enforce syntactical checking
	// for now ignore the issue
	//@ts-ignore
	return matches[0].substring(1, matches[0].length - 1);
}

//the -> operator can have \[[0-9a-zA-Z]*\] next to it
//to assert INPUT
// realistically it's better to 
// implement using a parser solution
// but for now this will do
export function parseTextToGraph(text: string): Graph {
	let result = new Graph();
	let lines = text.split('\n');

	// for each line, add each implied edge
	for (let i = 0; i < lines.length; ++i) {
		if (lines[i] == "") continue;

		// parse character list
		if (lines[i].charAt(0) == '[') {
			// use characters [, ], and , as separators
			// filters to not include any empty characters
			let allInputs: string[] = lines[i].split(/[\],\[]/).filter((val: string, _index: number): boolean => {
				return val != '';
			});

			result.addInputs(...allInputs);
			continue;
		}

		// parse edge
		let allNodes = lines[i].split('->[');
		let mainNode = allNodes[0];

		// add main node to start/end based on its 
		// input and filter it
		let mainNodeType = findNodeType(mainNode);
		if (mainNodeType !== 'm') {
			mainNode = filterNonMiddleNode(mainNode);

			if (mainNodeType.includes('s'))
				result.addStartNodes(mainNode);
			if (mainNodeType.includes('f'))
				result.addFinalNodes(mainNode);
		}

		// input of the edge
		let input = allNodes[1].substring(0, allNodes[1].indexOf(']'));

		// grabbing list of nodes
		let otherNodes_str = allNodes[1].substring(allNodes[1].indexOf(']') + 1);
		let otherNodes = otherNodes_str.split(',');
		for (let j = 0; j < otherNodes.length; ++j) {
			let tempNode = otherNodes[j];

			let currentNodeType = findNodeType(tempNode);

			// add node to start/end based on input
			// and filter it
			if (currentNodeType !== 'm') {
				tempNode = filterNonMiddleNode(tempNode);

				if (currentNodeType.includes('s'))
					result.addStartNodes(tempNode);
				if (currentNodeType.includes('f'))
					result.addFinalNodes(tempNode);
			}

			result.addByEdge(mainNode, input, tempNode);
		}
	}

	return result;
}

export function filterNonMiddleNode(text: string): string {
	return text.substring(0, text.indexOf('['));
}

/*
function loadSampleGraph(file: string): Graph {
	readFile(file, (_err, data): void => {
		console.log(JSON.stringify(file));
	});

	return new Graph();
}

export function loadSampleGraphs(): Graph[] {
	const graphs: Graph[] = [];

	readdir("../assets/samples", (_err, files): void => {
		for (const file of files)
			graphs.push(loadSampleGraph(file));
	});

	return graphs;
}
*/
