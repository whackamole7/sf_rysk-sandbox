import './Table.scss';
import cx from "classnames";
import useIsMobile from './../../../hooks/windowDimensionsHooks/useIsMobile';
import { TableDesktopHelper, TableMobileHelper } from './TableHelpers/TableHelpers';


const Table = ({
	structureData,
	className,
	children,
}) => {

	const isMobile = useIsMobile(576);

	const renderDesktopTable = (children) => {
		if (!children) {
			const DesktopHelper = new TableDesktopHelper(structureData);
			const { getTitleRow, getItemsRows } = DesktopHelper;

			children = [
				<thead key="head">{getTitleRow()}</thead>,
				<tbody key="body">{getItemsRows()}</tbody>
			]
		}
		
		
		return (
			<div className='Table__desktop'>
				<table>
					{children}
				</table>
			</div>
		)
	}

	const renderMobileTable = () => {
		const MobileHelper = new TableMobileHelper(structureData);
		const items = MobileHelper.getItems();


		return (
			<div className='Table__mobile'>
				{items}
			</div>
		);
	}


	const renderTableFromStructure = () => {
		if (isMobile) {
			return renderMobileTable();
		}

		return renderDesktopTable();
	}

	return (
		<div className={cx("Table", className)}>
			{children?.length
				? renderDesktopTable(children)
				: renderTableFromStructure()}
		</div>
	);
};

export default Table;