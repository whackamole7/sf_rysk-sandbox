import { absBigInt, formatBigInt, formatBigIntFree, formatTokenAmount, numberFromBigInt } from '../../../../../utils/dataTypesUtils/bigIntUtils';
import './BuilderPositionsTable.scss';
import Currency from '../../../../../components/common/Currency/Currency';
import StrikeBrief from '../../../../../components/common/StrikeBrief/StrikeBrief';
import cx from "classnames";
import { format } from 'date-fns';
import Table from './../../../../../components/common/Table/Table';
import { BUILDER_POSITION_ROLES, BUILDER_STRATEGIES_CONFIG } from '../../builderConstants';
import { getMutedNode } from './../../../../../utils/commonUtils';
import Links from './../../../../../components/common/Links/Links';
import { LGREY } from '../../../../../environment/constants/styleConstants';
import BuilderPositionCloseBtn from './BuilderPositionsParts/BuilderPositionCloseBtn/BuilderPositionCloseBtn';
import { sumObjectValues } from '../../../../../utils/dataTypesUtils/objectUtils';
import BuilderPositionCollateralBtn from './BuilderPositionsParts/BuilderPositionCollateralBtn/BuilderPositionCollateralBtn';
import Spinner from '../../../../../components/UI/Spinner/Spinner';
import useGodEye from '../../../../../environment/contextHooks/useGodEye/useGodEye';


const { PARENT_COMPLEX, CHILD } = BUILDER_POSITION_ROLES;


const TITLE_DATA = {
	strategy: "Strategy",
	amount: "Amount",
	strike: "Strike",
	premium:  	<span data-tooltip-id="Builder_PremiumTooltip" className="tip">
								Premium
							</span>,
	collateral: <span data-tooltip-id="BuilderForm_CollateralTooltip" className="tip">
								Collateral
							</span>,
	pnl: "PnL",
	liqPrice: "Liq. Price",
	delta: "Delta",
	vega: "Vega",
	gamma: "Gamma",
	theta: "Theta",
	rho: "Rho",
	expiry: "Expiration Date",
	closeBtn: ""
}

