import * as express from 'express';
//import apiRouter from './routes';

import * as trpcExpress from '@trpc/server/adapters/express';
import * as trpc from '@trpc/server';

import Graph, { GraphSchema } from '../utility/graph';
import { convertNFAtoDFA } from '../utility/graph-utils';

import superjson from 'superjson';

const app = express();
const trpcRouter = trpc.router()
	/*
	.middleware(async ({ path, type, ctx, next, rawInput, meta }) => {
		const start = Date.now();
		const result = await next();
		const durationMs = Date.now() - start;
		result.ok
			? console.log('OK request timing:', { path, type, durationMs, ctx, rawInput, meta })
			: console.log('Non-OK request timing', { path, type, durationMs, ctx, rawInput, meta });

		return result;
	})
	*/
	.transformer(superjson)
	.query('convertNFAtoDFA', {
		input: GraphSchema,
		output: GraphSchema,
		async resolve(input) {
			// convert things here, then push it out using schema probably
			let graph: Graph = new Graph();
			graph.initFromSchemaGraph(input.input);

			/*
			graph.addStartNodes(...input.input.startNodes);
			graph.addFinalNodes(...input.input.finalNodes);
			graph.nodes = input.input.nodes.slice();
			graph.addInputs(...input.input.inputs);
			graph.edges.values = input.input.edges.values.slice();
			graph.edges.keys = input.input.edges.keys.slice();
			*/

			const result: Graph = convertNFAtoDFA(graph);
			return result.toSchemaGraph();
		}
	});

export type AppRouter = typeof trpcRouter;

app.use('/trpc',
	trpcExpress.createExpressMiddleware({
		router: trpcRouter
	}));
app.use(express.static('public'));
//app.use(apiRouter);

const port = process.env.PORT || 43000;
app.listen(port, () => console.log(`Server listening on port: ${port}`));

