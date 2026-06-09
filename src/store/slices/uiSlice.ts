import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  commentSheetVideoId: string | null;
  toastMessage: string | null;
  isUploadModalVisible: boolean;
}

const initialState: UIState = {
  commentSheetVideoId: null,
  toastMessage: null,
  isUploadModalVisible: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCommentSheetVideoId(state, action: PayloadAction<string | null>) {
      state.commentSheetVideoId = action.payload;
    },
    clearCommentSheet(state) {
      state.commentSheetVideoId = null;
    },
    showToast(state, action: PayloadAction<string>) {
      state.toastMessage = action.payload;
    },
    clearToast(state) {
      state.toastMessage = null;
    },
    setUploadModalVisible(state, action: PayloadAction<boolean>) {
      state.isUploadModalVisible = action.payload;
    },
  },
});

export const {
  setCommentSheetVideoId,
  clearCommentSheet,
  showToast,
  clearToast,
  setUploadModalVisible,
} = uiSlice.actions;
export default uiSlice.reducer;
