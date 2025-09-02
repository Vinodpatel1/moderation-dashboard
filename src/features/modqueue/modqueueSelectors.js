export const selectCountsByStatus = (state) => {
  const counts = { pending: 0, approved: 0, rejected: 0 };
  state.modqueue.posts.forEach((p) => {
    counts[p.status]++;
  });
  return counts;
};

export const selectFilteredPosts = (state) => {
  const { posts, statusFilter } = state.modqueue;
  if (statusFilter === "all") return posts;
  return posts.filter((p) => p.status === statusFilter);
};
