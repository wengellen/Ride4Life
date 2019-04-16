import List from "../../views/driver/DriverSignupPage";
import React from "react";
// import {connect} from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import ListItem from "@material-ui/core/ListItem";
import signupPageStyle from "assets/jss/material-kit-pro-react/views/signupPageStyle.jsx";


function Footer ({ ...props }) {
		const { classes} = props;
		return(
			<Footer
				content={
					<div>
						<div className={classes.left}>
							<List className={classes.list}>
								<ListItem className={classes.inlineBlock}>
									<a
										href="https://www.creative-tim.com/"
										className={classes.block}
									>
										Creative Tim
									</a>
								</ListItem>
								<ListItem className={classes.inlineBlock}>
									<a
										href="https://www.creative-tim.com/presentation"
										className={classes.block}
									>
										About us
									</a>
								</ListItem>
								<ListItem className={classes.inlineBlock}>
									<a
										href="//blog.creative-tim.com/"
										className={classes.block}
									>
										Blog
									</a>
								</ListItem>
								<ListItem className={classes.inlineBlock}>
									<a
										href="https://www.creative-tim.com/license"
										className={classes.block}
									>
										Licenses
									</a>
								</ListItem>
							</List>
						</div>
						{/*<div className={classes.right}>*/}
							{/*&copy; {1900 + new Date().getYear()} , made with{" "}*/}
							{/*<Favorite className={classes.icon} /> by{" "}*/}
							{/*<a href="https://www.creative-tim.com">Creative Tim</a> for a*/}
							{/*better web.*/}
						{/*</div>*/}
					</div>
				}
			/>
		)
	}

export default withStyles(signupPageStyle)(Footer);
