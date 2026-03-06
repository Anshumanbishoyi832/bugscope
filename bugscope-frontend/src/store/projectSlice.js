import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({

  name: "projects",

  initialState: {
    list: [],
    selectedProject: localStorage.getItem("selectedProject") || null
  },

  reducers: {

    setProjects: (state, action) => {
      state.list = action.payload;
    },

    selectProject: (state, action) => {
      state.selectedProject = action.payload;
      localStorage.setItem("selectedProject", action.payload);
    }

  }

});

export const { setProjects, selectProject } = projectSlice.actions;

export default projectSlice.reducer;