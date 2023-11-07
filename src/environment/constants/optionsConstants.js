import { getMsInDays } from "../../utils/dateUtils";

import icon_Hegic from "../../img/markets/Hegic.svg";
import icon_Hegic_circled from "../../img/markets/Hegic_circled.svg";
import icon_Hegic_circledLight from "../../img/markets/Hegic_circled-light.svg";
import icon_Lyra from "../../img/markets/Lyra.svg";
import icon_Lyra_circled from "../../img/markets/Lyra_circled.svg";
import icon_Lyra_circledLight from "../../img/markets/Lyra_circled-light.svg";
import icon_Rysk from "../../img/markets/Rysk.svg";
import icon_Rysk_circled from "../../img/markets/Rysk_circled.svg";
import icon_Rysk_circledLight from "../../img/markets/Rysk_circled-light.svg";


export const MARKETS_ICONS = {
	Hegic: {
		common: icon_Hegic,
		circled: icon_Hegic_circled,
		circledLight: icon_Hegic_circledLight,
	},
	Lyra: {
		common: icon_Lyra,
		circled: icon_Lyra_circled,
		circledLight: icon_Lyra_circledLight
	},
	Rysk: {
		common: icon_Rysk,
		circled: icon_Rysk_circled,
		circledLight: icon_Rysk_circledLight,
	},
};
export const LYRA_TRADE_SLIPPAGE = 0.0015; // 0.15%
export const LYRA_PREMIUM_SLIPPAGE = 0.02; // 2%


export const GREEKS = ["delta", "vega", "gamma", "theta"];



export const EXPIRY_HOUR_UTC = 8;

const EXPIRY_PERIODS_IN_DAYS = [
	7, 14, 30, 60, 90
];
export const EXPIRY_PERIODS_IN_MS = EXPIRY_PERIODS_IN_DAYS.map(getMsInDays);


export const FETCH_POSITIONS_INTERVAL = 10000;