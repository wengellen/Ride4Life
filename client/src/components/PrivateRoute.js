import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {getLocalStore} from "../utils/helpers";

const PrivateRoute = ({ component: Component, permissions, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			// (permissions === "admin" || localStorage.getItem("token"))
			
			(localStorage.getItem('token'))
			 ? (
				<Component {...props} />
			) : (
				<Redirect to="/" />
			)
		}
	/>
);

export default PrivateRoute
