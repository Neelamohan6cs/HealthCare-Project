import { createSlice } from "@reduxjs/toolkit";


const healthSlice = createSlice({
  name: "health",
  initialState: {
    patientData: null
  },
  reducers: {
    setPatientData: (state, action) => {
      state.patientData = action.payload;
    }
  }
});

export const { setPatientData } = healthSlice.actions;
export default healthSlice.reducer;