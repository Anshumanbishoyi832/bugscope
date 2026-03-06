import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchErrors = createAsyncThunk(
  "errors/fetchErrors",
  async ({ projectId, status } = {}, { rejectWithValue }) => {
    try {
      const params = { projectId };
      if (status && status !== "all") params.status = status;
      const res = await api.get("/errors", { params });
      return res.data.errors || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch errors");
    }
  }
);

export const resolveError = createAsyncThunk(
  "errors/resolveError",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/errors/${id}/resolve`);
      return res.data.error;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to resolve error");
    }
  }
);

const errorSlice = createSlice({

  name: "errors",

  initialState: {
    list: [],
    loading: false,
    error: null
  },

  reducers: {
    setErrors: (state, action) => {
      state.list = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchErrors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchErrors.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchErrors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resolveError.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.list.findIndex((e) => e._id === updated._id);
        if (idx !== -1) state.list[idx] = updated;
      });
  }

});

export const { setErrors } = errorSlice.actions;

export default errorSlice.reducer;