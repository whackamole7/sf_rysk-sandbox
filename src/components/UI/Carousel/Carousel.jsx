import { useRef, useEffect } from 'react';
import './Carousel.scss';
import cx from "classnames";
import { register } from 'swiper/element/bundle';
register();

const Carousel = (props) => {
	const {
		id,
		className,
		isUnited,
		spaceBetween,
		isDraggable,
		breakpoints,
		handleInit,
		slideClassName,
		children,
	} = props;

	const swiperElRef = useRef(null);

	const navBtnsParentSelector = `${isUnited ? `.${className}` : `#${id}`}`;
	
	const swiperParams = {
		spaceBetween,
		allowTouchMove: isDraggable,
		breakpoints,
		navigation: {
			enabled: true,
			prevEl: `${navBtnsParentSelector} .Carousel__nav-btn_prev`,
			nextEl: `${navBtnsParentSelector} .Carousel__nav-btn_next`
		},
		on: {
			init: (swiper) => {
				swiper.el.style.overflow = "clip visible";
				
				if (handleInit) {
					handleInit(swiper);
				}
			}
		}
	}

	useEffect(() => {
		const swiperEl = swiperElRef.current;

		if (swiperEl) {
			Object.assign(swiperEl, swiperParams);

			swiperEl.initialize();
		}
	}, [swiperElRef, swiperParams]);


	return (
		<div className={cx("Carousel", className)} id={id}>
			<button
				className="Carousel__nav-btn Carousel__nav-btn_prev"
			/>
			<swiper-container
				init={false}
				ref={swiperElRef}
			>
				{children?.map((child, i) => {
					return (
						<swiper-slide key={i} class={slideClassName}>
							{child}
						</swiper-slide>
					)
				})}
			</swiper-container>
			<button
				className="Carousel__nav-btn Carousel__nav-btn_next"
			/>
		</div>
	);
};

export default Carousel;