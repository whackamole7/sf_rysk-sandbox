import { toast } from "react-toastify";
import { formatErrorMessage, getErrorMessageFromObject } from "./errorHandling";
import { getExplorerUrl } from "../network/networkUtils";


export const popSuccessTransactionToast = (chainId, successMsgContent, hash) => {
	successMsgContent = convertDataToMessageContent(successMsgContent);
	
	const url = getExplorerUrl(chainId) + "/tx/" + hash;
	console.log(successMsgContent.text, "\n", url);

	toast.success(
		<div>
			<div>
				{successMsgContent.node}
			</div>
			<br />
			{hash &&
				<a href={url} target="_blank" rel="noopener noreferrer">
					View transaction
				</a>}
		</div>
	)
}

const convertDataToMessageContent = (data) => {
	if (typeof data === "string") {
		const text = data;

		data = {
			text,
			node: text,
		}
	}

	return data;
}

export const popSuccessToast = (successMsgContent) => {
	successMsgContent = convertDataToMessageContent(successMsgContent);
	
	console.log(successMsgContent.text);
	toast.success(successMsgContent.node);
}

export const popErrorToast = (errorObject, setIsLoading) => {
	const errorMsg = getErrorMessageFromObject(errorObject);
	const formattedErrorMsg = formatErrorMessage(errorMsg);

	console.error(errorObject);
	toast.error(
		<div>
			{formattedErrorMsg}
		</div>
	)

	if (setIsLoading) {
		setIsLoading(false);
	}
}