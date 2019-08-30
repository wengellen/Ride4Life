import React from "react";
import {Route} from "react-router";


function PrivateRoute({component: Component, ...rest}) {
  return (
   	<Route
		{...rest}
		render={props => {
			(localStorage.getItem('user'))
				? (
					<Component {...props}/>
				) : (
					<Redirect to={"/"}/>
				)
		}}
   	>
  	 
    </Route>
  )
}

export default PrivateRoute;
