import * as React from 'react';
import GraphCreator from './components/GraphCreator';
import Footer from './components/Footer';
import Info from './components/Info';

const App: React.FC<{}> = (): React.ReactElement => {
	return (
		<>
			{/* 1. for mobile n stuff, 2. have different background for info page*/}
			<GraphCreator />
			<Info />
			<Footer />
		</>
	);
}

export default App;
