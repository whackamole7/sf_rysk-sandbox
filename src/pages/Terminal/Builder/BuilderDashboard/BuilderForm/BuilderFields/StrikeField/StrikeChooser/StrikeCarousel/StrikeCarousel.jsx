import Carousel from '../../../../../../../../../components/UI/Carousel/Carousel';
import './StrikeCarousel.scss';


const StrikeCarousel = (props) => {
	const {
		asset,
	} = props;
	
	
	return (
		<Carousel
			slidesPerView={'auto'}
			breakpoints={{
				768: {
					slidesPerView: 'auto',
				},
				576: {
					slidesPerView: 7,
					grid: {
						fill: "row",
						rows: 2,
					}
				},
				520: {
					slidesPerView: 6,
					grid: {
						fill: "row",
						rows: 2,
					}
				},
				380: {
					slidesPerView: 5,
					grid: {
						fill: "row",
						rows: 2,
					}
				},
				0: {
					slidesPerView: 4,
					spaceBetween: 4,
					grid: {
						fill: "row",
						rows: 2,
					}
				}
			}}
			spaceBetween={5}
			className="StrikeCarousel"
			isDraggable={false}
			isUnited={true}
			slideClassName={`StrikeCarousel__slide_${asset}`}
		>
			{props.children}
		</Carousel>
	);
};

export default StrikeCarousel;