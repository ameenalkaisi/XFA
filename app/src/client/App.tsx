import * as React from 'react';
import GraphCreator from './components/GraphCreator';
import Footer from './components/Footer';
import Info from './components/Info';

const App: React.FC<{}> = (): React.ReactElement => {
	return (
		<>
			<GraphCreator />
			<Info />
			<Footer />
		</>
	);
}

export default App;
