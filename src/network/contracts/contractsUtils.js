import { popErrorToast, popSuccessTransactionToast } from './../../utils/toastsUtils';


export const sendTransaction = (chainId, fn, args = [], successMsgContent, setIsLoading, callback) => {
	if (setIsLoading) {
		setIsLoading(true);
	}

	return (
		fn(...args)
			.then(tx => {
				console.log(`Submitting:`, tx);
				
				tx.wait().then(res => {
					popSuccessTransactionToast(chainId, successMsgContent, tx.hash);

					if (setIsLoading) {
						setIsLoading(false);
					}
					
					if (callback) {
						callback(res);
					}
				}, (e) => {
					popErrorToast(e, setIsLoading);
				})
			}, (e) => {
				popErrorToast(e, setIsLoading);
			})
	)
	
}