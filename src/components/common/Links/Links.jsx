import { Link } from 'react-router-dom';
import './Links.scss';
import cx from 'classnames';

const Links = ({
	className,
	links,
	type, // - or "border"
}) => {

	const cls = cx(className, type && `Links_${type}`)
	
	return (
		<div className={cx("Links", cls)}>
			{links.map((link, i) => {
				const linkCls = cx("Links__item", link.isActive && "active");

				const isExternal = link.to?.startsWith("http");
				
				const linkNode = isExternal
					? <a
							key={link.to}
							className={linkCls}
							href={link.to}
							rel="noreferrer"
							target="_blank"
						>
							{link.name}
						</a>
					: <Link
							key={link.to ?? i}
							to={link.to}
							className={linkCls}
							disabled={link.isDisabled}
							onClick={link.isDisabled && ((e) => e.preventDefault())}
						>
							{link.name}
						</Link>
			
				return linkNode;
			})}
		</div>
	);
};

export default Links;