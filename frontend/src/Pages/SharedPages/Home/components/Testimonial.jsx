import { useEffect, useState } from "react";
import TitleAndSubheading from "../../Shared/TitleAndSubheading";
import useAxiosSecure from "../../hooks/useAxiosSecure"
import TestimonialCard from "./TestimonialCard";

import { SwiperSlide, Swiper } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/pagination';
import '../../index.css';


const Testimonial = () => {
	const [reviews, setReviews] = useState([])
	const axiosSecure = useAxiosSecure()


	useEffect(() => {
		console.log("useEffect is triggered");
		axiosSecure('/reviews')
			.then(res => {
				setReviews(res?.data)
			})
			.catch(err => {
				console.log(err);

			})
	}, [axiosSecure])

	return (
		<div className="container mx-auto px-4 py-8">
			<TitleAndSubheading title="TESTIMONIALS"></TitleAndSubheading>
			<Swiper
			            breakpoints={{
							'@0.00': {
							  slidesPerView: 1,
							  spaceBetween: 10,
							},
							'@0.75': {
							  slidesPerView: 1,
							  spaceBetween: 10,
							},
							'@1.00': {
							  slidesPerView: 3,
							  spaceBetween: 10,
							},
							'@1.50': {
							  slidesPerView: 3,
							  spaceBetween: 20,
							},
						  }}
				slidesPerView={3}
				pagination={{
					clickable: true,
				}}
				autoplay= {{
					delay: 2000,
				}}
				modules={[Pagination, Autoplay]}
				className="mySwiper"
			>
				{reviews.map((review, index) => (
					<SwiperSlide><TestimonialCard key={index} {...review} /></SwiperSlide>
				))}
				
			</Swiper>
		</div >
	);
};

export default Testimonial;