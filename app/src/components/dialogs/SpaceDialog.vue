<template>
  <v-card tile outlined ref="ref_project_list">
    <v-data-table :headers="headers" :items="store.flow.space_list">
      <template v-slot:top>
        <v-toolbar short flat>
          <v-toolbar-title>SPACES</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialogProject" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="red darken-1" text dark v-on="on">New Space</v-btn>
            </template>
            <v-card tile outlined ref="ref_new_project">
              <v-container>
                <v-form @submit="onSubmit">
                  <v-row>
                    <v-col>
                      <v-text-field hide-details placeholder=" " v-model="setting.space_name" autocomplete="off" label="SPACE NAME"></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" @click="dialogProject = false" text>Cancel</v-btn>
                <v-btn color="blue darken-1" @click="addProject" text>Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:body="{ items }">
        <tbody>
          <v-tooltip right v-for="(item, idx) in items" :key="idx">
            <template v-slot:activator="{ on }">
              <tr v-on="on" @dblclick="loadSpace(item)" style="cursor: pointer; user-select: none">
                <td>{{ item.space_name }}</td>
                <td>{{ item.space_desc }}</td>
                <td>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-hover v-slot:default="{ hover }">
                        <v-icon v-on="on" small @click="joinProject(item)" :disabled="item.email === login_email || item.user_type == 'external'" :color="hover ? 'cyan' : 'white'"> mdi-share-variant </v-icon>
                      </v-hover>
                    </template>
                    <span>Invite Space</span>
                  </v-tooltip>
                </td>
                <td>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-hover v-slot:default="{ hover }">
                        <v-icon v-on="on" :disabled="item.email === login_email || item.user_type == 'external'" small :color="hover ? 'red' : 'white'"> mdi-trash-can-outline </v-icon>
                      </v-hover>
                    </template>
                    <span>Remove Space</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
            <v-progress-linear
              :active="true"
              :value="Math.random() * 100"
              absolute
              bottom
              color="deep-purple accent-4"
            ></v-progress-linear>
            <span>Disk Usage</span>
          </v-tooltip>
        </tbody>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  props: ["params"],
  data() {
    return {
      dialogProject: false,
      setting: {
        space_name: "",
      },
      headers: [
        { text: "SPACE NAME", value: "space_name" },
        { text: "DESCRIPTION", value: "space_desc" },
        { text: "INVITE", value: "", sortable: false },
        { text: "REMOVE", value: "", sortable: false },
      ],
      login_email: "",
    };
  },
  methods: {
    loadSpace(item) {
      this.store.flow.node_list = [{
        parent: null,
        id: 'project01',
        name: 'ABC 회사 2021 V1.0',
        space_name: 'ABC 회사',
        type: 'Process',
        desc: '',
        children: []
      }, {
        parent: null,
        id: 'project02',
        name: 'ABC 회사 2021 V2.0',
        space_name: 'ABC 회사',
        type: 'Process',
        desc: '',
        children: []
      }, {
        parent: null,
        id: 'project03',
        name: 'WOORI 회사 2021 V1.0',
        space_name: 'WOORI 회사',
        type: 'Process',
        desc: '',
        children: []
      }].filter(function(d) { return d.space_name == item.space_name})

      this.store.app.dialog = {
        show:false,
        compName : '',
        params: {}
      }
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

<style scoped></style>
