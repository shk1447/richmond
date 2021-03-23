var common = [];

var windows = [];

var panels = [];

var dialogs = [{
  compName:'predict-setting',
  compPath:require('./components/dialogs/PredictSetting.vue')
}];

var viewers = [{
  compName:'data',
  compPath:require('./components/contents/DataViewer.vue')
},{
  compName:'predict',
  compPath:require('./components/contents/PredictViewer.vue')
}];

export default {
  common: common,
  windows: windows,
  panels: panels,
  dialogs: dialogs,
  viewers: viewers,
};
