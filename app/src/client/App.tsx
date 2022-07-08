import * as React from 'react';
import GraphCreator from './components/GraphCreator';
import Footer from './components/Footer';

const App: React.FC<{}> = (): React.ReactElement => {
	return (
		<>
			<GraphCreator />
			<Footer />
		</>
	);
}

export default App;
