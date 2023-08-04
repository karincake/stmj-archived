// for the sake of backward compatibily, we do it manually
export function copyAvailableProp(src, dst) {
	Object.keys(src).forEach(function(key) {
		if (key in dst) {
			dst[key] = src[key];
		}
	});
}

export function cloneCleanObject(item) {
	const cleanObjData = {};
	for(const prop in item) {
		if(item[prop]) {
			cleanObjData[prop] = item[prop];
		}
	}
	return cleanObjData;
}

export function cleanObject(item) {
	for(const prop in item)
	if(!item[prop]) {
		delete item[prop];
	}
}
