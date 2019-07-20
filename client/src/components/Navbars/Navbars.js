import React from "react";
// nodejs library to set properties for components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Header from "../Header/Header";
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
				<Header
					brand="HomePage"
					color="info"/>
		);
	}
}
export default withStyles(presentationStyle)(Navbars)
