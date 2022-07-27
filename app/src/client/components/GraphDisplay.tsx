import * as React from 'react';
import ReactFlow, { Edge, MarkerType, Node, Position, useEdgesState, useNodesState } from 'react-flow-renderer';
import Graph from '../../utility/graph';
import dagre from 'dagre';
import { SmartBezierEdge } from '@tisoap/react-flow-smart-edge'

// NOTE: currently everything is being done in front-end, maybe should try backend later
const GraphDisplay: React.FC<{ graph: Graph, graphDir?: string }> = ({ graph, graphDir }): React.ReactElement => {
	const dagreGraph = new dagre.graphlib.Graph();
	dagreGraph.setDefaultEdgeLabel(() => ({}));

	const nodeWidth = 200;
	const nodeHeight = 100;

	// initializing reactl-flow graph elements
	const [nodes, setNodes] = useNodesState([]);
	const [edges, setEdges] = useEdgesState([]);

	const edgeTypes = React.useMemo(() => ({
		smart: SmartBezierEdge
	}), []);

	// converts the text in the text area into Graph then into Nodes and edges
	// suitable to be a value for ReactFlow's nodes and edges props
	function convertGraphToFlowElements(graph: Graph): [Node[], Edge<any>[]] {
		// convert each  node in the graph into a react-flow node
		let resultNodes: Node[] = [];
		graph.nodes.forEach((val: string, _index: number): void => {
			// color the background of the node 
			// based off of where it belongs

			const inStartNodes: boolean = graph.startNodes.includes(val);
			const inFinalNodes: boolean = graph.finalNodes.includes(val);

			let nodeStyle: React.CSSProperties;
			if (inStartNodes && inFinalNodes)
				nodeStyle = { backgroundColor: 'lightpink' };
			else if (inStartNodes)
				nodeStyle = { backgroundColor: 'yellow' };
			else if (inFinalNodes)
				nodeStyle = { backgroundColor: 'lightgreen' };
			else nodeStyle = { backgroundColor: 'white' };

			resultNodes.push({
				id: val,
				data: { label: val },
				style: nodeStyle,
				position: { x: 0, y: 0 },
			});
		});

		// convert each  edge in the graph into a react-flow edge
		let resultEdges: Edge<any>[] = [];
		graph.edges.forEach((outNodes: string[], key: string): void => {
			outNodes.forEach((val: string, _index: number): void => {
				const [node1, input] = key.split(",");

				let updatedLabel: boolean = false;
				for (let edge of resultEdges)
					if (edge.source === node1 && edge.target === val) {
						edge.label += " | " + input;
						updatedLabel = true;
					}
				if (!updatedLabel)
					resultEdges.push({
						id: node1 + '-' + input + '-' + val,
						source: node1,
						target: val,
						label: input,
						type: 'smart',
						animated: true,
						// todo: not working for some reason :(
						markerEnd: MarkerType.ArrowClosed,
					});
			});
		});

		return [resultNodes, resultEdges];
	}

	// grabbed from react-flow dagre example
	function getLayoutedFlowElements(nodes: Node[], edges: Edge[], direction = 'TB') {
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
			node.targetPosition = isHorizontal ? Position.Left : Position.Top;
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


	// every time the input graph changes
	// recreate the graph
	React.useEffect(() => {
		const updatedNodeEdgePre = convertGraphToFlowElements(graph);
		const updatedNodeEdge = getLayoutedFlowElements(updatedNodeEdgePre[0], updatedNodeEdgePre[1], graphDir);
		setNodes((newNodes: Node[]): Node[] => {
			newNodes = updatedNodeEdge.nodes;
			return newNodes;
		});

		setEdges((newEdges: Edge<any>[]): Edge<any>[] => {
			newEdges = updatedNodeEdge.edges;
			return newEdges;
		});
	}, [graph]);

	return (
		<div className="graph-display">
			<ReactFlow
				nodes={nodes} edges={edges}
				nodesConnectable={false}
				elementsSelectable={false}
				edgeTypes={edgeTypes}
				fitView />
		</div>
	);
}

export default GraphDisplay;
