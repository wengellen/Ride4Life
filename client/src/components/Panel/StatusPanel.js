import React, {Component} from 'react';
import './StatusPanel.css'

class StatusPanel extends Component {
	render() {
		return (
			<div className={"status-panel"}>
				<h1>Welcome back Ellen</h1>
				<p>Lorem ipsum dolor sit amet, consectetur dolor sit amet, consectetur</p>
				<button className={"request-ride-button"}>REQUEST RIDE</button>
			</div>
		);
	}
}

export default StatusPanel;
