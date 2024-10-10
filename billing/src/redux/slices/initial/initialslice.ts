import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WelcomeResponseState } from './initial.type';

const WelcomeInitialState: WelcomeResponseState = {
    data: null,
    loading: false,
    error: null,
};

export const WelcomeSlice = createSlice({
    name: 'Welcome',
    initialState: WelcomeInitialState,
    reducers: {
        fetchWelcomeStart: (state:WelcomeResponseState) => {
            state.loading = true;
            state.error = null;
        },
        fetchWelcomeSuccess: (state, action: PayloadAction<String>) => {
            state.data = null;//action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchWelcomeFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
            state.data = null;
        } }
});

export const {
    fetchWelcomeStart: fetchWelcomeStart,
    fetchWelcomeSuccess: fetchWelcomeSuccess,
    fetchWelcomeFailure: fetchWelcomeFailure,
} = WelcomeSlice.actions;

export default WelcomeSlice.reducer;
