import * as React from 'react';
import GraphCreator from './components/GraphCreator';
import Footer from './components/Footer';
import Info from './components/Info';
import { QueryClient, QueryClientProvider } from 'react-query';
//import { ReactQueryDevtools } from 'react-query/devtools';
import { trpc } from '../utility/trpc';
import superjson from 'superjson';

const App: React.FC<{}> = (): React.ReactElement => {
	const [queryClient] = React.useState(() => new QueryClient());
	const [trpcClient] = React.useState(() =>
		trpc.createClient({
			url: process.env.SERVER_URI + '/trpc',
			transformer: superjson,
			headers: () => ({
				authorization: process.env.SESSION_SECRET
			})
		}));
	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<a className="btn btn-tertiary" href={process.env.MAIN_SITE}>Back to main site</a>
				<GraphCreator />
				<Info />
				<Footer />
				{/*<ReactQueryDevtools />*/}
			</QueryClientProvider>
		</trpc.Provider>
	);
}

export default App;
