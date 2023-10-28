import './Stages.scss';
import cx from "classnames";


const Stages = ({
	stagesArr
}) => {

	return (
		<div className="Stages">
			{stagesArr.map(stage => {
				return (
					<div
						key={stage.name}
						className={cx("Stages__item", stage.isActive && "active")}
					>
						{stage.name}
					</div>
				)
			})}
		</div>
	);
};

export default Stages;