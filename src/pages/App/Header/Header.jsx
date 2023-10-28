import './Header.scss';
import Logo from './../../../components/UI/Logo/Logo';
import Links from './../../../components/common/Links/Links';
import { useLocation } from 'react-router-dom';
import CryptoGateway from './CryptoGateway/CryptoGateway';

const Header = () => {
	const location = useLocation();
	const links = [
		{
			name: "Option Trading",
			to: '/terminal'
		},
		{
			name: "Legacy",
			to: 'https://old.sharwa.finance/',
		},
	];
	links.forEach(link => {
		if (location.pathname.startsWith(link.to)) {
			link.isActive = true;
		}
	});


	return (
		<header className="Header _container">
			<Logo />
			<Links links={links} />
			<CryptoGateway />
		</header>
	);
};

export default Header;