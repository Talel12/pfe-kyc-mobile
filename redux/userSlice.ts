import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to fetch users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async (id) => {
  try {
    const response = await axios({method: 'get',url:`${process.env.EXPO_PUBLIC_TUNNEL_STRAPI_URL}/api/users/${id}?populate[passport][populate][0]=passportImage&populate[id_card][populate][1]=frontImage&populate[face][populate][2]=faceImage&populate[detail][populate][3]=any`});
    console.log("🚀 ~ fetchUsers ~ response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});

// Thunk to validate OTP
export const validateOTP = createAsyncThunk("user/validateOTP", async ({ enteredOTP, phoneNumber }) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${process.env.EXPO_PUBLIC_TUNNEL_STRAPI_URL}/api/verify-code`,
      data: {
        enteredOTP,
        phoneNumber,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.status === 200) {
      throw new Error("Failed to validate OTP");
    }

    const data = response.data;
    return data.user ? { user: data.user } : { message: data.message };
  } catch (error) {
    console.error("Error validating OTP:", error);
    throw error;
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    currentUser: null,
    details: null,
    otpValidationMessage: null,
  },
  reducers: {
    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        // state.details = action.payload;
        state.currentUser = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      })
      .addCase(validateOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateOTP.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user) {
          state.currentUser = action.payload.user;
          state.otpValidationMessage = null;
        } else {
          state.otpValidationMessage = action.payload.message;
        }
      })
      .addCase(validateOTP.rejected, (state) => {
        state.loading = false;
        state.otpValidationMessage = "Failed to validate OTP";
      });
  },
});

export const { setMessage, logout } = userSlice.actions;
export default userSlice.reducer;
