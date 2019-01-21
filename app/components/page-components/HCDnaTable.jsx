// Main Imports
import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import cmd from 'node-cmd';
// electron:
import * as electron from "electron";
// ReactTable Imports
import ReactTable from "react-table";
import { advancedExpandTableHOC } from "./SystemTable";
import "react-table/react-table.css";
// Local Imports
import routes from '../../constants/routes';
import { filterApps } from "../../utils/table-filters";
import manageAllDownloadedApps from "../../utils/helper-functions";
import { dataRefactor, listInstalledApps, listDownloadedApps, monitorUninstalledApps } from "../../utils/data-refactor";
// import { hcJoin,hcUninstall,hcStart,hcStop } from "../utils/hc-install";
// import { getRunningApps,decideFreePort } from "../utils/running-app";
import ToggleButton from "./ToggleButton"
import logo from '../../assets/icons/HC_Logo.svg';
// MUI Imports:
import { withStyles } from '@material-ui/core/styles';

/* ReactTable */
const AdvancedExpandReactTable = advancedExpandTableHOC(ReactTable);
/* Table Headers */
const table_columns = (props, state) => {
  console.log("Table Columns Props", props);
  // console.log("Table Columns State", state);
  //
  // const currentRowInstance = row._original.instanceId
  // console.log("Table Columns Row info", currentRowInstance);

  const table_columns = [{
    Header: '',
    columns: [{
      Header: 'App Name',
      accessor: 'appName',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }, {
      Header: 'Username',
      accessor: 'agent_id',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }]
  }, {
    Header: '',
    columns: [{
      Header: 'Type',
      accessor: 'type',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }, {
      Header: 'Hash ID',
      accessor: 'hash',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    },{
      Header: 'Instance ID',
      accessor: 'instanceId',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }, {
      Header: 'Status',
      accessor: 'status',
      Cell: row => (
        <div>
          <span style={{
            color: row.value.status === 'installed' ? '#57d500'
            : '#ff2e00',
            transition: 'all .3s ease'
          }}>
          &#x25cf;
          </span>
        { " " + row.value.status }
          <br/>
          <ToggleButton
            installed={row.value}
            downloaded={state.downloaded_apps}
            listInstances={props.get_info_instances}
            uninstallInstance={props.uninstall_dna_by_id}
            installInstance={props.install_dna_from_file}
          />
        </div>
      )
    },{
      Header: 'Running',
      accessor: 'running',
      Cell: row => (
        <div>
          <span style={{
            color: row.value.running ? '#57d500'
            : '#ff2e00',
            transition: 'all .3s ease'
          }}>
          &#x25cf;
          </span>
          { " " + row.value.running }
          <br/>
          <ToggleButton
            running={row.value}
            listRunningInstances={props.list_of_running_instances}
            stopInstance={props.stop_agent_dna_instance}
            startInstance={props.start_agent_dna_instance}
          />
        </div>
      )
    },
    {
      Header: 'Interface',
      accessor: 'interface',
      Cell: row => (
        <div>
        { row.value }
        </div>
      )
    }]
  }];

  return table_columns;
}

type HCDnaTableProps = {
  list_of_dna : [{
    id: String,
    hash: String
  }],
  list_of_instances : [{
    id: String,
    dna: String,
    agent: String
  }],
  list_of_running_instances :[{
    id: String,
    dna: String,
    agent: String
  }],
  list_of_instance_info : [{
    id: String,
    dna: String,
    agent: String,
    storage: {
      path: String,
      type: String
    }
  }],
  fetch_state: () => void,
  get_info_instances: () => Promise,
  install_dna_from_file: ()=> Promise
};

type HCDnaTableState = {
  data: {} | null,
  installed_apps: {} | null,
  downloaded_apps: {} | null,
  row: String,
  filter: any,
}

class HCDnaTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      installed_apps: {},
      downloaded_apps: {},
   // React Table data
      row: "",
      filter: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { list_of_dna, list_of_instances, list_of_running_instances, list_of_instance_info } = props.containerApiCalls;

    if (!list_of_instance_info) {
      return null;
    }
    else {
      const appData = { list_of_instance_info, list_of_dna, list_of_running_instances };
      const prevProps = state.prevProps || {};
      const data = prevProps.value !== appData ? appData : state.data

      console.log("data", data);
      return ({ data });
    }
  }

  componentDidMount = () => {
    // this.triggerWebClientCallTest();
    this.beginAppMontoring();
  }

  callFetchState = () => {
    this.props.fetch_state();
  }

  beginAppMontoring = () => {
    // call to CMD to monitor all downloaded_apps
    this.getDownloadedApps();

    // call for GET_INFO_INSTANCES()
    this.props.get_info_instances().then(res => {
      console.log("Home props after INFO/INSTANCES call", this.props);
      if(this.props.containerApiCalls.list_of_instance_info) {
        const installed_apps = this.props.containerApiCalls.list_of_instance_info;
        // console.log("................installed_apps : ", installed_apps);
        this.setState({
          installed_apps,
          // downloaded_apps: installed_apps // TODO: delete this part once the DOWNLOAD FOLDER functionality is in place.
        });

        // call for LIST_OF_DNA()
        this.props.list_of_dna().then(res => {
          this.callFetchState();
          console.log("Home props after LIST_OF_DNA call", this.props);
        })

        // call for LIST_OF_RUNNING_INSTANCES ()
        this.props.list_of_running_instances().then(res => {
          this.callFetchState();
          console.log("Home props after LIST_OF_RUNNING_INSTANCES call", this.props);
        })

        console.log("this.state AFTER CONTAINER API CALLS", this.state);
      }
    })
  }

  getDownloadedApps = () => {
    let self = this;
    cmd.get(
      `cd ~/.hcadmin/holochain-download && ls`,
      function(err, data, stderr) {
        if (!err) {
          console.log('~/.hcadmin/holochain-download contains these files =>> :\n', data)
          self.setState({
            downloaded_apps: manageAllDownloadedApps(data)
          });
          console.log("Apps state: ", self.state)
        }
        else {
          console.log('error', err)
        }
      }
    );
  }

  displayData = () => {
    console.log("this.state inside displayData", this.state);
    if (this.state.installed_apps){
      const { installed_apps, downloaded_apps } = this.state;
      const { list_of_dna, list_of_instances, list_of_running_instances, list_of_instance_info } = this.props.containerApiCalls;

      // const filtered_apps = filterApps(installed_apps, downloaded_apps);
      // const app_data = dataRefactor(list_of_instance_info, list_of_dna, list_of_running_instances, downloaded_apps);
      // console.log("App Data: ",app_data);

      const table_dna_instance_info =  listInstalledApps(list_of_instance_info, list_of_dna, list_of_running_instances);
      const table_downloaded_files = listDownloadedApps(downloaded_apps, list_of_instance_info); ;

      const combined_file_data = filterApps(table_dna_instance_info, table_downloaded_files )

      console.log("DATA GOING TO TABLE >>>> !! combined_file_data !! <<<<<<<< : ", combined_file_data);
      return combined_file_data;
    }
  }

    renderStatusButton = (appName, status, running) => {
      const STOPBUTTON=(<button className="StopButton" type="button">Stop</button>);
      const STARTBUTTON=(<button className="StartButton" type="button">Start</button>);
      if(running){
        return (STOPBUTTON)
      }else if (!running){
        if(status==="installed"){
          return (STARTBUTTON)
        }
      }
    }

    renderRunningButton = (appName, status, running) => {
      const INSTALLBUTTON=(<button className="InstallButton" type="button">Install</button>);
      const UNINSTALLBUTTON=(<button className="InstallButton" type="button">Uninstall</button>);
      if (!running){
        if (status === "installed") {
          return UNINSTALLBUTTON
        } else if (status === 'uninstalled') {
          return INSTALLBUTTON
        }
      }
    }


  render() {
    if (this.state.data.list_of_instance_info.length === 0){
      return <div/>
    }

    const table_data = this.displayData();

    const columns = table_columns(this.props, this.state);
    console.log("table_columns: ", columns);

    return (
      <div className={classnames("App")}>
        <AdvancedExpandReactTable
          defaultPageSize={500}
          className="-striped -highlight"
          data={table_data}
          columns={columns}
          SubComponent={({ row, nestingPath, toggleRowSubComponent }) => {
            <div>
// ******** TODO: USE / reconfigure THE SubComponent Below for displaying the UI DNA dependencies, or the DNA links to/pairings with UI. ***********
              SubComponent={({ row, nestingPath, toggleRowSubComponent }) => {
                console.log("row._original.ui_pairing", row._original.ui_pairing);
                if (row._original.ui_pairing!==undefined){
                  return (
                    <div style={{ padding: "20px" }}>
                        UI Link: {row._original.appName}
                        <br/>
                        {this.renderStatusButton(row._original.appName,row._original.status,row._original.running)}
                        {this.renderRunningButton(row._original.appName,row._original.status,row._original.running)}
                    </div>
                  );
                } else if (row._original.dna_dependencies!==undefined) {
                  return (
                    <div style={{ padding: "20px" }}>
                        DNA Dependencies:
                           <ul>
                             <li>{row._original.appName} : {row._original.dna}</li>
                           </ul>
                        <br/>
                        {this.renderStatusButton(row._original.appName,row._original.status,row._original.running)}
                        {this.renderRunningButton(row._original.appName,row._original.status,row._original.running)}
                    </div>
                  );
                }
                else {
                  return (
                    <div style={{ padding: "20px" }}>
                        No DNA Dependencies or UI Pairings
                        <br/>
                        {this.renderStatusButton(row._original.appName,row._original.status,row._original.running)}
                        {this.renderRunningButton(row._original.appName,row._original.status,row._original.running)}
                    </div>);
                }
              }}
          </div>
        }}
      />
    </div>
  )}
}

