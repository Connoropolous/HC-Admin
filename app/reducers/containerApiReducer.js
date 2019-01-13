import { FETCH_STATE } from '../actions/containerApi';

const INITIAL_STATE : State = {
 list_of_dna : [],
 list_of_instances : [],
 list_of_running_instances :[],
 list_of_instance_info : []
}

export default function(state = INITIAL_STATE, action: Action) : State {
  // console.log(">>>>>>>>>>>>>>>REDUCER",action);

  const { type, payload } = action
  switch (type) {
    case FETCH_STATE: {
      return { ...state };
    }

////////////////////////////////////////////////////////
    /* Reporting Container DNAs/DNA-instances */
////////////////////////////////////////////////////////
    // LIST_OF_DNA
    case 'LIST_OF_DNA_SUCCESS': {
      console.log("LIST_OF_DNA_SUCCESS payload", payload);
      return { ...state, list_of_dna : false };
    }

// LIST_OF_INSTANCES
    case 'LIST_OF_INSTANCES_SUCCESS': {
      console.log("LIST_OF_INSTANCES_SUCCESS payload", payload);
      return { ...state, list_of_instances : payload };
    }

// LIST_OF_RUNNING_INSTANCES
    case 'LIST_OF_RUNNING_INSTANCES_SUCCESS': {
      console.log("LIST_OF_RUNNING_INSTANCES_SUCCESS payload", payload);
      return { ...state, list_of_running_instances : payload };
    }

// GET_INFO_INSTANCE
    case 'GET_INFO_INSTANCES_SUCCESS': {
      console.log("GET_INFO_INSTANCES_SUCCESS payload", payload);
      const list_of_instance_info = JSON.parse(payload);
      console.log("REDUCER VERSION OF >>>> info_instances <<<<<", list_of_instance_info);
      return { ...state, list_of_instance_info };
    }

////////////////////////////////////////////////////////
      /* Updating Container DNAs/DNA-instances */
////////////////////////////////////////////////////////
// INSTALL_DNA_BY_ID_SUCCESS
    case 'INSTALL_DNA_FROM_FILE_SUCCESS': {
      console.log("INSTALL_DNA_FROM_FILE_SUCCESS payload", payload);
      return { ...state };
    }

    case 'INSTALL_DNA_FROM_FILE_FAILURE': {
      console.log("INSTALL_DNA_FROM_FILE_FAILURE payload", payload);
      return { ...state };
    }

// UNINSTALL_DNA_BY_ID_SUCCESS
    case 'UNINSTALL_DNA_BY_ID_SUCCESS': {
      console.log("UNINSTALL_DNA_BY_ID_SUCCESS payload", payload);
      return { ...state };
    }

    case 'UNINSTALL_DNA_BY_ID_FAILURE': {
      console.log("UNINSTALL_DNA_BY_ID_FAILURE payload", payload);
      return { ...state };
    }

  // ADD_AGENT_DNA_INSTANCE
      case 'ADD_AGENT_DNA_INSTANCE_SUCCESS': {
        console.log("ADD_AGENT_DNA_INSTANCE_SUCCESS payload", payload);
        return { ...state };
      }

      case 'ADD_AGENT_DNA_INSTANCE_FAILURE': {
        console.log("ADD_AGENT_DNA_INSTANCE_FAILURE payload", payload);
        return { ...state };
      }

  // REMOVE_AGENT_DNA_INSTANCE
      case 'REMOVE_AGENT_DNA_INSTANCE_SUCCESS': {
        console.log("REMOVE_AGENT_DNA_INSTANCE_SUCCESS payload", payload);
        return { ...state };
      }

      case 'REMOVE_AGENT_DNA_INSTANCE_FAILURE': {
        console.log("REMOVE_AGENT_DNA_INSTANCE_FAILURE payload", payload);
        return { ...state };
      }

  // START_AGENT_DNA_INSTANCE
    case 'START_AGENT_DNA_INSTANCE_SUCCESS': {
      console.log("START_AGENT_DNA_INSTANCE_SUCCESS payload", payload);
      return { ...state };
    }

    case 'START_AGENT_DNA_INSTANCE_FAILURE': {
      console.log("START_AGENT_DNA_INSTANCE_FAILURE payload", payload);
      return { ...state };
    }

 // STOP_AGENT_DNA_INSTANCE
    case 'STOP_AGENT_DNA_INSTANCE_SUCCESS': {
      console.log("STOP_AGENT_DNA_INSTANCE_SUCCESS payload", payload);
      return { ...state };
    }

    case 'STOP_AGENT_DNA_INSTANCE_FAILURE': {
      console.log("STOP_AGENT_DNA_INSTANCE_FAILURE payload", payload);
      return { ...state };
    }

    ///////////////////////////////////////////
    // case 'CALL_ZOME_FUNC_SUCCESS': {
    //   console.log("CALL_HOLOCHAIN_FUNC_SUCCESS state", payload);
    //   return { ...state};
    // }
    //
    // case 'CALL_ZOME_FUNC_FAILURE': {
    //   console.log("CALL_ZOME_FUNC_FAILURE state", payload);
    //   return { ...state};
    // }
    ///////////////////////////////////////////
    default:
      return state
  }
}