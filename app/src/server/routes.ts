import * as express from 'express';
import * as path from 'path';

const router = express.Router();

router.get('/*', (_req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default router;
