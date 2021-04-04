<template>
<div style="width:100%;height:100%;">
  <div @dragover="dragover" @drop="drop" style="width:100%;height:100%;z-index:1;" ref="flow_container"></div>
  
  <div class="side-btn">
    <label style="font-size:0.8em;color:#684;">Snap</label>
    <div>
      <input v-model="grid_snap" type="checkbox" id="switch1" name="switch1" class="input__on-off">
      <label for="switch1" class="label__on-off">
        <span class="marble"></span>
      </label>
    </div>
      <div style="display: flex;">
        <v-tooltip left v-if="!expand">
          <template v-slot:activator="{ on }">
              <div v-on="on" draggable @dragstart="dragstart($event, selected_type)" @dblclick="expandItem" :style="'margin:.1em;width:50px;height: 50px;background: url(./static/images/'+selected_type.toLowerCase()+'.svg) 50% 50% / contain no-repeat;/* margin-top: 1em; *//* padding-top: 1em; */'"></div>
                </template>
          <span>드래그 앤 드랍으로 배치하며, 더블 클릭시 다른 노드를 선택 가능합니다.</span>
        </v-tooltip>
        <div v-else draggable @dragstart="dragstart($event, item)" @click="onSelectType(item)" :key="i" v-for="(item,i) in node_types" :style="'margin:.2em;width:50px;height: 50px;background: url(./static/images/'+item.toLowerCase()+'.svg) 50% 50% / contain no-repeat;'"></div>
      </div>
  </div>

</div>
</template>

<script>
import cytoscape from "cytoscape";
import cxtmenu from "cytoscape-cxtmenu";
import EdgeEditation from "./CytoscapeEdgeEditation.js";
import GridGuide from "cytoscape-grid-guide";

cytoscape.use(cxtmenu);
console.log(GridGuide);
GridGuide(cytoscape);

