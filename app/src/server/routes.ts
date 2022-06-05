import * as express from 'express';

const router = express.Router();
const path = require('path');

/*
router.get('/api/hello', (_req, res, _next) => {
    res.json('World');
});
*/

router.get('/*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default router;
