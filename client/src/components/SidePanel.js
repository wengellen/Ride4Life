import React from "react";
import Button from "@material-ui/core/Button";
import Face from "@material-ui/core/SvgIcon/SvgIcon";
import styled from "@emotion/styled";
import Drawer from '@material-ui/core/Drawer';

import {minW} from "../utils/helpers";

const NavContainer = styled.nav`
`

function SidePanel() {
  return (
	  <Drawer className={'header__navbar--navigation'}
			  open={this.state.mobileOpen}
			  onClose={this.handleDrawerToggle}>
			  {/*<IconButton*/}
			  {/*    color="inherit"*/}
			  {/*    aria-label="open drawer"*/}
			  {/*    onClick={this.handleDrawerToggle}*/}
			  {/*>*/}
			  {/*    <Close />*/}
			  {/*</IconButton>*/}
		  <div className="nav-drawer">
			  <ul className="nav-drawer-inner">
				  <li>
					  <Button
						  className={'drawer-button'}
						  onClick={this.handleOpenProfile}
					  >
						  <Face />
						  Profile
					  </Button>
				  </li>
				  <li>
					  <Button
						  className={'drawer-button'}
						  onClick={() => this.logout()}
					  >
						  <Face />
						  Logout
					  </Button>
				  </li>
			  </ul>
		  </div>
	  </Drawer>
  )
}

export default SidePanel;
