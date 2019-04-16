import React from "react";
// react component for creating beautiful carousel
import Carousel from "react-slick";
// @material-ui/coßre components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import LocationOn from "@material-ui/icons/LocationOn";
// core components
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import Card from "../Card/Card";

import carouselStyle from "assets/jss/material-kit-pro-react/views/componentsSections/carouselStyle";

import image1 from "assets/img/bg.jpg";
import image2 from "assets/img/bg2.jpg";
import image3 from "assets/img/bg3.jpg";

function SectionCarousel({...props}) {
	const { classes } = props;
	const settings = {
		dots: true,
		infinite: true,
		speed: 1000,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true
	};
	return (
		<div className={classes.section} id="carousel">
			<div className={classes.container}>
				<GridContainer>
					<GridItem xs={12} sm={12} md={8} className={classes.marginAuto}>
						<Card>
							<Carousel {...settings}>
								<div>
									<img
										src={image1}
										alt="First slide"
										className="slick-image"
									/>
									<div className="slick-caption">
										<h4>
											<LocationOn className="slick-icons" />Yellowstone
											National Park, United States
										</h4>
									</div>
								</div>
								<div>
									<img
										src={image2}
										alt="Second slide"
										className="slick-image"
									/>
									<div className="slick-caption">
										<h4>
											<LocationOn className="slick-icons" />Somewhere Beyond,
											United States
										</h4>
									</div>
								</div>
								<div>
									<img
										src={image3}
										alt="Third slide"
										className="slick-image"
									/>
									<div className="slick-caption">
										<h4>
											<LocationOn className="slick-icons" />Yellowstone
											National Park, United States
										</h4>
									</div>
								</div>
							</Carousel>
						</Card>
					</GridItem>
				</GridContainer>
			</div>
		</div>
	);
}

export default withStyles(carouselStyle)(SectionCarousel);
