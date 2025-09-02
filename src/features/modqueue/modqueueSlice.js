import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mockPosts } from "./mockData";

// Simulate API call
export const loadPosts = createAsyncThunk("modqueue/loadPosts", async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 80% chance success, 20% chance error
      if (Math.random() < 0.8) resolve(mockPosts);
      else reject(new Error("Failed to load posts 😢"));
    }, 1500);
  });
});
const initialState = {
  posts: mockPosts,
  statusFilter: "pending",
  selectedIds: [],
  loading: false,
  error: null,
  history: [],
};

const modqueueSlice = createSlice({
  name: "modqueue",
  initialState,
  reducers: {
    // toggle single select
    toggleSelect: (state, action) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((x) => x !== id);
      } else {
        state.selectedIds.push(id);
      }
    },

    // handle async thunks for loading posts from "API" extraReducers
    extraReducers: (builder) => {
  builder
    .addCase(loadPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loadPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = action.payload;
    })
    .addCase(loadPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
},

    // set selection to a list of ids (used for Select All)
    selectAll: (state, action) => {
      state.selectedIds = action.payload; // payload: array of ids
    },

    // clear any selection
    clearSelection: (state) => {
      state.selectedIds = [];
    },

    // approve single
    // inside reducers
    approvePost: (state, action) => {
      const id = action.payload;
      const post = state.posts.find((p) => p.id === id);
      if (post) {
        // push as array for consistency
        state.history.push([{ id, prev: post.status }]);
        post.status = "approved";
      }
    },

    rejectPost: (state, action) => {
      const id = action.payload;
      const post = state.posts.find((p) => p.id === id);
      if (post) {
        state.history.push([{ id, prev: post.status }]);
        post.status = "rejected";
      }
    },

    approvePosts: (state, action) => {
      const ids = action.payload;
      const batch = [];
      ids.forEach((id) => {
        const post = state.posts.find((p) => p.id === id);
        if (post) {
          batch.push({ id, prev: post.status });
          post.status = "approved";
        }
      });
      if (batch.length > 0) state.history.push(batch);
      state.selectedIds = [];
    },

    rejectPosts: (state, action) => {
      const ids = action.payload;
      const batch = [];
      ids.forEach((id) => {
        const post = state.posts.find((p) => p.id === id);
        if (post) {
          batch.push({ id, prev: post.status });
          post.status = "rejected";
        }
      });
      if (batch.length > 0) state.history.push(batch);
      state.selectedIds = [];
    },

    undoLast: (state) => {
      const lastBatch = state.history.pop();
      if (!lastBatch) return;
      lastBatch.forEach(({ id, prev }) => {
        const post = state.posts.find((p) => p.id === id);
        if (post) {
          post.status = prev;
        }
      });
    },

    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload; // 'pending' | 'approved' | 'rejected' | 'all'
    },
  },
});

export const {
  toggleSelect,
  selectAll,
  clearSelection,
  approvePost,
  rejectPost,
  approvePosts,
  rejectPosts,
  setStatusFilter,
  undoLast,
  extraReducers,
} = modqueueSlice.actions;
export default modqueueSlice.reducer;
