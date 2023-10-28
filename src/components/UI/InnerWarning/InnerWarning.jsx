import './InnerWarning.scss';

const InnerWarning = (props) => {
	const {
		children
	} = props;

	return (
		<div className="InnerWarning">
			{children}
		</div>
	);
};

export default InnerWarning;