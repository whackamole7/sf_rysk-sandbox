import './TooltipDecomposition.scss';
import Divider from './../../Divider/Divider';
import TooltipCustom from './../TooltipCustom';
import React from 'react';


const TooltipDecomposition = ({
	id,
	decompositionArr,
	...props
}) => {


	return (
		<TooltipCustom
			className="TooltipDecomposition"
			id={id}
			place="bottom-end"
			{...props}
		>
			{decompositionArr.map((data, i) => {
				const isLastChild = i === decompositionArr.length - 1;
				
				return (
					<React.Fragment key={i}>
						<div className="TooltipDecomposition__item">
							<div className="TooltipDecomposition__item-name">
								{data.nameNode}
							</div>
							<div className="TooltipDecomposition__item-value">
								{data.valueNode}
							</div>
						</div>

						{!isLastChild && <Divider />}
					</React.Fragment>
				)
			})}
		</TooltipCustom>
	);
};

export default TooltipDecomposition;