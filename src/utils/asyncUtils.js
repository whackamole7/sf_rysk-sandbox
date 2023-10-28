import { clearArray } from "./dataTypesUtils/arrayUtils";



export const resolvePromisesPack = async (pack, packLimit, allPromisesLength, currentIndex) => {
	const lastPackLength = allPromisesLength % packLimit;

	const isLastPack = currentIndex + 1 > (allPromisesLength - lastPackLength);

	if (isLastPack) {
		packLimit = lastPackLength;
	}

	if (pack.length >= packLimit) {
		await Promise.all(pack);
		clearArray(pack);

		return;
	}
}