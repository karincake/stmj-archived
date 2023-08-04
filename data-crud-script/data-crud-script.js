import { cloneCleanObject, copyAvailableProp } from '../common-snippets/object.js';

export function getSearchParamWithState(pagePath, itemFilter, useLastState) {
	if(useLastState) {
		copyAvailableProp(history.state, itemFilter);
	}
	const filterSearchParams = new URLSearchParams(cloneCleanObject(itemFilter));
	const filterString = filterSearchParams.toString();
	if(!useLastState) {
		const lastSearch = window.location.search || '';
		if(lastSearch != filterString) {
			window.history.pushState(itemFilter, null, `${pagePath}?${filterString}`);
		}
	}
	return filterString;
}
