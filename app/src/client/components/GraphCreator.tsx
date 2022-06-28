import * as React from 'react';
import Graph from '../../utility/graph';
import ReactFlow, { ConnectionLineType, Edge, Node, Position, useEdgesState, useNodesState } from 'react-flow-renderer';
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

function getLayoutedFlowElements (nodes: Node[], edges: Edge[], direction = 'TB') {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node: Node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge: Edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node: Node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left :Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

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
		position: { x: 0, y: 0 }
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
	function convertGraphToFlowElements(graph: Graph): [Node[], Edge<any>[]] {
		// convert each  node in the graph into a react-flow node
		let resultNodes: Node[] = [];
		graph.nodes.forEach((val: string, index: number): void => {
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
		graph.edges.forEach((val: string[], _index: number): void => {
			resultEdges.push({
				id: val[0] + '-' + val[1],
				source: val[0],
				target: val[1],
				animated: true
			});
		});

		console.log(JSON.stringify(resultEdges));
		return [resultNodes, resultEdges];
	}

	function convertTATextToFlowElements(): [Node[], Edge<any>[]] {
		if (!textAreaText || !textAreaText.current)
			return [[], []];

		return convertGraphToFlowElements(parseText(textAreaText.current.value));
	}

	function debug() {
		// update graph when clicking debug
		const updatedNodeEdgePre = convertTATextToFlowElements();
		const updatedNodeEdge = getLayoutedFlowElements(updatedNodeEdgePre[0], updatedNodeEdgePre[1], 'LR');
		setNodes((newNodes: Node[]): Node[] => {
			newNodes = updatedNodeEdge.nodes;
			return newNodes;
		});

		setEdges((newEdges: Edge<any>[]): Edge<any>[] => {
			newEdges = updatedNodeEdge.edges;
			return newEdges;
		});
	}

	return (
		<div className="graph-creator">
			<ReactFlow style={{ width: "50em", height: "20em" }} 
				nodes={nodes} edges={edges} 
				connectionLineType={ConnectionLineType.SmoothStep} />
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
