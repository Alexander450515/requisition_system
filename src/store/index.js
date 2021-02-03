import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    users: [],
    requisition_types: [],
    requisitions: [],
    selectedUser: "",
    requisitions_history: [],
  },
  mutations: {
    SET_REQUISITIONS_TO_STATE: (state, requisitions) => {
      state.requisitions = requisitions;
    },
    SET_REQUISITION_TYPES_TO_STATE: (state, requisition_types) => {
      state.requisition_types = requisition_types;
    },
    SET_USERS_TO_STATE: (state, users) => {
      state.users = users;
    },
    SET_HISTORY_TO_STATE: (state, requisitions_history) => {
      state.requisitions_history = requisitions_history;
    },
    SET_SELECTED_USER: (state, selectedUser) => {
      state.selectedUser = selectedUser;
    },
  },
  actions: {
    async GET_REQUISITIONS({ commit }) {
      try {
        const requisitions = await axios.get(
          "http://localhost:3000/requisitions"
        );
        commit("SET_REQUISITIONS_TO_STATE", requisitions.data);
      } catch (error) {
        console.log(error);
      }
    },
    async GET_USERS({ commit }) {
      try {
        const users = await axios.get("http://localhost:3000/users");
        commit("SET_USERS_TO_STATE", users.data);
      } catch (error) {
        console.log(error);
      }
    },
    async GET_REQUISITION_TYPES({ commit }) {
      try {
        const requisition_types = await axios.get(
          "http://localhost:3000/requisition_types"
        );
        commit("SET_REQUISITION_TYPES_TO_STATE", requisition_types.data);
      } catch (error) {
        console.log(error);
      }
    },
    async GET_REQUISITIONS_HISTORY({ commit }) {
      try {
        const requisitions_history = await axios.get(
          "http://localhost:3000/requisitions_history"
        );
        commit("SET_HISTORY_TO_STATE", requisitions_history.data);
      } catch (error) {
        console.log(error);
      }
    },
    async TO_AGREEMENT(
      { dispatch, commit },
      { id, current_stage, last_complited_stage, status, current_step }
    ) {
      try {
        await axios.patch(`http://localhost:3000/requisitions/${id}`, {
          status: status,
          current_step: current_step,
          last_complited_stage: last_complited_stage,
          current_stage: current_stage,
        });
        const requisitions = await axios.get(
          "http://localhost:3000/requisitions"
        );
        commit("SET_REQUISITIONS_TO_STATE", requisitions.data);
        await dispatch("CREATE_EVENT_TO_AGREEMENT", {
          id,
          current_stage,
          last_complited_stage,
        });
      } catch (error) {
        console.log(error);
      }
    },
    async CREATE_EVENT_TO_AGREEMENT(
      { dispatch, getters },
      { id, current_stage, last_complited_stage }
    ) {
      try {
        await axios.post("http://localhost:3000/requisitions_history", {
          date: new Date().toLocaleString(),
          status: "Передана на визирование",
          user: getters.CURRENT_USER,
          requisition_id: id,
          last_complited_stage: last_complited_stage,
          current_stage: current_stage,
        });
        await dispatch("GET_REQUISITIONS");
        await dispatch("GET_REQUISITIONS_HISTORY");
      } catch (error) {
        console.log(error);
      }
    },
    async CREATE_EVENT(
      { dispatch, getters },
      { requisition_id, current_stage, last_complited_stage }
    ) {
      try {
        await axios.post("http://localhost:3000/requisitions_history", {
          date: new Date().toLocaleString(),
          status: "Передана на визирование",
          user: getters.CURRENT_USER,
          requisition_id: requisition_id,
          last_complited_stage: last_complited_stage,
          current_stage: current_stage,
        });
        await dispatch("GET_REQUISITIONS");
        await dispatch("GET_REQUISITIONS_HISTORY");
      } catch (error) {
        console.log(error);
      }
    },
    async CREATE_REQUISITION({ dispatch, commit }, requisition) {
      try {
        await axios.post("http://localhost:3000/requisitions", requisition);
        const requisitions = await axios.get(
          "http://localhost:3000/requisitions"
        );
        commit("SET_REQUISITIONS_TO_STATE", requisitions.data);
        await dispatch("CREATE_EVENT_CREATED", requisition);
      } catch (error) {
        console.log(error);
      }
    },
    async CREATE_EVENT_CREATED({ dispatch, getters }, requisition) {
      try {
        await axios.post("http://localhost:3000/requisitions_history", {
          date: new Date().toLocaleString(),
          status: "Создана",
          requisition_id:
            getters.REQUISITIONS[getters.REQUISITIONS.length - 1].id,
          user: getters.CURRENT_USER,
          last_complited_stage: requisition.last_complited_stage,
          current_stage: "",
        });
        dispatch("GET_REQUISITIONS");
        dispatch("GET_REQUISITIONS_HISTORY");
      } catch (error) {
        console.log(error);
      }
    },

    async CHANGE_STAGE(
      { dispatch },
      { id, current_stage, last_complited_stage, status, current_step }
    ) {
      try {
        const response = await axios.patch(
          `http://localhost:3000/requisitions/${id}`,
          {
            status: status,
            current_step: current_step,
            last_complited_stage: last_complited_stage,
            current_stage: current_stage,
          }
        );
        if (response.status == 200) {
          await dispatch("CREATE_EVENT", {
            requisition_id: id,
            current_stage: current_stage,
            last_complited_stage: last_complited_stage,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async TO_ACCEPTED(
      { dispatch },
      { id, current_step, last_complited_stage, current_stage }
    ) {
      try {
        const response = await axios.patch(
          "http://localhost:3000/requisitions/" + id,
          {
            current_step: current_step,
            last_complited_stage: last_complited_stage,
            current_stage: current_stage,
            status: "Принята к исполнению",
          }
        );
        if (response.status == 200) {
          await dispatch("CREATE_EVENT", {
            requisition_id: id,
            current_stage: current_stage,
            last_complited_stage: last_complited_stage,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {
    REQUISITIONS(state) {
      return state.requisitions;
    },
    USERS(state) {
      return state.users.map((user) => user.name);
    },
    CURRENT_USER(state) {
      return state.selectedUser;
    },
    CURRENT_USER_PERMISSIONS(state, getters) {
      let currentUserObject = state.users.find(
        (user) => user.name == getters.CURRENT_USER
      );
      if (currentUserObject != undefined) {
        return currentUserObject.permissions;
      }
    },
    REQUISITION_TYPES(state) {
      return state.requisition_types;
    },
    REQUISITIONS_HISTORY(state) {
      return state.requisitions_history;
    },
  },
});
