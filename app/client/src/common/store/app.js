export default {
  progress: {
    current: 0,
    total: 0,
  },
  message:'',
  tab_info:{
    tabs:{
      "Data": {
        content:'data-viewer',
        params: {
          data:null
        },
        activate:true
      },
      "Predict" :{
        content:'predict-viewer',
        params:null,
        activate:false
      }
    },
    active_tab: "Data"
  },
  dialog: {
    name: "",
    show: false,
    persistent: false,
    params: {},
  },
  file_info:{
    input_data:{},
    predict:{}
  },
  excludes:[],
  steps:[],
  default_setting: {
    name:null,
    start:null,
    end:null,
    excludes:[],
    forecast_horizon:0,
    n_epoch:100
  },
  setting_list : []
}