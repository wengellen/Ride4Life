import React, {Component} from 'react';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {Link} from "react-router-dom";
import Lock from "@material-ui/icons/Lock";

class SelectRolePanel extends Component {
	
	handleClick = (linkUrl) => {
		this.props.history.push(linkUrl)
		this.props.closePanel()
	}
	render() {
		const {type, show, closePanel} =  this.props
		
		return (
			<div className={`sliding-panel ${show && "show"}`}>
				<div className={"sliding-panel-bg"}/>
				{type === 'signup'
				? (	<>
						<IconButton className="sliding-panel-button" onClick={()=> this.handleClick('/driver-signup')}>
							Sign Up to Drive
						</IconButton>
						<IconButton className="sliding-panel-button" onClick={()=> this.handleClick('/rider-signup')}>
							Sign Up to Ride
						</IconButton>
					 </>
			        )
				:   (
					<>
						<IconButton className="sliding-panel-button" onClick={()=> this.handleClick('/driver-login')}>
							<Lock className="sliding-panel-icon"/>
							Driver Sign In
						</IconButton>
						<IconButton className="sliding-panel-button" onClick={()=> this.handleClick('/rider-login')}>
							<Lock className="sliding-panel-icon"/>
							Rider Sign In
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
