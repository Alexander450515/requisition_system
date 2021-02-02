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
    async CREATE_REQUISITION({ dispatch, commit, getters }, requisition) {
      try {
        await axios.post("http://localhost:3000/requisitions", requisition);
        const requisitions = await axios.get(
          "http://localhost:3000/requisitions"
        );
        commit("SET_REQUISITIONS_TO_STATE", requisitions.data);
        await dispatch("CREATE_EVENT_CREATED", getters.REQUISITIONS);
      } catch (error) {
        console.log(error);
      }
    },
    async CREATE_EVENT_CREATED({ dispatch, getters }, requisition) {
      try {
        console.log(requisition, "test");
        console.log(requisition[requisition.length - 1].id);
        await axios.post("http://localhost:3000/requisitions_history", {
          date: new Date().toLocaleString(),
          status: "Создана",
          requisition_id: requisition[requisition.length - 1].id,
          user: getters.CURRENT_USER,
        });
        dispatch("GET_REQUISITIONS");
        dispatch("GET_REQUISITIONS_HISTORY");
      } catch (error) {
        console.log(error);
      }
    },
    async CREATE_EVENT_TO_AGREEMENT({ dispatch }, requisition) {
      try {
        console.log(requisition, "test");
        console.log(requisition[requisition.length - 1].id);
        await axios.post("http://localhost:3000/requisitions_history", {
          date: new Date().toLocaleString(),
          status: "Передана на визирование",
          requisition_id: requisition[requisition.length - 1].id,
        });
        dispatch("GET_REQUISITIONS");
        dispatch("GET_REQUISITIONS_HISTORY");
      } catch (error) {
        console.log(error);
      }
    },
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
    async TO_AGREEMENT({ dispatch, getters }, id) {
      try {
        await axios.patch(`http://localhost:3000/requisitions/${id}`, {
          status: "Передана на визирование",
        });
        dispatch("GET_REQUISITIONS");
        await dispatch("CREATE_EVENT_TO_AGREEMENT", getters.REQUISITIONS);
      } catch (error) {
        console.log(error);
      }
    },
    async CHANGE_STATUS_TO_ACCEPTED({ dispatch }, id) {
      try {
        await axios.patch("http://localhost:3000/requisitions/" + id, {
          status: "Утверждена",
        });
        dispatch("GET_REQUISITIONS");
      } catch (error) {
        console.log(error);
      }
    },
    async CHANGE_STATUS_TO_REJECTED({ dispatch }, id) {
      try {
        await axios.patch("http://localhost:3000/requisitions/" + id, {
          status: "Отклонена",
        });
        dispatch("GET_REQUISITIONS");
      } catch (error) {
        console.log(error);
      }
    },
    async CHANGE_STATUS_TO_TAKEN_FOR_EXECUTION({ dispatch }, id) {
      try {
        await axios.patch("http://localhost:3000/requisitions/" + id, {
          status: "Принята к исполнению",
        });
        dispatch("GET_REQUISITIONS");
      } catch (error) {
        console.log(error);
      }
    },
    async CHANGE_STAGE({ dispatch }, { id, current_step }) {
      try {
        const response = await axios.patch(
          "http://localhost:3000/requisitions/" + id,
          {
            current_step: current_step,
          }
        );
        if (response.status == 200) {
          console.log(`CHANGE_STAGE ${response.status}`);
          dispatch("GET_REQUISITIONS");
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
