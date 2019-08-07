import React, {Component} from 'react';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ChildCare from "@material-ui/core/SvgIcon/SvgIcon";
import {Link} from "react-router-dom";
import { ReactComponent as CarIcon }  from "../assets/img/car.svg"

class SelectRolePanel extends Component {
	render() {
		const {type, show, closePanel} =  this.props
		return (
			<div className={`sliding-panel ${show && "show"}`}>
			
				
				{type === 'signup'
				? (	<>
						 <h1>Welcome</h1>
						<IconButton className="sliding-panel-button" onClick={closePanel}>
					       {/*<img src={CarIcon}/>*/}
							<Link
								  display="none"
								  to="/driver-signup">Sign Up to Drive</Link>
						</IconButton>
						<IconButton className="sliding-panel-button" onClick={closePanel}>
							{/*<ChildCare/>*/}
							<Link
								  display="none"
								  to="/rider-signup">Sign Up to Ride</Link>
						</IconButton>
					 </>
			        )
				:   (
					<>
						<h1>Welcome Back</h1>
						<IconButton className="sliding-panel-button" onClick={closePanel}>
							{/*<CarIcon/>*/}
							<Link
								  display="none"
								  to="/driver-login">Driver Sign In</Link>
						</IconButton>
						<IconButton className="sliding-panel-button" onClick={closePanel}>
							{/*<ChildCare/>*/}
							<Link
								  display="none"
								  to="/rider-login">Rider Sign In</Link>
						</IconButton></>
					) }
				<IconButton className="sliding-panel-close-button" onClick={closePanel}>
					<CloseIcon />
				</IconButton>
			
			</div>
		);
	}
}

export default SelectRolePanel;
