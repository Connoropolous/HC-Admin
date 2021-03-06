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
import {manageAllDownloadedUI} from "../../utils/helper-functions";
import {uiTableDataRefactored} from "../../utils/data-refactor";
import {checkPort} from "../../utils/cmd-calls";
import AddUIInterfaceForm from "./AddUIInterfaceForm";

// import InstanceToggleButton from "./InstanceToggleButton"
import logo from '../../assets/icons/HC_Logo.svg';
// MUI Imports:
import { withStyles } from '@material-ui/core/styles';

/* ReactTable */
import ui_bundle_table_columns,{ui_interface_table_columns}  from './ColumnsUITable'


type HCMonitorTableState = {
  downloaded_ui_bundles: {}|null,
}

const AdvancedExpandReactTable = advancedExpandTableHOC(ReactTable);

class HCUiTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    downloaded_ui_bundles: null,
    port_exist:[]
    };
  }

  componentDidMount = () => {
    // console.log("UI Table LOADING...");
    this.monitoringUI();
    // checkPort(9000).then(exist=>{
    //   console.log("RETURNED PORT CHECKED: ",exist);
    //
    // })
  }
  monitoringUI = () => {
    this.getDownloadedBundles();
    this.props.get_ui_list().then(res => {
      // console.log("Loading list of UI Bundles: ", this.props);
    });
    this.props.get_ui_instance_list().then(res => {
      // console.log("Loading list of UI instances: ", this.props);
      let port_exist=[]
      this.props.containerApiCalls.list_of_ui_instances.forEach((ui)=>{
        checkPort(ui.port).then(exist=>{
          port_exist.push({ui_interface_id:ui.id,port_number:ui.port,port_running:exist})
        })
      })//.then((_)=>{
        this.setState({
          port_exist
        })
        console.log("SET STATE: ",this.state);

    });
    this.props.list_of_interfaces().then(res => {
      // console.log("Home props after LIST_OF_INTERFACES call", this.props);
    })
  }



  getDownloadedBundles = () => {
    let self = this;
    cmd.get(
      `cd ~/.hcadmin/downloaded-ui && ls`,
      function(err, data, stderr) {
        if (!err) {
          self.setState({
            downloaded_ui_bundles: manageAllDownloadedUI(data)
          });
        }
        else {
          console.log('error', err)
        }
      }
    );
  }

  displayData= ()=>{
    const { list_of_ui_bundle, list_of_ui_instances } = this.props.containerApiCalls;
    return uiTableDataRefactored(list_of_ui_bundle, list_of_ui_instances,this.state.downloaded_ui_bundles );
  }
  check = (port_number)=>{
      return this.state.port_exist.filter((p)=>{
        return p.port_number == port_number
      })
  }
  displayInterfaceData = (row) => {
      const interface_details =  row.original.ui_instance.map(instance =>{
        return {
          ui_interface_id:instance.id,
          interface_type:instance.dna_interface,
          port:instance.port,
          port_check:this.check(instance.port)
        }
      })
  return interface_details;
  }



  render() {
    console.log("Rending UI TABLE : ", this.props);
    if (!this.props.containerApiCalls.length === 0 ){
      return <div/>
    }
    const columns = ui_bundle_table_columns(this.props, this.state);
    const table_data= this.displayData();

    return (
      <div className={classnames("App")}>
        <AdvancedExpandReactTable
          data={table_data ? table_data : []}
          columns={columns}
          className="-striped -highlight"
          defaultPageSize={5}
          showPagination={false}
          SubComponent={row => {
            const addInferface = (custom_instance_id, custom_port_number, interfaceforInstance) => {
              const { ui_bundle_id } = row.original;
              this.props.add_ui_interface({id:custom_instance_id,port:parseInt(custom_port_number),bundle:ui_bundle_id,dna_interface:interfaceforInstance}).then((res)=>{
                console.log("Created");
              })
            }

            if(!row.original.ui_instance_exist){
                return (
                  <div style={{ paddingTop: "2px" }}>
                    <h3 style={{ color: "#567dbb", textAlign: "center" }}>No Instances Yet Exist</h3>
                    <div style={{ justifyItems: "center", display:"inline", margin:"2px" }}>
                      <AddUIInterfaceForm availableAgentList={this.props.containerApiCalls.agent_list} assignInstanceNewInterface={this.props.containerApiCalls.list_of_interfaces}
                      handleAddUIInterface={addInferface} />
                    </div>
                  </div>
                )
              }
              else {
                const dna_instance_data = this.displayInterfaceData(row);
                console.log("DNA INSTANCe: ",dna_instance_data);
                return (
                  <div style={{ paddingTop: "2px", marginBottom:"8px" }}>

                    <ReactTable
                      data={dna_instance_data}
                      columns={ui_interface_table_columns(this.props)}
                      defaultPageSize={dna_instance_data.length}
                      showPagination={false}
                      style = {{ margin: "0 auto", marginBottom: "50px", width:"90%", justifyItems:"center" }}
                    />
                     <div style={{ justifyItems: "center", display:"inline", margin:"2px" }}>
                          <AddUIInterfaceForm availableAgentList={this.props.containerApiCalls.agent_list} assignInstanceNewInterface={this.props.containerApiCalls.list_of_interfaces}
                          handleAddUIInterface={addInferface} />
                        </div>

                  </div>
                );
              }
         }}
      />
    </div>
  )}
}

export default HCUiTable;
