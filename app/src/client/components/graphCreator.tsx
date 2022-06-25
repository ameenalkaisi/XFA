import * as React from 'react';
import Graph from '../../utility/graph';


const GraphCreator: React.FC<{}> = (): React.ReactElement => {
	const textAreaText = React.useRef<HTMLTextAreaElement>(null);

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

	function debug() {
		if (textAreaText && textAreaText.current)
			console.log(JSON.stringify(parseText(textAreaText.current.value + "")));
	}

	return (
		<div className="graph-creator">
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
