<template>
<v-container>
  <v-card tile outlined>
    <v-card-title>PERIOD</v-card-title>
    <v-card-text>
      <div
        style="display: flex; align-items: center; margin-top: 16px; margin-bottom: 20px"
      >
      <span style="margin-right: .5em;">학습설정</span>
        <flat-pickr
          style="
            flex: 1;
            width:100px;
            border-bottom: 1px solid #bcbcbc;
            padding: 0.4em;
            outline: none;
            margin-right: .5em;
            color:rgba(240,240,240,0.8);
            text-align:center;
          "
          @on-change="onChangeStartTime"
          v-model="starttime"
          :config="config"
          placeholder="START"
        ></flat-pickr>
        <label style="color: rgba(240, 240, 240, 0.8)"> - </label>
        <flat-pickr
          style="
            flex: 1;
            width:100px;
            border-bottom: 1px solid #bcbcbc;
            padding: 0.4em;
            outline: none;
            margin-left: .5em;
            margin-right: .5em;
            color:rgba(240,240,240,0.8);
            text-align:center;
          "
          @on-change="onChangeEndTime"
          v-model="endtime"
          :config="config"
          placeholder="END"
        ></flat-pickr>
        <label style="color: rgba(240, 240, 240, 0.8)"> : </label>
        <v-text-field style="flex:1.25; margin-left:0.5em; padding-top:0px; margin-top:0px; text-align:center;" v-model="forcast_horizon" type="number" hide-details placeholder="예측기간(월)" label=""></v-text-field>
      </div>
      <div>
        <v-autocomplete multiple :items="mrx_store.app.excludes" label="Excludes" placeholder=" " v-model="excludes"></v-autocomplete>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn small @click="emit_confirm(false)">CANCEL</v-btn>
      <v-btn small class="white--text" color="#00B0FF" @click="emit_confirm(true)">APPLY</v-btn>
    </v-card-actions>
  </v-card>
</v-container>
</template>

<script>
import moment from 'moment';
export default {
  props: ["params"],
  data() {
    return {
      config: {
        wrap: false,
        enableTime: false,
        dateFormat: "Y-m-d",
        minuteIncrement: 1,
        allowInput: false,
      },
      starttime:null,
      endtime:null,
      excludes:[],
      forcast_horizon:0,
      items:[]
    };
  },
  computed: {},
  methods: {
    emit_confirm(action) {
      var res = {
        start:this.starttime,
        end: this.endtime,
        forcast_horizon:this.forcast_horizon,
        excludes: this.excludes
      }
      this.params.onConfirm(res);
    },
    onChangeStartTime(val) {
      var _end = moment(val[0]).endOf('month');
      if(this.mrx_store.app.excludes.includes(_end.format('YYYY-MM-DD'))) {
        this.starttime = _end;
      } else {
        this.starttime = moment(this.mrx_store.app.excludes[0]).endOf('month');
      }
    },
    onChangeEndTime(val) {
      var _end = moment(val[0]).endOf('month');
      if(this.mrx_store.app.excludes.includes(_end.format('YYYY-MM-DD'))) {
        this.endtime = _end;
      } else {
        this.endtime = moment(this.mrx_store.app.excludes[this.mrx_store.app.excludes.length - 1]).endOf('month');
      }
    }
  },
  created() {
    this.starttime = "2018-01-31";
    this.endtime = "2020-10-31";
  },
  mounted() {},
  updated() {},
  destroyed() {},
};
</script>

<style scoped></style>
