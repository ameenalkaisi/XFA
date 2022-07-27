import { convertNFAtoDFA } from '../utility/graph-utils';
import { mapSafeReplacer, mapSafeReviver } from '../utility/util';
import * as express from 'express';
import * as path from 'path';

const router = express.Router();

router.get('/api/convertNFAtoDFA/', (req, res) => {
	const { graph } = req.query;

	if(graph === undefined)
		throw new Error('graph is undefined');

	// first, parse the input into a Graph, then convert it to DFA, and return the DFA as a graph
	res.send(JSON.stringify(convertNFAtoDFA(JSON.parse(graph.toString(), mapSafeReviver)), mapSafeReplacer));
});

router.get('/*', (_req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default router;
