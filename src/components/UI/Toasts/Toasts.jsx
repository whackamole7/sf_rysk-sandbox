import { ToastContainer, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Toasts.scss';

const Toasts = () => {
	const Jelly = cssTransition({
		enter: "jellyIn",
		exit: "jellyOut",
	});
	
	return (
		<ToastContainer
			limit={2}
			transition={Jelly}
			position="bottom-right"
			hideProgressBar={true}
			newestOnTop={false}
			closeOnClick={false}
			draggable={false}
		/>
	);
};

export default Toasts;