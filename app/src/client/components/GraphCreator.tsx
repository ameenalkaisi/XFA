import * as React from 'react';
import Graph from '../../utility/graph';
import { parseTextToGraph } from '../../utility/graph-utils';
import GraphDisplay from './GraphDisplay';
//import axios from 'axios';
//import { mapSafeReplacer, mapSafeReviver } from '../../utility/util';
import { trpc } from '../../utility/trpc';
import Accordion from 'react-bootstrap/Accordion';

const GraphCreator: React.FC<{}> = (): React.ReactElement => {
	// reference to text inside of text area for the graph's 
	// text representation 
	const textAreaText = React.useRef<HTMLTextAreaElement>(null);
	const [prevInputs, setPrevInputs] = React.useState<Array<string>>([]);
	const [graph, setGraph] = React.useState<Graph>(new Graph());

	const [displayedGraph, setDisplayedGraph] = React.useState<Graph>(new Graph());

	//not sure what's going on here, but keeps giving undefined errors
	//still trpc is good to use as it makes end points easy to implement
	//@ts-ignore
	// depends on graph.toSchemaGraph(), not sure how it checks it but it works
	// without having to manually invalidate the query
	const displayedGraphQuery = trpc.useQuery(['convertNFAtoDFA', graph.toSchemaGraph()],
		{
			onSuccess: (data) => {
				let dfaGraph: Graph = new Graph();
				dfaGraph.initFromSchemaGraph(data);

				setDisplayedGraph(dfaGraph);
			}
		});
	// todo, finish prevHistory and delete this
	const prevHistoryQuery = trpc.useQuery(['getPrevHistory'], {
		onSuccess: (data) => {
			setPrevInputs(data ?? []);
		}
	});

	const prevHistoryMutation = trpc.useMutation(['setPrevHistory']);

	async function applyConversion() {
		if (!textAreaText || !textAreaText.current)
			return;

		// add this input into the history of inputs by user
		let newPrevInputs = prevInputs.slice();
		newPrevInputs.push(textAreaText.current.value);

		// don't add duplicate values
		newPrevInputs = newPrevInputs.filter((value, index, self) => {
			return self.indexOf(value) === index;
		});

		setPrevInputs(newPrevInputs);

		// set the stuff here!
		// ok to do this locally user should be able to easily
		let curGraph = parseTextToGraph(textAreaText.current.value);
		setGraph(curGraph);
		//trpcContext.invalidateQueries(['convertNFAtoDFA']);

		//console.log(JSON.stringify(parseTextToGraph(textAreaText.current.value)));
		//!---------------------------------------------- new stuff should be here, todo

		// Convert NFA to DFA server-side as it is more complicated
		// let newDFAgraph: Graph = convertNFAtoDFA(parseTextToGraph(textAreaText.current.value));
		/*await axios.get('/api/convertNFAtoDFA/', {
			params: { graph: JSON.stringify(curGraph, mapSafeReplacer) }
		}).then(response => {
			// on success, set the displayed graph
			setDisplayedGraph(JSON.parse(JSON.stringify(response.data), mapSafeReviver));
		}).catch(error => {
			if (error.response) {
				//response status is an error code
				console.log(error.response.status);
			}
			else if (error.request) {
				//response not received though the request was sent
				console.log(error.request);
			}
			else {
				//an error occurred when setting up the request
				console.log(error.message);
			}
		});*/
	}

	function updateTextAreaToHistIndex(index: number) {
		if (textAreaText.current) {
			textAreaText.current.value = prevInputs.at(index) ?? "";

			applyConversion();
		}
	}

	function removeHistoryIndex(index: number) {
		let newPrevInputs: string[] = prevInputs.slice();

		// shift the index to the end then pop
		for (let i: number = index; i < newPrevInputs.length - 1; ++i) {
			const temp: string = newPrevInputs[i + 1];
			newPrevInputs[i + 1] = newPrevInputs[i];
			newPrevInputs[i] = temp;
		}
		newPrevInputs.pop();

		setPrevInputs(newPrevInputs);
	}

	// every time prevInputs changes, update it on the server
	React.useEffect(() => {
		prevHistoryMutation.mutate(prevInputs);
	}, [prevInputs]);

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
				<button className="graph-creator__input--btn" onClick={applyConversion}>Convert Graph!</button>
			</div>
			{/*<button onClick={applyConversion} className="graph-creator__applyConversion-btn">Debug</button>*/}

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
			<section className='graph-creator__history'>
				{
					prevInputs.length !== 0 &&
					<Accordion>
						<Accordion.Item eventKey='0'>
							<Accordion.Header>History</Accordion.Header>

							<Accordion.Body>
								<ul>
									{
										prevInputs.map((value: string, index: number): React.ReactElement => {
											return (
												<li key={index}>
													<p
														className="btn btn-primary"
														onClick={updateTextAreaToHistIndex.bind(this, index)}>{value}</p>
													<button
														className="btn btn-warning"
														onClick={removeHistoryIndex.bind(this, index)}>X</button>
												</li>
											);
										})
									}
								</ul>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				}
			</section>
		</div>
	);
}

export default GraphCreator;
