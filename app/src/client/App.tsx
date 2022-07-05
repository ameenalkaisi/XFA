import * as React from 'react';
import GraphCreator from './components/GraphCreator';

const App: React.FC<{}> = (): React.ReactElement => {
	return (
		<>
			<GraphCreator />
			<footer className="footer"><p className="footer__progress-text">This site is a work in progress. Made by Ameen Al-Kaisi 2022</p></footer>
		</>
	);
}

export default App;