export default {
  props: ["onAction"],
  components: {},
  data() {
    return {
      grid_snap:true,
      expand:false,
      selected_type:'Process',
      node_types:['Process', 'Decision', 'Document', 'Terminal', 'OtherProcess', 'Database', 'MultiDocuments'],
      old_id: null,
      tab: 0,
      tabs: [{
        name: "Flow"
      }],
    };
  },
  watch: {
    "grid_snap": {
      deep:true,
      handler(val) {
        this.cy.gridGuide({
          snapToGridOnRelease: val,
          snapToGridDuringDrag: val
        })
        this.$message({type:'info', message:'Grid Snap 기능이 ' + (val ? '활성화' : '비활성화') + '되었습니다.'})
      }
    },
    "store.flow.edge_list": {
      deep:true,
      handler(val) {
        this.render_edge();
      }
    },
    "store.flow.selected_proc": {
      deep: true,
      handler(newVal, oldVal) {
        var me = this;
        me.cy.nodes('.flow').remove();

        this.render(newVal)
        this.render_edge();
      }
    }
  },
  methods: {
    search (tree, value, key = 'id', reverse = false) {
      const stack = [ tree[0] ]
      while (stack.length) {
        const node = stack[reverse ? 'pop' : 'shift']()
        if (node[key] === value) return node
        node.children && stack.push(...node.children)
      }
      return null
    },
    goToParent() {
      var parent_node = this.search(this.store.flow.node_list, this.store.flow.selected_proc.parent);
      if(parent_node) {
        this.store.flow.selected_proc = parent_node;
      }
    },
    dragstart: function(e, type) {
      e.dataTransfer.setData("type", type);
    },
    dragover: function(e) {
      e.preventDefault();
    },
    drop: function(e) {
      e.preventDefault();
      let zoom = this.cy.zoom();
      let pan = this.cy.pan();
      var position = {
        x: (e.offsetX - pan.x)/zoom,
        y: (e.offsetY - pan.y)/zoom,
      }

      if (this.store.flow.selected_proc.id) {
        var node = {
          idx: null,
          parent:this.store.flow.selected_proc.id,
          id: this.$common.utils.uuid(),
          name: "",
          render:'Flow',
          type: e.dataTransfer.getData("type"),
          desc: "",
          children: [],
          position: position,
          classes: ['flow']
        }
        this.store.flow.selected_proc.children.push(node);
      } else {
        this.$message({
          type: 'warning',
          message: 'TREE ITEM을 더블 클릭해주세요.'
        })
      }
      
    },
    expandItem() {
      this.expand = true;
    },
    onSelectType(type){
      this.selected_type = type;
      this.expand = false;
    },
    render_edge() {
      this.cy.edges().remove();
      this.store.flow.edge_list.forEach(function (d) {
        if(this.cy.nodes('#' + d.source).length > 0 && this.cy.nodes('#' + d.target).length > 0) {
          this.cy.add({
            data:d,
            "classes": "taxi"
          });
        }
      }.bind(this))
    },
    render(val) {
      var me = this;

      val.children.forEach(function (d, i) {
        if (me.cy.elements('#' + d.id).length > 0) {
          me.cy.elements('#' + d.id).data('name', d.name);
          me.cy.elements('#' + d.id).data('type', d.type);
          me.cy.elements('#' + d.id).data('desc', d.desc);
        } else {
          let zoom = me.cy.zoom();
          me.cy.add({
            data: {
              idx: d.idx,
              id: d.id,
              name: d.name,
              type: d.type,
              desc: d.desc,
            },
            position: d.position.x != null ? d.position : {
              x: (100 + (i * 5))/zoom,
              y: (60 + (i * 5))/zoom
            },
            classes: d.classes ? d.classes : ['flow']
          });
        }
      })
      me.old_id = val.id;
    },
    onExpandSidePanel() {
      this.$emit("onAction", {
        name: "expandNav"
      });
    },
    onShortCut(e) {
      if (e.keyCode == 46) {
        this.cy.elements(':selected').forEach(function (d) {
          if(d.data().type == 'Edge') {
            var rm_edge = this.store.flow.edge_list.findIndex(function(t) {
              return t.id == d.id()
            })
            
            if(this.store.flow.selected_type == 'Edge' && rm_edge == this.store.flow.selected_idx) this.store.flow.selected_idx = -1;
            this.store.flow.edge_list.splice(rm_edge, 1);

            this.render_edge();
          } else {
            var rm_idx = this.store.flow.selected_proc.children.findIndex(function (t) {
              return t.id == d.id()
            });
            if(this.store.flow.selected_type == 'Node' && rm_idx == this.store.flow.selected_idx) this.store.flow.selected_idx = -1;
            this.store.flow.selected_proc.children.splice(rm_idx, 1)

            this.store.flow.edge_list = this.store.flow.edge_list.filter(function(t, i) {
              return !(t.source == d.id() || t.target == d.id())
            })
          }
        }.bind(this))
      }
    }
  },
  created() {},
  mounted() {
    this.cy = cytoscape({
      wheelSensitivity: 0.1,
      zoom: 0.522719885372964,
      container: this.$refs.flow_container,
      layout: {
        name: "preset"
      },
      elements: {
        nodes: [],
        edges: []
      },
      style: [{
          selector: "node",
          style: {
            content: "data(name)",
            shape: function (node) {
              var shape = "rectangle";
              return shape;
            },
            'background-opacity': function (node) {
              var opacity = 0;
              return opacity;
            },
            'background-image': function (node) {
              var image_path = null;
              if (node.data("type")) {
                image_path = './static/images/' + node.data("type").toLowerCase() + '.svg'
              }
              return image_path;
            },
            "text-max-width": '150px',
            "text-wrap": 'ellipsis',
            "text-overflow-wrap": "anywhere",
            'text-valign': function (node) {
              var ret = 'top';
              ret = 'center'

              return ret;
            },
            'text-halign': function (node) {
              var ret = 'right';
              ret = 'center;'

              return ret;
            },
            "background-color": "#f6f6f6",
            "border-width": 0,
            "border-color": "#555",
            "font-size": 20,
            width: function (node) {
              var size = 175;

              return size;
            },
            height: function (node) {
              var size = 125;

              return size;
            }
          }
        },
        {
          selector: "node:selected",
          style: {
            "border-color": "#d67614",
            "border-width": 1.5
          }
        },
        {
          selector: "edge",
          style: {
            "line-color": "#555555",
            "target-arrow-color": "#555",
            "source-arrow-color": "#555",
            "text-border-color": "#555",
            color: "#555555",
            width: 3
          }
        },
        {
          selector: "edge:selected",
          style: {
            color: "#d67614",
            "line-color": "#d67614",
            "text-border-color": "#d67614",
            "source-arrow-color": "#d67614",
            "target-arrow-color": "#d67614"
          }
        },
        {
          selector: "edge.taxi",
          style: {
            label: "data(name)",
            "text-margin-x": "0px",
            "text-margin-y": "12px",
            "curve-style": "taxi",
            "taxi-direction": "downward",
            "taxi-turn": function (a) {
              var source = this.cy.nodes('#' + a.data().source).position()
              var target = this.cy.nodes('#' + a.data().target).position();
              var dis_y = source.y - target.y;
              var distance = Math.sqrt(Math.abs(dis_y * dis_y));
              return distance / 3;
            }.bind(this),
            width: 3,
            "taxi-turn-min-distance": 5,
            'target-arrow-shape': 'triangle'
          }
        }
      ],

    });
    //let eh = this.cy.edgehandles();
    this.cy.gridGuide({
      // On/Off Modules
      /* From the following four snap options, at most one should be true at a given time */
      snapToGridOnRelease: this.grid_snap, // Snap to grid on release
      snapToGridDuringDrag: this.grid_snap, // Snap to grid during drag
      snapToAlignmentLocationOnRelease: false, // Snap to alignment location on release
      snapToAlignmentLocationDuringDrag: false, // Snap to alignment location during drag
      distributionGuidelines: false, // Distribution guidelines
      geometricGuideline: false, // Geometric guidelines
      initPosAlignment: false, // Guideline to initial mouse position
      centerToEdgeAlignment: false, // Center to edge alignment
      resize: false, // Adjust node sizes to cell sizes
      parentPadding: false, // Adjust parent sizes to cell sizes by padding
      drawGrid: true, // Draw grid background

      // General
      gridSpacing: 100, // Distance between the lines of the grid.
      snapToGridCenter: true, // Snaps nodes to center of gridlines. When false, snaps to gridlines themselves. Note that either snapToGridOnRelease or snapToGridDuringDrag must be true.

      // Draw Grid
      zoomDash: true, // Determines whether the size of the dashes should change when the drawing is zoomed in and out if grid is drawn.
      panGrid: true, // Determines whether the grid should move then the user moves the graph if grid is drawn.
      gridStackOrder: -1, // Namely z-index
      gridColor: '#333333', // Color of grid lines
      lineWidth: 1.0, // Width of grid lines

      // Guidelines
      guidelinesStackOrder: 4, // z-index of guidelines
      guidelinesTolerance: 2.00, // Tolerance distance for rendered positions of nodes' interaction.
      guidelinesStyle: { // Set ctx properties of line. Properties are here:
        strokeStyle: "#8b7d6b", // color of geometric guidelines
        geometricGuidelineRange: 400, // range of geometric guidelines
        range: 100, // max range of distribution guidelines
        minDistRange: 10, // min range for distribution guidelines
        distGuidelineOffset: 10, // shift amount of distribution guidelines
        horizontalDistColor: "#ff0000", // color of horizontal distribution alignment
        verticalDistColor: "#00ff00", // color of vertical distribution alignment
        initPosAlignmentColor: "#0000ff", // color of alignment to initial mouse location
        lineDash: [0, 0], // line style of geometric guidelines
        horizontalDistLine: [0, 0], // line style of horizontal distribution guidelines
        verticalDistLine: [0, 0], // line style of vertical distribution guidelines
        initPosAlignmentLine: [0, 0], // line style of alignment to initial mouse position
      },

      // Parent Padding
      parentSpacing: -1 // -1 to set paddings of parents to gridSpacing
    });

    this.cy.cxtmenu({
      selector: "core",
      commands: [{
          content: "Process",
          select: function (org, evt) {
            if (this.store.flow.selected_proc.id) {
              let ele = {
                idx: null,
                parent:this.store.flow.selected_proc.id,
                id: this.$common.utils.uuid(),
                name: "테스트",
                render:'Flow',
                type: "Process",
                desc: "",
                children: [],
                position: evt.position,
                classes: ['flow']
              };
              this.store.flow.selected_proc.children.push(ele);
            } else {
              this.$message({
                type: 'warning',
                message: 'TREE ITEM을 더블 클릭해주세요.'
              })
            }
          }.bind(this)
        },
        {
          content: "Decision",
          select: function (org, evt) {
            if (this.store.flow.selected_proc.id) {
              var ele = {
                idx: null,
                parent:this.store.flow.selected_proc.id,
                id: this.$common.utils.uuid(),
                name: "",
                render:'Flow',
                type: "Decision",
                desc: "",
                children: [],
                position: evt.position,
                classes: ['flow']
              };
              this.store.flow.selected_proc.children.push(ele);
            } else {
              this.$message({
                type: 'warning',
                message: 'TREE ITEM을 더블 클릭해주세요.'
              })
            }
          }.bind(this)
        },
        {
          content: "Document",
          select: function (org, evt) {
            if (this.store.flow.selected_proc.id) {
              var ele = {
                idx: null,
                parent:this.store.flow.selected_proc.id,
                id: this.$common.utils.uuid(),
                name: "",
                render:'Flow',
                type: "Document",
                desc: "",
                children: [],
                position: evt.position,
                classes: ['flow']
              };
              this.store.flow.selected_proc.children.push(ele);
            } else {
              this.$message({
                type: 'warning',
                message: 'TREE ITEM을 더블 클릭해주세요.'
              })
            }
          }.bind(this)
        },
        {
          content: "Terminal",
          select: function (org, evt) {
            if (this.store.flow.selected_proc.id) {
              var ele = {
                idx: null,
                parent:this.store.flow.selected_proc.id,
                id: this.$common.utils.uuid(),
                name: "",
                render:'Flow',
                type: "Terminal",
                desc: "",
                children: [],
                position: evt.position,
                classes: ['flow']
              };
              this.store.flow.selected_proc.children.push(ele);
            } else {
              this.$message({
                type: 'warning',
                message: 'TREE ITEM을 더블 클릭해주세요.'
              })
            }
          }.bind(this)
        },
        {
          content: "Database",
          select: function (org, evt) {
            if (this.store.flow.selected_proc.id) {
              var ele = {
                idx: null,
                parent:this.store.flow.selected_proc.id,
                id: this.$common.utils.uuid(),
                name: "",
                render:'Flow',
                type: "Database",
                desc: "",
                children: [],
                position: evt.position,
                classes: ['flow']
              };
              this.store.flow.selected_proc.children.push(ele);
            } else {
              this.$message({
                type: 'warning',
                message: 'TREE ITEM을 더블 클릭해주세요.'
              })
            }
          }.bind(this)
        },
        {
          content: "Other\nProcess",
          select: function (org, evt) {
            if (this.store.flow.selected_proc.id) {
              var ele = {
                idx: null,
                parent:this.store.flow.selected_proc.id,
                id: this.$common.utils.uuid(),
                name: "",
                render:'Flow',
                type: "OtherProcess",
                desc: "",
                children: [],
                position: evt.position,
                classes: ['flow']
              };
              this.store.flow.selected_proc.children.push(ele);
            } else {
              this.$message({
                type: 'warning',
                message: 'TREE ITEM을 더블 클릭해주세요.'
              })
            }
          }.bind(this)
        },
        {
          content: "Multi\nDocuments",
          select: function (org, evt) {
            if (this.store.flow.selected_proc.id) {
              var ele = {
                idx: null,
                parent:this.store.flow.selected_proc.id,
                id: this.$common.utils.uuid(),
                name: "",
                render:'Flow',
                type: "MultiDocuments",
                desc: "",
                children: [],
                position: evt.position,
                classes: ['flow']
              };
              this.store.flow.selected_proc.children.push(ele);
            } else {
              this.$message({
                type: 'warning',
                message: 'TREE ITEM을 더블 클릭해주세요.'
              })
            }
          }.bind(this)
        }
      ]
    });

    this.handles = new EdgeEditation();
    this.handles.init(this.cy, function (edge) {
      this.store.flow.edge_list.push(edge.json().data);
    }.bind(this));

    this.handles.registerHandle({
      positionX: "center", //horizontal position of the handle  (left | center | right)
      positionY: "center", //vertical position of the handle  (top | center | bottom)
      color: "#518EF8", //color of the handle
      type: "Edge", //stored as data() attribute, can be used for styling
      single: false, //wheter only one edge of this type can start from same node (default false)
      nodeTypeNames: ['Process', 'Decision', 'Document', 'Process', 'Terminal', 'OtherProcess', 'Database', 'MultiDocuments'], //which types of nodes will contain this handle
      noMultigraph: false //whereter two nodes can't be connected with multiple edges (does not consider orientation)
    });

    this.cy.on(
      "tap",
      function (evt) {
        if (evt.target === this.cy) return;

        var node = evt.target;
        if(node.data().type == 'Edge') {
          var selected_idx = this.store.flow.edge_list.findIndex(function(d) {
            return d.id == node.id();
          })
          if(selected_idx > -1) {
            this.store.flow.selected_type = 'Edge';
            this.store.flow.selected_idx = selected_idx;
          }
        } else {
          var selected_idx = this.store.flow.selected_proc.children.findIndex(function (d) {
            return d.id == node.id()
          })
          if(selected_idx > -1) {
            this.store.flow.selected_type = 'Node';
            this.store.flow.selected_idx = selected_idx;
          }
        }
      }.bind(this)
    );
    this.cy.on('position', function(evt) {
      if (evt.target === this.cy) return;

      this.store.flow.dragging = true;
    }.bind(this))
    this.cy.on('dragfree', function(evt) {
      if (evt.target === this.cy) return;

      var node = evt.target;
      var selected_node = this.store.flow.selected_proc.children.find(function (d) {
        return d.id == node.id()
      })
      
      this.store.flow.dragging = false;
      if(selected_node) selected_node['position'] = evt.target.position();
    }.bind(this))

    // this.render(this.store.flow.selected_proc);
    // this.render_edge();
    
    window.document.addEventListener("keyup", this.onShortCut);
  },
  destroyed() {
    window.document.removeEventListener("keyup", this.onShortCut);
    this.handles.close();
  }
};
</script>

