import { xfetch } from '../app/request.js';

export async function submit(path, item) {
	//
	var submitRes = {
		errorMessage: null,
		errors: {},
		status: null,
	}
	const reqResult = await xfetch(path, {
			method: 'POST',
			body: JSON.stringify(item)
		});

	submitRes.status = reqResult.status;
	if(reqResult.status == 422) {
		if(reqResult.errors && reqResult.errors.length > 0) {
			const localErrors = {};
			reqResult.errors.forEach((val) => {
				localErrors[val.pointer] = val.message;
			});
			submitRes.errors = localErrors;
		}
		if(reqResult.message) {
			submitRes.errorMessage = reqResult.message;
		}
	} else  {
		if(reqResult.message) {
			submitRes.errorMessage = reqResult.message;
		} else {
			submitRes.errorMessage = 'terjadi kesalahan pada server';
		}
	}
	console.log(submitRes);
	return submitRes;
}
