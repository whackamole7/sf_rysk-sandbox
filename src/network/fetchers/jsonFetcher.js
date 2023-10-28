

export const jsonFetcher = (url, callback) => fetch(url).then(res => res.json().then(res => {
	if (callback) {
		return callback(res);
	}
	return res;
}));