const BuilderPositionsTable = ({
	positions,
	openCollateralModal,
	openCloseModal,
	isLoadingComplete,
}) => {

	const { isConnected } = useGodEye();
	
	const getPositionValueNodes = (position) => {
		const { role, isOpening, isTotal } = position;
		const isParentComplex = role === PARENT_COMPLEX;
		const isChild = role === CHILD;
		
		const getStrategyNode = () => {
			if (isChild) {
				return "";
			}

			if (isTotal) {
				return getMutedNode("Total", false, true);
			}
			
			const { strategy } = position;
			const strategyConfig = BUILDER_STRATEGIES_CONFIG[strategy];

			const color = strategyConfig?.color;

			const icon_dropdown = (
				<svg className='icon-dropdown' xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
					<path d="M2 5L6.5 9L11 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				</svg>
			);
			
			return (
				<span className='flex items-center gap-x-4' style={{ color }}>
					{isOpening && <Spinner />}
					{strategy}
					{isParentComplex && icon_dropdown}
				</span>
			);
		}
		
		const getAmountNode = () => {
			const { asset, amount } = position;

			if (!amount) {
				return;
			}

			return (
				<Currency symbol={asset}>
					{numberFromBigInt(amount)}
				</Currency>
			)
		}

		const getStrikeNode = () => {
			const { market, isCall, isBuy, strike } = position;

			if (isParentComplex) {
				return (
					<div className="BuilderPositionsTable__strike-msg">
						{getMutedNode("Click to see strikes")}
					</div>
				);
			}

			if (!strike) {
				return;
			}

			return (
				<StrikeBrief
					strikeData={{
						market,
						isCall,
						isBuy
					}}
					priceNode={formatBigInt(strike, 0)}
				/>
			)
		}

		const getPremiumNode = () => {
			const { premium } = position;

			const isPremiumNegative = premium < 0n;

			const premiumFormatted = formatBigInt(absBigInt(premium));
			const premiumStr = `${isPremiumNegative ? "–" : "+"}$${premiumFormatted}`;

			return (
				<span className={cx({
					positive: !isPremiumNegative,
					negative: isPremiumNegative
				})}>
					{premiumStr}
				</span>
			)
		}

		const getCollateralNode = () => {
			const { collateral, collaterals, actions } = position;

			if (!collateral && (!collaterals || !collaterals.length)) {
				return;
			}

			const renderCollateralNode = (collateral) => {
				if (isTotal) {
					return (
						<span>${formatBigInt(collateral.inUSDC)}</span>
					)
				}
				
				return (
					<Currency key={collateral.isBase} symbol={collateral.marketToken.symbol}>
						{formatTokenAmount(collateral.inMarketToken, collateral.marketToken.isStable)}
					</Currency>
				)
			}

			if (isParentComplex) {
				return _getMultipleCollateralsNode(collaterals, renderCollateralNode);
			}
			
			if (actions && !actions.isAddingToCollateralDisabled) {
				return (
					<div className='flex items-center gap-x-3'>
						{renderCollateralNode(collateral)}
						<BuilderPositionCollateralBtn
							handleClick={() => openCollateralModal(position)}
						/>
					</div>
				)
			}

			return renderCollateralNode(collateral);
		}

		const _getMultipleCollateralsNode = (collaterals, renderCollateralNode) => {
			const summedCollaterals = {
				base: {},
				stable: {}
			};

			const sumCollaterals = (collateral) => {
				const { isBase } = collateral;
				const key = isBase ? "base" : "stable";
				
				summedCollaterals[key] = {
					...sumObjectValues(
						summedCollaterals[key],
						collateral,
						["inMarketToken", "inUSDC"]
					),
					isBase,
				}
			}

			collaterals.forEach(sumCollaterals);

			const collateralNodes = Object.values(summedCollaterals).map(renderCollateralNode);

			return (
				<div className="flex flex-col gap-y-5">
					{collateralNodes}
				</div>
			);
		}

		const getPnlNode = () => {
			if (!position.pnl) {
				return;
			}
			
			const { inUSDC, inPercentage } = position.pnl;
		
			const pnlSign = inUSDC < 0 ? '–' : '';
			const pnlUsdcFormatted = formatBigInt(absBigInt(inUSDC));

			const pnlPercentageAbs = absBigInt(inPercentage);
			const percentageDecimals = numberFromBigInt(pnlPercentageAbs) < 1 ? 1 : 0;

			const pnlPercentageFormatted = formatBigIntFree(
				pnlPercentageAbs,
				percentageDecimals,
			);
			
			const pnlNode = (
				<div 
					className={cx({
						positive: inUSDC > 0n,
						negative: inUSDC < 0n,
						muted: inUSDC === 0n,
					})}
				>
					<span style={{color: LGREY, marginRight: 5}}>
						{pnlSign}${pnlUsdcFormatted}
					</span>
					{`(${pnlSign}${pnlPercentageFormatted}%)`}
				</div>
			)
		
			return pnlNode;
		}

		const getLiqPriceNode = () => {
			const { collateral } = position;

			if (!collateral || !collateral.liquidationPrice) {
				return;
			}

			return `$${formatBigInt(collateral.liquidationPrice)}`;
		}

		const getGreeksNodes = () => {
			const { greeks } = position;

			return greeks;
		}

		const getExpiryNode = () => {
			const { expiry } = position;

			if (!expiry) {
				return;
			}
			
			const expiryStr = format(expiry, "dd/MM/yy, hh a");

			return expiryStr;
		}

		const getChildren = () => {
			if (!isParentComplex) {
				return;
			}

			const childValueNodes = position.childPositions.map(getPositionValueNodes);

			return childValueNodes;
		}
		
		const getCloseBtn = () => {
			if (isOpening) {
				return "";
			}
			
			return (
				<BuilderPositionCloseBtn
					openCloseModal={openCloseModal}
					position={position}
				/>
			)
		}

		return {
			id: `${position.buildId}_${position.id}`,
			strategy: getStrategyNode(),
			amount: getAmountNode(),
			strike: getStrikeNode(),
			premium: getPremiumNode(),
			collateral: getCollateralNode(),
			pnl: getPnlNode(),
			liqPrice: getLiqPriceNode(),
			...getGreeksNodes(),
			expiry: getExpiryNode(),
			children: getChildren(),
			closeBtn: getCloseBtn(),
			omittedKeys: (isParentComplex || isTotal) && ["strike", "closeBtn"]
		}
	}

	const titleData = TITLE_DATA;
	const itemsData = positions?.map(getPositionValueNodes);

	const tableStructure = {
		titleData,
		itemsData,
	};

	const links = [
		{
			name: "Active",
			isActive: true,
		},
	]

	const getTableMessage = () => {
		let msgText;
		
		if (!isConnected) {
			msgText = "No wallet connected";
		} else {
			if (!positions || !isLoadingComplete) {
				msgText = "Loading...";
			} else if (!positions.length) {
				msgText = "No open positions";
			}
		}
		
		return (
			<div
				className="App-box BuilderPositionsTable__message"
				style={!isLoadingComplete ? { marginBottom: 10 } : {}}
			>
				{getMutedNode(msgText)}
			</div>
		)
	}
	
	return (
		<div className="BuilderPositionsTable">
			<div className="BuilderPositionsTable__header">
				<Links links={links} type="border" />
				{getMutedNode(
					"*The table displays estimated PnL values. To view the actual PnL, click on the «Close» button",
					true
				)}
			</div>
			{positions?.length
				? <>
						{!isLoadingComplete && getTableMessage()}
						<Table
							structureData={tableStructure}
						/>
					</>
				: getTableMessage()}
		</div>
	);
};

export default BuilderPositionsTable;