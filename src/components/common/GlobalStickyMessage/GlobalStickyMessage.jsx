import './GlobalStickyMessage.scss';


const GlobalStickyMessage = ({
	children
}) => {

	return (
		<div className="GlobalStickyMessage">
			{children}
		</div>
	);
};

export default GlobalStickyMessage;