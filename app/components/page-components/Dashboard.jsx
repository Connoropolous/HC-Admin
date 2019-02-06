import * as React from 'react';
import classnames from 'classnames';
import QueueAnim from 'rc-queue-anim';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import TopNav from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import logo from '../../assets/icons/HC_Logo.svg';
import styles from '../styles/component-styles/DashboardMuiStyles';
import MainNavListItems from './MainNavListItems';

class Dashboard extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      open: true,
    }
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  makeSearch = () => {
    // TODO: place logic to serach table at hand here....
  }

  render() {
    const { classes } = this.props;
    const noWrap : boolean = true;
    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <TopNav
            position="absolute"
            className={classnames(classes.topNav)}
          >
            <img src={logo} className={classnames(classes.navAppLogo, "App-logo")} alt="logo" />
            <Typography className={classes.title} style={{color: "#e4e4e4", textAlign: "center", marginTop:"20px"}} noWrap={noWrap} variant="display1" component="h3" >
              HC Admin
            </Typography>

            <List className={classnames(classes.navMenuItemsWrapper, "nav-links")}>
              <MainNavListItems className={classnames(classes.navMenuItems, "nav-links")} {...this.props}/>
            </List>

            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon style={{ color:"#95b9ed"}} />
              </div>
              <InputBase
                placeholder="Search…"
                onEnter={this.makeSearch}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
          </TopNav>
            {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Dashboard);
