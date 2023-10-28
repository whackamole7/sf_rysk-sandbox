import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './Terminal.scss';
import Links from '../../components/common/Links/Links';
import TokenPricesPanel from './../../components/common/TokenPricesPanel/TokenPricesPanel';

const Terminal = () => {
	const location = useLocation();
	const links = [
		{
			name: "Option Strategies",
			to: "/terminal/builder"
		},
	]
	links.forEach(link => {
		if (location.pathname.endsWith(link.to)) {
			link.isActive = true;
		}
	});

	return (
		<div className="Terminal">
			<TokenPricesPanel />
			<Links links={links} type="border" />
			<Outlet />
		</div>
	);
};

export default Terminal;