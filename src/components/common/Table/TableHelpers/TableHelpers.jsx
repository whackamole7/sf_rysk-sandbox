import React from "react";
import { getMutedNode } from './../../../../utils/commonUtils';
import TableExpandableRow from './TableExpandableRow';
import cx from "classnames";
import { isUndefined } from 'swr/_internal';
import Accordion from './../../../UI/Accordion/Accordion';
import Divider from './../../../UI/Divider/Divider';



class TableHelper {
	constructor(structureData) {
		const { titleData, itemsData } = structureData;
		const dataKeys = Object.keys(titleData);

		this.titleData = titleData;
		this.itemsData = itemsData;
		this.dataKeys = dataKeys;
	}
}


export class TableDesktopHelper extends TableHelper {
	constructor(structureData) {
		super(structureData);
		
		this.getTitleRow = this.getTitleRow.bind(this);
		this.getItemsRows = this.getItemsRows.bind(this);
	}

	getTitleRow() {
		const titleCells = this._getCells(this.titleData, true);
		const titleRow = (
			<tr>{...titleCells}</tr>
		);

		return titleRow;
	}

	getItemsRows() {
		const rows = this.itemsData.map(itemData => {
			const itemRow = this._getItemRow(itemData);

			return (
				<React.Fragment key={itemData.id}>
					{itemRow}
				</React.Fragment>
			);
		})

		return (
			<React.Fragment key="rows">
				{rows}
			</React.Fragment>
		);
	}
	
	_getCells(data, isTitle) {
		return this.dataKeys.map(key => {
			const cellContent = data[key] ?? getMutedNode();
			
			return isTitle
				? <th key={key}>{cellContent}</th>
				: <td key={key}>{cellContent}</td>;
		});
	}

	

	_getItemRow(itemData) {
		const isExpandable = Boolean(itemData.children);
		const itemCells = this._getCells(itemData);
		
		const getDefaultRow = (className, onClick) => {
			return (
				<tr
					className={cx('Table__item', isExpandable && 'expandable', className)}
					onClick={onClick}
				>
					{...itemCells}
				</tr>
			)
		}

		const itemRow = isExpandable
			? this._getExpandableRow(itemData, getDefaultRow)
			: getDefaultRow();
		
		return itemRow;
	}

	_getExpandableRow(itemData, getParentNode) {
		const getChildNodes = (className) => {
			const childNodes = itemData.children.map(child => {
				const childCells = this._getCells(child);
				
				const childRow = (
					<tr key={child.id} className={cx('Table__child-item', className)}>
						{...childCells}
					</tr>
				);

				return childRow;
			});

			return childNodes;
		}

		return (
			<TableExpandableRow
				key={itemData.id}
				getParentNode={getParentNode}
				getChildNodes={getChildNodes}
			/>
		)
	}
}


export class TableMobileHelper extends TableHelper {
	constructor(structureData) {
		super(structureData);

		this._getItem = this._getItem.bind(this);
	}
	
	getItems() {
		return this.itemsData.map(this._getItem);
	}

	_renderItemRows(itemData) {
		const omittedKeys = itemData.omittedKeys;
		
		const rows = this.dataKeys.map(key => {
			const valueNode = itemData[key];

			const shouldOmit = omittedKeys && Boolean(omittedKeys.find(omittedKey => key === omittedKey));

			if (shouldOmit || isUndefined(valueNode)) {
				return null;
			}
			
			return (
				<div className={cx("Table__item-row info-row", key)}>
					<div className="info-row__title">
						{this.titleData[key]}
					</div>

					<div className="info-row__value">
						{valueNode}
					</div>
				</div>
			)
		})

		return rows;
	}
	

	// todo: make more universal
	_getItem(itemData) {
		return (
			<div className="Table__item App-box">
				{this._renderItemRows(itemData)}

				{itemData.children && (
					<>
						<Divider />

						<Accordion
							transitionTimeout={500}
							renderHeader={
								({ state }) => `${state.isEnter ? "Hide" : "Show"} full strategy`
							}
						>
							{itemData.children.map(childData => {
								return (
									<>
										<Divider />
										<div className="Table__child-item">
											{this._renderItemRows(childData)}
										</div>
									</>
								)
							})}
						</Accordion>
					</>
				)}
			</div>
		)
	}
}