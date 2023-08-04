import { browser }  from '$app/environment';

export function localStorageSet(key, val) {
	if(browser) {
		// console.log(typeof val);
		if(typeof val == 'object') {
			localStorage.setItem(key, JSON.stringify(val));
			// console.log(key + ': ' + JSON.stringify(val) + ' is set as object');
		}
		else {
			localStorage.setItem(key, val);
			// console.log(key + ' is set string');
		}
	}
}

export function localStorageGet(key) {
	if(browser) {
		let item = localStorage.getItem(key);
		if(item) {
			try {
				let parsed = JSON.parse(item)
				return parsed;
			}
			catch(err) {
				return item;
			}
		}
		else 
			return null;
	}
	else {
		return false;
	}
}
