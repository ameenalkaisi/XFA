import Graph from './graph';
import { Queue, array_safe_includes } from './util';

export function convertNFAtoDFA(graph: Graph): Graph {
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
				// if it's not there don't push notin
				// if it is there push sumn
				const nodesNext = graph.edges.get(node + ',' + input);
				if (nodesNext)
					generatedSublist.push(...nodesNext);
			}
			
			if(generatedSublist.length === 0)
				continue;

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
			for(let i = 1; i < generatedSublist.length; ++i)
				genString += "-" + generatedSublist[i];
			
			let nodeString: string = nodes[0];
			for(let i = 1; i < nodes.length; ++i)
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
