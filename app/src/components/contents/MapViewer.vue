<template>
  <div class="map-container" ref="map_player"></div>
</template>

<script>
import { addListener, removeListener } from "resize-detector";

export default {
  components: {
    // 외부 컴포넌트 등록
  },
  methods: {
    init() {
      this._map = L.map(this.$refs.map_player, {
        center: new L.LatLng(36.3801, 127.3677),
        zoom: 11,
        crs: L.TileLayer.KoreaProvider.providers['NaverMap'].crs,
        zoomOffset: -1,
        zoomControl:false,
        attributionControl:false,
        worldCopyJump: false,
        scrollWheelZoom: false, // disable original zoom function
        smoothWheelZoom: true,  // enable smooth zoom 
        smoothSensitivity: 1,   // zoom speed. default is 1
      });

      L.tileLayer
        .koreaProvider("NaverMap.Street")
        .addTo(this._map);
    },
    resizeHandler() {
      this._map.invalidateSize();
    }
  },
  watch: {
  },
  data() {
    // 해당 view에서 사용되는 변수 등록(<temaplte></template>연동)
    return {
      
    };
  },
  created() {
    // vue lifecycle01 : dom이 생성되기 전 instance 생성시 발생
    console.log("created");
  },
  mounted() {
    // vue lifecycle02 : dom객체가 browser에 생성시 발생
    console.log("mounted");
    addListener(this.$el, this.resizeHandler)
    this.init();
  },
  updated() {
    // vue lifecycle03 : data 변경으로 인해 dom update시 발생
  },
  beforeDestroy() {

  },
  destroyed() {
    // vue lifecycle04 : view destroy시 발생
    console.log("destroyed");
    removeListener(this.$el, this.resizeHandler);
  },
};
</script>

<style scoped>
.map-container {
  position:absolute; width:100%; height:100%;
}
</style>
