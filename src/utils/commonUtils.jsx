import Spinner from "../components/UI/Spinner/Spinner";
import cx from "classnames";


export const awaitLoading = (node, isLoading, loader = <Spinner />) => {
	return isLoading ? loader : node;
}

export const awaitLoadingDynamic = (getNodeFn, isLoading, loader = <Spinner />) => {
	return isLoading ? loader : getNodeFn();
}

export const getMutedNode = (text = "—", isSmall, isLight) => {
	return (
		<span
			className={cx("muted", isLight && "muted_light")}
			style={{fontSize: isSmall ? 13 : "inherit"}}
		>
			{text}
		</span>
	)
}

export const getErrorNode = (text = "Error") => {
	return (
		<span
			className="negative"
		>
			{text}
		</span>
	)
}


export const capitalizeFirstLetter = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
}