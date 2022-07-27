import * as React from 'react';
import GraphCreator from './components/GraphCreator';
import Footer from './components/Footer';
import Info from './components/Info';
import { QueryClient, QueryClientProvider } from 'react-query';
import { trpc } from '../utility/trpc';
import superjson from 'superjson';

const App: React.FC<{}> = (): React.ReactElement => {
	const [queryClient] = React.useState(() => new QueryClient());
	const [trpcClient] = React.useState(() =>
		trpc.createClient({ transformer: superjson, url: 'http://localhost:43000/trpc' }));
	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<GraphCreator />
				<Info />
				<Footer />
			</QueryClientProvider>
		</trpc.Provider>
	);
}

export default App;
