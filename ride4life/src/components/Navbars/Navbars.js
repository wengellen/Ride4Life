import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import {connect} from 'react-redux'
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
import Close from "@material-ui/icons/Close";
// core components
import headerStyle from "assets/jss/material-kit-pro-react/components/headerStyle.jsx";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import Header from "../Header/Header";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import presentationStyle from "assets/jss/material-kit-pro-react/views/presentationStyle.jsx";


class Navbars extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mobileOpen: false
		};
	}
	componentWillUnmount() {
		if (this.props.changeColorOnScroll) {
			window.removeEventListener("scroll", this.headerColorChange);
		}
	}
	render() {
		const { classes, color, links, brand, fixed, absolute } = this.props;
		return (
			<div className={`${classes.section} cd-section`} id="navigation">
					<GridContainer>
						<GridItem >
							<Header
								brand="HomePage"
								color="info"
							/>
						</GridItem>
					</GridContainer>
				</div>
		);
	}
}
export default withStyles(presentationStyle)(Navbars)
