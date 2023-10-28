import { useEffect } from "react";
import { useScrollbarWidth } from 'react-use';

const ANIMATION_DURATION = 300;

const useScrollLock = (shouldLock) => {
	const scrollWidth = useScrollbarWidth();
	
	useEffect(() => {
		const curScrollWidth = window.innerWidth > 1025 ? scrollWidth : 0;
		if (shouldLock) {
			document.body.style.overflow = 'hidden';
			document.body.style.paddingRight = `${curScrollWidth}px`;
		} else {
			setTimeout(() => {
				document.body.style.overflow = 'unset';
				document.body.style.paddingRight = 0;
			}, ANIMATION_DURATION)
		}
 }, [shouldLock, scrollWidth]);
}

export default useScrollLock;