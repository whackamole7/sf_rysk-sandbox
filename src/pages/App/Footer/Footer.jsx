import './Footer.scss';
import Logo from './../../../components/UI/Logo/Logo';
import icon_Discord from '../../../img/social-media/Discord.svg';
import icon_Gitbook from '../../../img/social-media/Gitbook.svg';
import icon_Github from '../../../img/social-media/Github.svg';
import icon_Mirror from '../../../img/social-media/Mirror.svg';
import icon_Dune from '../../../img/social-media/Dune.svg';
import icon_Twitter from '../../../img/social-media/Twitter.svg';


const Footer = () => {

	const smediaArr = [
		{
			name: "Discord",
			icon: icon_Discord,
			url: "https://discord.gg/5DGZ7rzSfS",
		},
		{
			name: "Gitbook",
			icon: icon_Gitbook,
			url: "https://docs.sharwa.finance/",
		},
		{
			name: "Github",
			icon: icon_Github,
			url: "https://github.com/DeDeLend",
		},
		{
			name: "Mirror",
			icon: icon_Mirror,
			url: "https://mirror.xyz/sharwa-finance.eth",
		},
		{
			name: "Dune",
			icon: icon_Dune,
			url: "https://dune.com/sharwa_finance/aggregator",
		},
		{
			name: "Twitter",
			icon: icon_Twitter,
			url: "https://twitter.com/SharwaFinance",
		},
	]
	
	return (
		<footer className="Footer">
			<div className="Footer__content _container">
				<Logo />
				<div className="Footer__smedia-items">
					{smediaArr.map(data => {
						return (
							<a
								key={data.name}
								className="Footer__smedia-item"
								target="_blank"
								rel="noreferrer"
								href={data.url}
							>
								<img src={data.icon} alt={`${data.name} logo`} />
							</a>
						)
					})}
				</div>
			</div>
		</footer>
	);
};

export default Footer;