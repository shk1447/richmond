var common = [];

var windows = [];

var panels = [];

var dialogs = [];

var viewers = [{
  compName: 'data',
  compPath: require('./components/contents/DataViewer.vue')
}, {
  compName: 'chart',
  compPath: require('./components/contents/ChartViewer.vue')
}, {
  compName: 'code',
  compPath: require('./components/contents/CodeViewer.vue')
}, {
  compName: 'map',
  compPath: require('./components/contents/MapViewer.vue')
}];

export default {
  common: common,
  windows: windows,
  panels: panels,
  dialogs: dialogs,
  viewers: viewers,
};
