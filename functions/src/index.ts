import { Router } from 'worktop';
import { preflight } from 'worktop/cors';

declare var LIKES: KVNamespace;

const API = new Router();

// Cors stuff
API.prepare = preflight({
	origin: '*', // allow any `Origin` to connect
	headers: ['Cache-Control', 'Content-Type'],
	methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
});

API.add('GET', '/likes/:blogID', async (req, res) => {
	const { blogID = '' } = req.params;

	if (blogID === '') {
		return res.send(422, { message: "blogID can't be empty" });
	}

	const likesStr = await LIKES.get(blogID);

	if (likesStr === null) {
		// Create kv for this blogID
		await LIKES.put(blogID, `0`);

		return res.send(200, { likes: 0 });
	}

	const likes = +likesStr;

	if (isNaN(likes)) {
		return res.send(418, {
			message: 'likes are stored in a format which is non-convertible to number',
		});
	}

	res.send(200, { likes });
});

API.add('POST', '/likes/:blogID', async (req, res) => {
	const { blogID = '' } = req.params;

	if (blogID === '') {
		return res.send(422, { message: "blogID can't be empty" });
	}

	const { operation = '' } = await req.body.json();

	if (!['inc', 'dec'].includes(operation)) {
		return res.send(422, { message: '`operation` should be either `inc` or `dec`' });
	}

	const likesStr = await LIKES.get(blogID);

	if (likesStr === null) {
		return res.send(404, { message: "blogID doesn't exists" });
	}

	const incrementVal = operation === 'inc' ? +1 : -1;
	await LIKES.put(blogID, `${+likesStr + incrementVal}`);

	return res.send(200, { message: 'success' });
});

addEventListener('fetch', (e) => {
	e.respondWith(API.run(e));
});
