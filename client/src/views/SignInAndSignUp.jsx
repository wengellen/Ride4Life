import React from 'react'
import RiderLogin from './rider/RiderLoginPage';
import RiderSignup from './rider/RiderSignupPage';
import DriverLogin from './driver/DriverLoginPage';
import DriverSignup from './driver/DriverSignupPage';

const SignInAndSignUp = ({role , action}) => (
  <div>
      {role === 'rider'
      ?   action === "signup" ? <RiderSignup /> : <RiderLogin />
      :   action === "signup" ? <DriverSignup /> : <DriverLogin />
      }
  </div>
);

SignInAndSignUp.defaultProps = {
    role: 'rider',
    action: 'signup',
};

export default SignInAndSignUp;
