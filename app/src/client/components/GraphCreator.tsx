import * as React from 'react';
import Graph from '../../utility/graph';
import GraphDisplay from './GraphDisplay';

const GraphCreator: React.FC<{}> = (): React.ReactElement => {
	// reference to text inside of text area for the graph's 
	// text representation 
	const textAreaText = React.useRef<HTMLTextAreaElement>(null);
	const [graph, setGraph] = React.useState<Graph>(new Graph());

	// todo: it is a "pane" that lets you create graphs inside of import
	// has options of graph objecs: 1. <start node>, 2. <end node>, 3. <middle node>, 4. <line segment>
	// note: 1-3 options could be one if possible
	// "infer text-option" button
	// otherwise make it only through this, and add syntax parsing related stuff
	// format: node can be [0-9a-zA-Z]*\[[sf]\]
	// node->node[,node]*
	function findNodeType(node: string): 's' | 'f' | 'm' | 'sf' {
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
	function parseText(text: string): Graph {
		let result = new Graph();
		let lines = text.split('\n');

		// for each line, add each implied edge
		for (let i = 0; i < lines.length; ++i) {

			if (lines[i] == "") continue;

			let allNodes = lines[i].split('->[');
			let mainNode = allNodes[0];

			// add main node to start/end based on its 
			// input and filter it
			let mainNodeType = findNodeType(mainNode);
			if (mainNodeType !== 'm') {
				mainNode = filterNonMiddleNode(mainNode);

				if (mainNodeType.includes('s'))
					result.addStartNodes(mainNode);
				if(mainNodeType.includes('f'))
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
					if (tempNode.includes('s'))
						result.addStartNodes(tempNode);
					if(tempNode.includes('f'))
						result.addFinalNodes(tempNode);
				}

				result.addByEdge(mainNode, input, tempNode);
			}
		}

		return result;
	}

	function filterNonMiddleNode(text: string): string {
		return text.substring(0, text.indexOf('['));
	}

	function debug() {
		if (!textAreaText || !textAreaText.current)
			return;
		setGraph(parseText(textAreaText.current.value));
		//console.log(JSON.stringify(parseText(textAreaText.current.value)));
	}

	return (
		<div className="graph-creator">
			{/* For now width/height are set in (s)css, but place here something eventually*/}
			<GraphDisplay graph={graph} />
			<textarea
				id="graph-text"
				placeholder={"Node1[s]->[edge-name]Node2,Node3,Node4[f]"
					+ "Node3->Node4"
					+ "\n\nNode can be in form (name)[in brackets, s if starting node,"
						+ "f if ending node, or nothing without brackets if just a middle node]"
					+ "\n\nThen graph is StartingNode->[input-in-brackets]FirstNode,SecondNode,..."}
				ref={textAreaText} />
			<button>Convert Graph!</button>
			<button onClick={debug}>Debug</button>
		</div>
	);
}

export default GraphCreator;
