import { localStorageGet } from './local-storage.js';

var API_HOST = '';

export function setAPIHOST(apiHost) {
	API_HOST = apiHost;
}

export async function xfetch(url, opt, host) {
	if(!host)
		host = API_HOST;

	// make default header content-type for 'application/json'
	if(typeof opt != 'object') {
		opt = { headers : {}};
		opt['headers']['Content-Type'] = 'application/vnd.api+json';
	} else if(typeof opt.headers != 'object') {
		opt['headers'] = {};
		opt['headers']['Content-Type'] = 'application/vnd.api+json';
	} else if(!opt.headers['content-type']) {
		opt['headers']['Content-Type'] = 'application/vnd.api+json';
	}
	// last call
	if(!(opt.body instanceof FormData) && opt.headers != undefined) {
		opt['headers']['Content-Type'] = 'application/vnd.api+json';
		opt['body'] = JSON.stringify(opt['body']);
	}

	const token = localStorageGet('jwt');
	if(token) {
		opt['headers']['Authorization'] = 'Bearer ' + token;
	}

	const res = await fetch(host + url, opt);

	var finalRes = {};
	if(res.ok) {
		finalRes.status = 200;
		try {
			await res.json().then(val => {
				if(val.data || val.meta) {
					if(val.meta)
						finalRes.meta = val.meta;
					if(val.data)
						finalRes.data = val.data;
				} else {
					finalRes.value = val;
				}
			});
		} catch(err) {
			finalRes.value = null;
			finalRes.message = 'unknown data';
		}		  
	}
	else {
		finalRes.status = res.status;
		try {
			await res.json().then(thenJson => {
				if(thenJson.errors) {
					if(thenJson.errors.length > 0 || Object.keys(thenJson.errors).length > 0) {
						finalRes.errors = thenJson.errors;
					}
					if(thenJson.meta) {
						finalRes.meta = thenJson.meta;
					}
				}
				if(thenJson.message) {
					finalRes.message = thenJson.message;
				}
				if(!finalRes.errors && !finalRes.message) {
					finalRes.message = 'terjadi kesalahan pada server';
				}
			});
		} catch(err) {
			finalRes.message = `terjadi kesalahan pada server (${res.status}: ${res.statusText})`;
		}
	}

	return finalRes;
}
