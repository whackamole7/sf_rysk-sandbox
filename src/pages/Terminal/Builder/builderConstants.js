import { CORNFLOWER, GREEN, ORANGE, RED } from "../../../environment/constants/styleConstants";

const LIMITED = "Limited";
const UNLIMITED = "Unlimited";
const OUTLOOK_UP = "Bullish";
const OUTLOOK_DOWN = "Bearish";
const OUTLOOK_NEUTRAL = "Neutral";

/*
key list:

Long Call: 					1
Short Call: 				101
Covered Call: 			201
Long Put: 					2
Short Put: 					102
Long Strangle: 			3
Short Strangle: 		103
Covered Strangle: 	203
Long Straddle: 			4
Short Straddle: 		104
Covered Straddle: 	204
Iron Butterfly: 		5
Iron Condor: 				6
*/

export const BUILDER_STRATEGIES_CONFIG = {
	"Long Call": {
		stats: {
			outlooks: [OUTLOOK_UP],
			profit: UNLIMITED,
			loss: LIMITED,
			description: "When you believe that the price of the underlying asset will rise."
		},
		structure: [1], // Array of options' keys: positive = buy, negative = sell
		// Example: -1 = Sell Call, 1 = Buy Call.
		key: 1,
		color: GREEN,
	},
	"Short Call": {
		stats: {
			outlooks: [OUTLOOK_DOWN],
			profit: LIMITED,
			loss: UNLIMITED,
			description: "When you believe that the price of the underlying asset will fall.",
		},
		structure: [-1],
		key: 101,
		color: RED,
	},
	"Covered Call": {
		stats: {
			outlooks: [OUTLOOK_UP],
			profit: LIMITED,
			loss: UNLIMITED,
			description: "When you believe that the price of the underlying asset will rise.",
		},
		structure: [-1],
		key: 201,
		color: RED,
	},
	"Long Put": {
		stats: {
			outlooks: [OUTLOOK_DOWN],
			profit: UNLIMITED,
			loss: LIMITED,
			description: "When you believe that the price of the underlying asset fall.",
		},
		structure: [2],
		key: 2,
		color: GREEN
	},
	"Short Put": {
		stats: {
			outlooks: [OUTLOOK_UP],
			profit: LIMITED,
			loss: UNLIMITED,
			description: "When you believe that the price of the underlying asset will rise.",
		},
		structure: [-2],
		key: 102,
		color: RED,
	},
	"Long Strangle": {
		stats: {
			outlooks: [OUTLOOK_NEUTRAL],
			profit: UNLIMITED,
			loss: LIMITED,
			description: "When you believe that the price of the underlying asset will rise or fall.",
		},
		structure: [1, 2],
		key: 3,
		color: ORANGE
	},
	"Short Strangle": {
		stats: {
			outlooks: [OUTLOOK_NEUTRAL],
			profit: LIMITED,
			loss: UNLIMITED,
			description: "When you believe that the price of the underlying asset won’t rise or fall significantly.",
		},
		structure: [-1, -2],
		key: 103,
		color: RED,
	},
	"Covered Strangle": {
		stats: {
			outlooks: [OUTLOOK_NEUTRAL, OUTLOOK_UP],
			profit: LIMITED,
			loss: UNLIMITED,
			description: "When you believe that the price of the underlying asset is at or above the strike price of the short call at expiration.",
		},
		structure: [-1, -2],
		key: 203,
		color: RED,
	},
	"Long Straddle": {
		stats: {
			outlooks: [OUTLOOK_NEUTRAL],
			profit: UNLIMITED,
			loss: LIMITED,
			description: "When you believe that the price of the underlying asset changes when the direction of the change could be either up or down.",
		},
		structure: [1, 2],
		key: 4,
		color: ORANGE
	},
	"Short Straddle": {
		stats: {
			outlooks: [OUTLOOK_NEUTRAL],
			profit: LIMITED,
			loss: UNLIMITED,
			description: "When you believe that the price of the underlying asset won’t rise or fall significantly.",
		},
		structure: [-1, -2],
		key: 104,
		color: RED,
	},
	"Covered Straddle": {
		stats: {
			outlooks: [OUTLOOK_NEUTRAL, OUTLOOK_UP],
			profit: LIMITED,
			loss: UNLIMITED,
			description: "When you believe that the price of the underlying asset is at or above the strike price of the short call at expiration.",
		},
		structure: [-1, -2],
		key: 204,
		color: RED,
	},
	"Iron Butterfly": {
		stats: {
			outlooks: [OUTLOOK_NEUTRAL],
			profit: LIMITED,
			loss: LIMITED,
			description: "When you believe that the price of the underlying asset won’t rise or fall significantly.",
		},
		structure: [2, -2, -1, 1],
		key: 5,
		color: CORNFLOWER,
		plural: "Iron Butterflies"
	},
	"Iron Condor": {
		stats: {
			outlooks: [OUTLOOK_NEUTRAL],
			profit: LIMITED,
			loss: LIMITED,
			description: "When you believe that the price of the underlying asset won’t rise or fall significantly.",
		},
		structure: [2, -2, -1, 1],
		key: 6,
		color: CORNFLOWER,
	},
	"Bull Call Spread": {
		color: GREEN,
	},
	"Bear Put Spread": {
		color: RED,
	}
}

export const OUTLOOK_COLORS = {
	[OUTLOOK_UP]: GREEN,
	[OUTLOOK_NEUTRAL]: CORNFLOWER,
	[OUTLOOK_DOWN]: RED,
};


export const BUILDER_STRATEGIES = Object.keys(BUILDER_STRATEGIES_CONFIG)
	.filter(strategy => BUILDER_STRATEGIES_CONFIG[strategy].key)


export const BUILDER_PROTOCOL_TYPES = {
	Lyra_ETH: 0,
	Lyra_BTC: 1,
	Hegic: 2,
}


export const BUILDER_SWAP_SLIPPAGE = 0.003; // 0.3%
export const BUILDER_APPROVAL_SLIPPAGE = 0.005; // 0.5%


export const BUILDER_POSITION_ROLES = {
	PARENT_COMPLEX: "parent_complex",
	PARENT_SIMPLE: "parent_simple",
	CHILD: "child",
}