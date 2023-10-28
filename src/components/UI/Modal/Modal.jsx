import useScrollLock from '../../../hooks/useScrollLock';
import './Modal.scss';
import ReactModal from "react-modal";
import cx from "classnames";
import { useEffect } from 'react';

ReactModal.setAppElement('#root');
ReactModal.defaultStyles = {};

const Modal = ({
	children,
	className,
	isOpen,
	setIsOpen,
	isObligatory,
	reset,
}) => {

	useScrollLock(isOpen);

	useEffect(() => {
		if (!isOpen && reset) {
			reset();
		}
	}, [isOpen]);

	return (
			<ReactModal
				className={cx(className, "App-box")}
				isOpen={isOpen}
				onRequestClose={() => {
					if (isObligatory) {
						return;
					}
					setIsOpen(false);
				}}
				overlayElement={(props, contentElement) => {
					return (
						<div {...props}>
							{contentElement}
							{!isObligatory && (
								<button
									className="ReactModal__Close-btn"
								/>
							)}
						</div>
					)
				}}
				closeTimeoutMS={300}
			>
				{children}
			</ReactModal>
	);
};

export default Modal;