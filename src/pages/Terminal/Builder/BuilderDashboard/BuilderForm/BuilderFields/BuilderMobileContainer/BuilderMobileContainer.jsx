import './BuilderMobileContainer.scss';
import cx from "classnames";
import Divider from './../../../../../../../components/UI/Divider/Divider';
import useIsMobile from './../../../../../../../hooks/windowDimensionsHooks/useIsMobile';



const BuilderMobileContainer = (props) => {
	const {
		strategyStructure,
		unstableFields,
		chosenStrikes,
		strikesDataArr,
		areStrikesLoading,
	} = props;
	

	const isMobile = useIsMobile();

	if (!isMobile) {
		return null;
	}
	
	
	return (
		<div className="BuilderMobileContainer BuilderForm__field">
			<div className="BuilderForm__field-header">
				Expiration Date
			</div>
			<div className="BuilderForm__field-body">
				{strategyStructure.map((structureKey, i) => {
					const isStrikeFieldVisible = areStrikesLoading || !!strikesDataArr[i];
					const isStrikeChosen = !!chosenStrikes[i];
					const hasCollateralField = !!unstableFields.collateral[i];
					const isLastItem = i === strategyStructure.length - 1;
					
					return (
						<div className="BuilderMobileContainer__item" key={i}>
							<div className={cx(
								"BuilderMobileContainer__item-date",
								isStrikeFieldVisible && "mb-7"
							)}>
								{unstableFields.date[i]}
							</div>
							<div className="BuilderMobileContainer__item-strike">
								{unstableFields.strike[i]}
							</div>
							{hasCollateralField && isStrikeChosen && (
								<div className={cx(
									"BuilderMobileContainer__item-collateral",
								)}>
									<div className="BuilderMobileContainer__item-title">
										<span className='tip' data-tooltip-id='BuilderForm_CollateralTooltip'>
											Collateral
										</span>
									</div>
									{unstableFields.collateral[i]}
								</div>
							)}

							{isStrikeFieldVisible && !isLastItem && (
								<Divider />
							)}
						</div>
					)
				})}

			</div>
		</div>
	);
};

export default BuilderMobileContainer;