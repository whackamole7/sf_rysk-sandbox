import useWindowDimensions from "./useWindowDimensions";


const useIsMobile = (mobileFrontier = 768) => {
	const { width } = useWindowDimensions();

	return width < mobileFrontier;
}

export default useIsMobile;