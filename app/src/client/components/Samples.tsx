import * as React from "react";
import { trpc } from '../../utility/trpc';

const Samples: React.FC<{
	textAreaText: HTMLTextAreaElement | null,
	applyConversion: Function
}> = ({ textAreaText, applyConversion }): React.ReactElement => {
	const samples = trpc.useQuery(['getSampleGraphs'])

	// import from file
	// maybe go through each file and load it 
	// files can be written in regular syntax

	return (
		<div className="graph-creator__samples">
			<h3>Samples</h3>
			<ul>
				{
					// query has to be finished and textAreaText has to 
					// be loaded then load all the list elements
					samples.data &&
					textAreaText &&
					samples.data.map((value, index) =>
						<li
							className="btn btn-secondary"
							key={index}
							onClick={() => { textAreaText.value = value; applyConversion() }}
						>{index}</li>)
				}

			</ul>
		</div>
	);
}

export default Samples;
