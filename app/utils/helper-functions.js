//////////////////////////////////////////
    // ELECTRON IPC Calls
/////////////////////////////////////////
import * as electron from "electron";

export const getHomePath = () => {
  return electron.remote.app.getPath("home");
}

export const handleCloseApp = () => {
  console.log("TRYING TO CLOSE APP...")
  const { ipcRenderer } = electron;
  const quit = 'quit'
  ipcRenderer.send("window:close", quit);
};

export const handleRefreshApp = () => {
  console.log("TRYING TO REFRESH APP...")
  const { ipcRenderer } = electron;
  const refresh = 'refresh'
  ipcRenderer.send("window:refresh", refresh);
};

//////////////////////////////////////////
    // CMD Downloaded Apps Mangement
/////////////////////////////////////////
const manageAllDownloadedApps = (allApps) => {
  console.log("helper function manageAllDownloadedApps...");

  let listOfApps = allApps.split("\n");
  listOfApps = listOfApps.filter((app)=>{
    return app !== "";
  });
  const app_details = listOfApps.map((app)=>{
    // ATTN > changed app_name tp dna_id
    return { "dna_id": app,
     "path": `~/.hcadmin/holochain-download/${app}` }
  });
  return app_details;
}
export default manageAllDownloadedApps;

//////////////////////////////////////////
    // Custom Serach Bar Functions
/////////////////////////////////////////
