import { ASSETS } from '../../../../../../../environment/constants/tokensConstants';
import Currency from '../../../../../../../components/common/Currency/Currency';
import Selector from '../../../../../../../components/UI/Selector/Selector';

const AssetField = (props) => {
	const {
		assetState,
		isDisabled
	} = props;

	const [asset, setAsset] = assetState;

	const assetOptions = ASSETS.map(asset => {
		return {
			value: asset,
			label: (
				<Currency symbol={asset} isHlight={true} >
					{asset}
				</Currency>
			),
		}
	});

	return (
		<div className="BuilderForm__field BuilderForm__field_asset">
			<div className="BuilderForm__field-header">
				Asset
			</div>
			<div className="BuilderForm__field-body">
				<Selector
					options={assetOptions}
					defaultValue={asset}
					isDisabled={isDisabled}
					onChange={option => {
						setAsset(option.value);
					}}
				/>
			</div>
		</div>
	);
};

export default AssetField;