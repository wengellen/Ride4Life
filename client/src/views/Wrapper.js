import React, {PureComponent, Fragment} from 'react'
import Header from '../components/Header/Header'
class Wrapper extends PureComponent {
  render() {
    return (
      <Fragment>
        <Header/>
        <div className="">
              {this.props.children}
        </div>
      </Fragment>
    )
  }
}
export default Wrapper
