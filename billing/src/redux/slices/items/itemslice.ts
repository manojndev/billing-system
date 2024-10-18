import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const itemsdata: any = {
    data: null,
    loading: false,
    error: null,
};

export const itemsSlice = createSlice({
    name: 'Welcome',
    initialState: itemsdata,
    reducers: {
        fetchitemsStart: (state:any) => {
            state.loading = true;
            state.error = null;
        },
        fetchitemsSuccess: (state, action: PayloadAction<String>) => {
            state.data = null;//action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchitemsFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
            state.data = null;
        } }
});

export const {
    fetchitemsStart: fetchWelcomeStart,
    fetchitemsSuccess: fetchWelcomeSuccess,
    fetchitemsFailure: fetchWelcomeFailure,
} = itemsSlice.actions;

export default itemsSlice.reducer;
