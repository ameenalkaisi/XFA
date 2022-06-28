import * as React from 'react';
import Graph from '../../utility/graph';
import ReactFlow, { Edge, Node, useEdgesState, useNodesState } from 'react-flow-renderer';

const GraphCreator: React.FC<{}> = (): React.ReactElement => {
	const textAreaText = React.useRef<HTMLTextAreaElement>(null);
	const [nodes, setNodes] = useNodesState([{
		id: '1',
		data: { label: 'Node 1' },
		position: { x: 0, y: 0 }
	},
	{
		id: '2',
		data: { label: 'Node 2' },
		position: { x: 20, y: 50 }
	}]);

	const [edges, setEdges] = useEdgesState([]);

	// todo: it is a "pane" that lets you create graphs inside of import
	// has options of graph objecs: 1. <start node>, 2. <end node>, 3. <middle node>, 4. <line segment>
	// note: 1-3 options could be one if possible
	// "infer text-option" button
	// otherwise make it only through this, and add syntax parsing related stuff
	function parseText(text: String): Graph {
		let result = new Graph();
		let lines = text.split('\n');

		// for each line, add each implied edge
		for (let i = 0; i < lines.length; ++i) {
			if (lines[i] == "") continue;

			let all_nodes = lines[i].split('->');
			let main_node = all_nodes[0];
			let other_nodes_str = all_nodes[1];
			let other_nodes = other_nodes_str.split(',');

			for (let j = 0; j < other_nodes.length; ++j)
				result.addByEdge(main_node, other_nodes[j]);
		}

		return result;
	}

	// converts the text in the text area into Graph then into Nodes and edges
	// suitable to be a value for ReactFlow's nodes and edges props
	function convertTATextToNodesEdges(): [Node[], Edge<any>[]] {
		if (!textAreaText || !textAreaText.current)
			return [[], []];

		let currentTAText: Graph = parseText(textAreaText.current.value);

		// convert each  node in the graph into a react-flow node
		let resultNodes: Node[] = [];
		currentTAText.nodes.forEach((val: string, index: number): void => {
			// push if NEW
			resultNodes.push({
				id: val,
				data: { label: 'Node ' + val },
				position: { x: index * 20, y: index * 100 },
				draggable: true
			});
		});

		// convert each  edge in the graph into a react-flow edge
		let resultEdges: Edge<any>[] = [];
		currentTAText.edges.forEach((val: string[], _index: number): void => {
			resultEdges.push({
				id: val[0] + '-' + val[1],
				source: val[0],
				target: val[1]
			});
		});

		console.log(JSON.stringify(resultEdges));
		return [resultNodes, resultEdges];
	}

	function debug() {
		// update graph when clicking debug
		const updatedNodeEdge = convertTATextToNodesEdges();
		setNodes((newNodes: Node[]): Node[] => {
			newNodes = updatedNodeEdge[0];
			return newNodes;
		});

		setEdges((newEdges: Edge<any>[]): Edge<any>[] => {
			newEdges = updatedNodeEdge[1];
			return newEdges;
		});
	}

	return (
		<div className="graph-creator">
			<ReactFlow style={{ width: "20em", height: "20em" }} nodes={nodes} edges={edges} />
			<textarea
				id="graph-text"
				rows={20}
				cols={50}
				placeholder="node#-connected_node#,connected_node#,..."
				ref={textAreaText} />
			<button>Convert Graph!</button>
			<button onClick={debug}>Debug</button>
		</div>
	);
}

export default GraphCreator;