export default HCDnaTable;

/////////////////////////////////////////////////////////////////////
// triggerWebClientCall = () => {
// // call for GET_INFO_INSTANCES()
//   this.props.get_info_instances().then(res => {
//     this.callFetchState();
//     console.log("Home props after INFO/INSTANCES call", this.props);
//   })
//
// // call for INSTALL_DNA_FROM_FILE ({ id, path })
//   const dna_file = {
//     id: "app spec instance 3",
//     path: "/home/lisa/Documents/gitrepos/holochain/holochain-rust/app_spec/dist/app_spec.hcpkg"
//   };
//   this.props.install_dna_from_file(dna_file).then(res => {
//     this.callFetchState();
//     console.log("Home props after INSTALL call", this.props);
//   })
//
// // call for LIST_OF_DNA()
//   this.props.list_of_dna().then(res => {
//     this.callFetchState();
//     console.log("Home props after LIST_OF_DNA call", this.props);
//   })
//
// // call for ADD_AGENT_DNA_INSTANCE ({ id })
//   const agent_dna_instance = {
//     id: "app spec instance 4",
//     dna_id:"app spec rust",
//     agent_id:"test agent 1"
//   }
//   this.props.add_agent_dna_instance(agent_dna_instance).then(res => {
//     this.callFetchState();
//     console.log("Home props after ADD_AGENT_DNA_INSTANCE call", this.props);
//   })
//
//   // call for LIST_OF_INSTANCES ()
//   this.props.list_of_instances().then(res => {
//     this.callFetchState();
//     console.log("Home props after LIST_OF_INSTANCES call", this.props);
//   })
//
// // call for START_AGENT_DNA_INSTANCE ({ id })
//   const start_agent_dna_instance_by_id = { id: "app spec instance 4" }
//   this.props.start_agent_dna_instance(start_agent_dna_instance_by_id).then(res => {
//     this.callFetchState();
//     console.log("Home props after START_AGENT_DNA_INSTANCE call", this.props);
//   })
//
//   // call for LIST_OF_RUNNING_INSTANCES ()
//   this.props.list_of_running_instances().then(res => {
//     this.callFetchState();
//     console.log("Home props after LIST_OF_RUNNING_INSTANCES call", this.props);
//   })
//
// // call for STOP_AGENT_DNA_INSTANCE ({ id })
//   const stop_agent_dna_instance_by_id = { id: "app spec instance 4" }
//   this.props.stop_agent_dna_instance(stop_agent_dna_instance_by_id).then(res => {
//     this.callFetchState();
//     console.log("Home props after STOP_AGENT_DNA_INSTANCE call", this.props);
//   })
//
// // call for UNINSTALL_DNA_BY_ID ({ id })
//   const dna_by_id = {id: "app spec instance 4"}
//   this.props.uninstall_dna_by_id(dna_by_id).then(res => {
//     this.callFetchState();
//     console.log("Home props after DNA_BY_ID call", this.props);
//   })
//
// // call for REMOVE_AGENT_DNA_INSTANCE ({ id })
//   const remove_agent_dna_instance_by_id = { id: "app spec instance 4" }
//   this.props.remove_agent_dna_instance(remove_agent_dna_instance_by_id).then(res => {
//     this.callFetchState();
//     console.log("Home props after REMOVE_AGENT_DNA_INSTANCE call", this.props);
//   })
/////////////////////////////////////////////////////////////////////