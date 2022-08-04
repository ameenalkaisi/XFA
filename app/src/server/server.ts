import * as express from 'express';
import apiRouter from './routes';

import * as trpcExpress from '@trpc/server/adapters/express';
import * as trpc from '@trpc/server';

import Graph, { GraphSchema } from '../utility/graph';
import { convertNFAtoDFA } from '../utility/graph-utils';

import { z } from 'zod';

import * as session from 'express-session';

import superjson from 'superjson';


// TYPES OF SESSION
// decided to put it here until needed later
declare module 'express-session' {
	interface SessionData {
		prevHistory: string[],
	}
}

// useful for creating a "session" with the user
const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
	return {
		req,
		res
	}
};
type Context = trpc.inferAsyncReturnType<typeof createContext>;

const app = express();

const trpcRouter = trpc.router<Context>()
	//const trpcRouter = trpc.router()
	/*
	 // for debugging
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

			const result: Graph = convertNFAtoDFA(graph);
			return result.toSchemaGraph();
		}
	})
	.query('getPrevHistory', {
		//input: z.undefined,
		output: z.string().array().nullish(),
		async resolve({ ctx }) {
			// TODOTDOTODSJKFDJSL
			// set up the prevHistory z object and 
			// return it through to the client

			return ctx.req.session.prevHistory;
		}
	})
	.mutation('setPrevHistory', {
		input: z.string().array(),
		async resolve({ input, ctx }) {
			ctx.req.session.prevHistory = input.slice();
		}
	});

export type AppRouter = typeof trpcRouter;

app.use(session({
	secret: process.env.SESSION_SECRET || '',
	saveUninitialized: false,
	resave: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 // 1 day
	}
}));

app.use('/trpc',
	trpcExpress.createExpressMiddleware({
		router: trpcRouter,
		createContext
	}));

app.use(express.static('public'));
app.use(apiRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server listening on port: ${port}`));
