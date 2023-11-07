import { DEFAULT_DECIMALS } from '../../environment/constants/tokensConstants';
import { absBigInt, bigIntFromNumber, bringFromDefaultDecimals, bringToDecimals, bringToDefaultDecimals, formatBigInt, multiplyBigIntByNumber, negativeBigInt, numberFromBigInt } from '../../utils/dataTypesUtils/bigIntUtils';
import './Sandbox.scss';
import useHegicPositions from './../../hooks/networkHooks/positionsHooks/useHegicPositions';
import useLyraPositions from './../../hooks/networkHooks/positionsHooks/useLyraPositions';
import { useEffect } from 'react';
import useTokenPrices from '../../environment/contextHooks/useTokenPrices/useTokenPrices';


const Sandbox = () => {
	DEFAULT_DECIMALS; // 18

	const hegicPositions = useHegicPositions();
	const lyraPositions = useLyraPositions();

	const { ETH: priceETH, BTC: priceBTC } = useTokenPrices() ?? {};
	console.log(priceETH, priceBTC);

	useEffect(() => {
		if (hegicPositions) {
			console.log(hegicPositions);

			// logs on Hegic Positions
			// ...
		}

		if (lyraPositions) {
			console.log(lyraPositions);

			// logs on Lyra Positions
			// ...
		}

		// logs on all positions
		// ...
	}, [hegicPositions, lyraPositions]);
	
	
	// BigInt Math
	10n / 2n // 5n
	5n * 10n // = 50n
	5n + 10n // 15n
	20n - 2n // = 18n
	// 20n + 5 // ERROR
	

	
	// Utils
	// Source: numberUtils.js and bigIntUtils.js
	
	// Output: BigInt
	bigIntFromNumber(1); // = BigInt(1 * 10**18) - DEFAULT_DECIMALS value
	bigIntFromNumber(1, 8); // = BigInt(1 * 10**8)

	multiplyBigIntByNumber(bigIntFromNumber(1), 2); // = BigInt(2 * 10**DEFAULT_DECIMALS)

	absBigInt(bigIntFromNumber(-1)); // = BigInt(1 * 10**DEFAULT_DECIMALS)

	negativeBigInt(bigIntFromNumber(1)) // = BigInt(-1 * 10**DEFAULT_DECIMALS)
	negativeBigInt(bigIntFromNumber(-1)) // = BigInt(-1 * 10**DEFAULT_DECIMALS)

	bringToDecimals(bigIntFromNumber(1, 10), 10, 8) // = BigInt(1 * 10**8);
	bringFromDefaultDecimals(bigIntFromNumber(1), 8) // = BigInt(1 * 10**8);
	bringToDefaultDecimals(bigIntFromNumber(1, 8), 8) // = BigInt(1 * 10**DEFAULT_DECIMALS)


	// Output: Number
	numberFromBigInt(1000000000000000000n); // 10**18 / 10**DEFAULT_DECIMALS = 1;
	numberFromBigInt(1000n, 3); // 1000 / 10**3 = 1


	// Output: String
	formatBigInt(bigIntFromNumber(1000)); // = 1,000.00
	formatBigInt(bigIntFromNumber(1000), 0); // = 1,000
	formatBigInt(bigIntFromNumber(1000), 5); // = 1,000.50000
	formatBigInt(bigIntFromNumber(1000, 8), 2, 8); // = 1,000.50


	
	return (
		<div className="Sandbox">
			<h3 className='text-center'>Page for calculations testing</h3>
			<p>
				Default Decimals: <span style={{ color: "white" }}>{DEFAULT_DECIMALS}</span>
			</p>

			<div style={{ margin: "10px 0" }}>
				{lyraPositions?.map(position => {
					// Calculations with position...
					
					const result = position.premium;
					const resultFormatted = formatBigInt(result);
					
					return (
						<div key={position.id}>
							{resultFormatted} <span className='muted'>({position.asset})</span>
						</div>
					)
				})}
			</div>
			
		</div>
	);
};

export default Sandbox;