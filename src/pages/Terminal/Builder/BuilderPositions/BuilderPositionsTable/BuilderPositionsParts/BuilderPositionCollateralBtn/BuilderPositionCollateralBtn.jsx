import icon_pen from '../../../../../../../img/UI/pen.svg';


const BuilderPositionCollateralBtn = ({
	handleClick,
}) => {

	return (
		<button onClick={handleClick} className='shrink-0'>
			<img src={icon_pen} alt="Update Collateral" />
		</button>
	);
};

export default BuilderPositionCollateralBtn;