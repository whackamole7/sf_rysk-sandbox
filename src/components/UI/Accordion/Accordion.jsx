import './Accordion.scss';
import { Accordion as AccordionRoot, AccordionItem } from '@szhsin/react-accordion';


const Accordion = ({
	children,
	transitionTimeout = 250,
	renderHeader = ({ state }) => {
		return state.isEnter ? "Hide" : "Show";
	},
}) => {

	return (
		<div className="Accordion">
			<AccordionRoot
				transition
				transitionTimeout={transitionTimeout}
			>
				<AccordionItem header={renderHeader}>
					{children}
				</AccordionItem>
			</AccordionRoot>
		</div>
	);
};

export default Accordion;