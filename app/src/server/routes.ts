import { convertNFAtoDFA } from '../utility/graph-utils';
import * as express from 'express';

const router = express.Router();
const path = require('path');

/*
router.get('/api/hello', (_req, res, _next) => {
	res.json('World');
});
*/

router.get('/api/convertNFAtoDFA/', (req, res) => {
	const { graph } = req.query;

	// first, parse the input into a Graph, then convert it to DFA, and return the DFA as a graph
	//@ts-ignore
	res.send(convertNFAtoDFA(graph));
});

router.get('/*', (_req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default router;
