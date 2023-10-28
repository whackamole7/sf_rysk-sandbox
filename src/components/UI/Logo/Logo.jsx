import cx from "classnames";
import './Logo.scss';
import Logo_src from '../../../img/UI/Logo.svg';

const Logo = ({ className }) => {
	return (
		<div className={cx("Logo", className)}>
			<a className="Logo__link" href="/index.html">
				<img src={Logo_src} alt="Sharwa.Finance" />
			</a>
		</div>
	);
};

export default Logo;