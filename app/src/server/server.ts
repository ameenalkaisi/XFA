import * as express from 'express';
//import apiRouter from './routes';

import * as trpcExpress from '@trpc/server/adapters/express';
import * as trpc from '@trpc/server';
import { z } from 'zod';
import superjson from 'superjson';

import Graph from '../utility/graph';
import { convertNFAtoDFA } from '../utility/graph-utils';

const app = express();
const trpcRouter = trpc.router()
	.middleware(async ({ path, type, ctx, next, rawInput, meta }) => {
		const start = Date.now();
		const result = await next();
		const durationMs = Date.now() - start;
		result.ok
			? console.log('OK request timing:', { path, type, durationMs, ctx, rawInput, meta })
			: console.log('Non-OK request timing', { path, type, durationMs, ctx, rawInput, meta });

		return result;
	})
	.query('convertNFAtoDFA', {
		input: z.instanceof(Graph),
		output: z.instanceof(Graph),
		async resolve(input) {
			return convertNFAtoDFA(input.input);
		}
	})
	.transformer(superjson);

app.use('/trpc',
	trpcExpress.createExpressMiddleware({
		router: trpcRouter
	}));
app.use(express.static('public'));
//app.use(apiRouter);

const port = process.env.PORT || 43000;
app.listen(port, () => console.log(`Server listening on port: ${port}`));

export type AppRouter = typeof trpcRouter;
