import React, {Component} from 'react';
import Star from './Star'

class Rating extends Component {
	static defaultProps = {max: 5};
	constructor(props) {
		super(props)
		this.state = {
			dynamicValue: props.stars,
			value: 0
		}
		this._colors = {
			1: "#f44336",
			2: "#FF5722",
			3: "#FF9800",
			4: "#FFC107",
			5: "#FFEB3B"
		};
		this._meanings = {
			0: "No Rating 🚫",
			1: "Terrible Service 🤮",
			2: "Mediocre Service 😒",
			3: "Average Service 😐",
			4: "Nice Service 🙂",
			5: "Excellent Driver 🔥"
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
	}
	
	handleClick(newValue){
		this.setState({
			value: newValue,
			dynamicValue:newValue
		})
	}
	
	handleMouseEnter(newValue) {
		this.setState({ dynamicValue: newValue });
	}
	
	handleMouseLeave(newValue) {
		this.setState({ dynamicValue: this.state.value });
	}
	
	render() {
		const { dynamicValue, value } = this.state;
		const starSpans = [];
		const max = this.props.max;
		let count = 0;
		for (let v = 1; v <= max; v++) {
			if (v <= dynamicValue) {
				count++;
			}
		}
		for (let v = 1; v <= max; v++) {
			starSpans.push(
				<Star
					key={v}
					color={this._colors[count]}
					isFilled={v <= dynamicValue}
					value={v}
					handleHover={this.handleMouseEnter}
					handleHoverLeave={this.handleMouseLeave}
					handleClick={this.handleClick}
				/>
			);
		}
		return (
			<div>
				<p>{this._meanings[value]}</p>
				{starSpans}
			</div>
		);
	}
}

export default Rating;
