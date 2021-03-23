<template>
  <div style="width: 100%">
    <div v-for="(item, idx) in items" :key="idx" :class="'nav-menu-item ' + (item.name === selected_item ? 'selected' : '')" @click="onClickItem(item)">
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-hover v-slot:default="{ hover }">
            <div class="nav-menu-item">
              <v-icon class="nav-menu-item-icon" v-on="on">
                {{ item.icon }}
              </v-icon>
            </div>
          </v-hover>
        </template>
        <span>{{ item.label }}</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import NavBarItems from "./NavBarItems";

export default {
  watch: {
    'mrx_store.app.current_nav': function(new_val, old_val) {
      const { panels } = NavBarItems.find((x) => x.name === new_val);
      this.selected_item = new_val;
      this.$common.store.setProperty("app.panels", panels);
    },
  },
  data() {
    return {
      selected_item: '',
      items: NavBarItems,
    };
  },
  methods: {
    notifications() {
      return [{ path: "app.user_info", callback: this.onLogin }];
    }
  },
  created() {

  },
  mounted() {

  },
  destroyed() {

  },
};
</script>

<style scoped>
.nav-menu-item {
  height: 5em;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(133, 133, 133);
}

.nav-menu-item.selected {
  border-left: 2px solid white;
  color: rgb(255, 255, 255);
}

.nav-menu-item-icon {
  color: #858585;
}

.selected .nav-menu-item-icon {
  color: #fff;
}
</style>
