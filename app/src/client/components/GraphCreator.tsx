import * as React from 'react';
import Graph from '../../utility/graph';
import { convertNFAtoDFA, parseText } from '../../utility/graph-utils';
import GraphDisplay from './GraphDisplay';

const GraphCreator: React.FC<{}> = (): React.ReactElement => {
	// reference to text inside of text area for the graph's 
	// text representation 
	const textAreaText = React.useRef<HTMLTextAreaElement>(null);
	const [graph, setGraph] = React.useState<Graph>(new Graph());
	const [displayedGraph, setDisplayedGraph] = React.useState<Graph>(new Graph());

	function debug() {
		if (!textAreaText || !textAreaText.current)
			return;
		setGraph(parseText(textAreaText.current.value));
		//console.log(JSON.stringify(parseText(textAreaText.current.value)));
		let newDFAgraph: Graph = convertNFAtoDFA(parseText(textAreaText.current.value));
		setDisplayedGraph(newDFAgraph);
	}

	return (
		<div className="graph-creator">
			{
				// display input graph only if it's not empty
				graph.nodes.length !== 0 &&
				<>
					<section className="graph-creator__input-display">
						<label>Input graph</label>
						<GraphDisplay graph={graph} />
					</section>
				</>
			}
			<div className="graph-creator__input">
				<label htmlFor="graph-input">Enter the NFA</label>
				<textarea
					id="graph-input"
					className="graph-creator__input--textarea"
					placeholder={"Node1[s]->[edge-name]Node2,Node3,Node4[f]"
						+ "\nNode3->[another-edge-name]Node4"
						+ "\n\nNode can be in form (name)[in brackets, s if starting node,"
						+ "f if ending node, or nothing without brackets if just a middle node]"
						+ "\n\nThen graph is StartingNode->[input-in-brackets]FirstNode,SecondNode,..."}
					ref={textAreaText} />
				<button className="graph-creator__input--btn" onClick={debug}>Convert Graph!</button>
			</div>
			{/*<button onClick={debug} className="graph-creator__debug-btn">Debug</button>*/}

			{
				displayedGraph.nodes.length !== 0 &&
				// display output graph only if it's not empty
				<>
					<section className="graph-creator__output-display">
						<label>Output graph</label>
						<GraphDisplay graph={displayedGraph} />
					</section>
				</>
			}
		</div>
	);
}

export default GraphCreator;
