import { useCallback, useState } from 'react';

export const useTogglePopup = (closeCallback) => {
	const [isOpen, setIsOpen] = useState(false);

	const closePopup = useCallback(() => {
		document.removeEventListener('click', closePopup);
		setIsOpen(false);

		if (closeCallback) {
			closeCallback();
		}
	}, []);

	const openPopup = () => {
		if (isOpen) {
			return;
		}
		
		setIsOpen(true);
		setTimeout(() => {
			document.addEventListener('click', closePopup);
		}, 10);
	}
	

	return {
		isOpen,
		openPopup,
		closePopup,
	};
}