<style>
.side-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 0.2em;
  border: 1px solid #555;
  min-width: 50px;
  min-height: 50px;
  text-align: center;
  border-radius: 8px;
  z-index: 1;
  cursor: pointer;
  background: #333;
  box-shadow:0 4px 2px -3px rgba(0,0,0,.2), 0 3px 3px 0 rgba(0,0,0,.14), 0 2px 6px 0 rgba(0,0,0,.12);
  transition: 0.3s ease all;
}

input[type="checkbox"] {
  display: none;
}

.label__on-off {
    overflow: hidden;
    position: relative;
    display: inline-block;
    width: 29px;
    height: 14px;
    -webkit-border-radius: 13px;
    -moz-border-radius: 13px;
    border-radius: 13px;
    background-color: rgb(66, 66, 66);
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
}

.label__on-off > * {
    vertical-align: sub;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
    font-size: 7px;
}

.label__on-off .marble {
    position: absolute;
    top: 1px;
    left: 1px;
    display: block;
    width: 12px;
    height: 12px;
    background-color: #fff;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, .3);
    -moz-box-shadow: 0 0 10px rgba(0, 0, 0, .3);
    box-shadow: 0 0 10px rgba(0, 0, 0, .3);
}

.label__on-off .on {
    display: none;
    padding-left: 6px;
}

.label__on-off .off {
    padding-left: 15px;
    line-height: 12.5px;
}

.input__on-off:checked + .label__on-off {
    background-color: #0bba82;
}

.input__on-off:checked + .label__on-off .on {
    display: inline-block;
}

.input__on-off:checked + .label__on-off .off {
    display: none;
}

.input__on-off:checked + .label__on-off .marble {
    left: 16px;
}

</style>
