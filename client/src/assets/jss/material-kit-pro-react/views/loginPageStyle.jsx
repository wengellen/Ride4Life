import {
  container,
  description,
  cardTitle,
  blackColor,
  whiteColor,
  grayColor,
  hexToRgb
} from "../../material-kit-pro-react.jsx";

const signupPageStyle = theme => ({
  description,
  cardHeadline:{
    backgroundColor:"#EDECF0",
    margin:"0 0 25px 0",
    padding:"50px 35px 35px 35px",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    borderRadius:"14px"
  },
  cardTitle: {
    color: "#444F63" + "  !important",
    fontSize:"2.4rem",
    marginBottom:"6px"
  },
  cardSubhead:{
    color:"#383C52",
    fontWeight:"500",
  },
  cardSubtitle: {
    color: "#B8BACB",
    backgroundColor:"#444F63",
    margin:"0",
    padding:"20px 24px",
    borderRadius:"12px",
    display:"flex",
    justifyContent:"space-between",
    fontSize:"1rem",
    
    "& a":{
      marginLeft:`6px !important`,
      textDecoration:"none",
      color:"white",
      fontWeight:"400",
    }
  },
  container: {
    ...container,
    zIndex: "4",
    // marginTop: "2rem",
    paddingLeft:0,
    paddingRight:0,
    paddingTop:"2rem",
    [theme.breakpoints.down("sm")]: {
      // paddingBottom: "100px"
    }
  },
  pageHeader: {
    color: whiteColor,
    border: "0",
    height: "100%",
    margin: "0",
    display: "flex!important",
    padding: "120px 0",
    position: "relative",
    minHeight: "100vh",
    alignItems: "center",
    "&:before": {
      background: "rgba(" + hexToRgb(blackColor) + ", 0.5)"
    },
    "&:before,&:after": {
      position: "absolute",
      zIndex: "1",
      width: "100%",
      height: "100%",
      display: "block",
      left: "0",
      top: "0",
      content: '""'
    }
  },
  form: {
    margin:"60px",
  },
  submitBtn: {
    width:"90%",
    color: "#444F63",
    // backgroundColor:"#444F63",
    margin:"14px 0 0 0",
    padding:"20px 24px",
    borderRadius:"20px",
    fontSize:"1.1rem",
    fontWeight:"700"
  },
  cardHeader: {
    width: "auto",
    textAlign: "center"
  },
  socialLine: {
    marginTop: "1rem",
    textAlign: "center",
    padding: "0"
  },
  inputIconsColor: {
    color: grayColor[13]
  },
  textCenter: {
    textAlign: "center"
  },
  iconButtons: {
    marginRight: "3px !important",
    marginLeft: "3px !important"
  },
  block: {
    color: "inherit",
    padding: "0.9375rem",
    fontWeight: "500",
    fontSize: "12px",
    textTransform: "uppercase",
    borderRadius: "3px",
    textDecoration: "none",
    position: "relative",
    display: "block"
  },
  inlineBlock: {
    display: "inline-block",
    padding: "0px",
    width: "auto"
  },
  list: {
    marginBottom: "0",
    padding: "0",
    marginTop: "0"
  },
  left: {
    float: "left!important",
    display: "block",
    "&,& *,& *:hover,& *:focus": {
      color: whiteColor + "  !important"
    }
  },
  right: {
    padding: "15px 0",
    margin: "0",
    float: "right",
    "&,& *,& *:hover,& *:focus": {
      color: whiteColor + "  !important"
    }
  },
  icon: {
    width: "18px",
    height: "18px",
    top: "3px",
    position: "relative"
  },
  footer: {
    position: "absolute",
    width: "100%",
    background: "transparent",
    bottom: "0",
    color: whiteColor,
    zIndex: "2"
  }
});

export default signupPageStyle;
