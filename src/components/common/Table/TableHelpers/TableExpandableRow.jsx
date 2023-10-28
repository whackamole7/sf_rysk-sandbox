import { useToggle } from "react-use";
import cx from "classnames";



const TableExpandableRow = ({
	getParentNode,
	getChildNodes,
}) => {
	const [isExpanded, toggleExpanded] = useToggle(false);

	const expandedClass = cx(isExpanded && "expanded");
	
	const parentNode = getParentNode(expandedClass, toggleExpanded);
	const childNodes = getChildNodes(expandedClass);

	return (
		<>
			{parentNode}
			{...childNodes}
		</>
	)
}


export default TableExpandableRow;