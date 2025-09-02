import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import PostToolbar from "./PostToolbar";
import { approvePost, rejectPost, select, deselect } from "../modqueueSlice";
import { selectFilteredPosts } from "../modqueueSelectors";

function PostList({ setToast, onView }) {
  const posts = useSelector(selectFilteredPosts);
  const selectedIds = useSelector((state) => state.modqueue.selectedIds);
  const dispatch = useDispatch();

  const [visibleCount, setVisibleCount] = useState(8);

  const fetchMore = () => {
    setTimeout(() => setVisibleCount((prev) => prev + 5), 800);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3">
      {/* Sticky toolbar with Select All */}
      <PostToolbar setToast={setToast} />

      {/* Infinite feed */}
      <InfiniteScroll
        dataLength={visibleCount}
        next={fetchMore}
        hasMore={visibleCount < posts.length}
        loader={<p className="text-gray-400 text-center py-4">Loading more...</p>}
        endMessage={<p className="text-center text-green-400 py-4">🎉 You reviewed all posts!</p>}
      >
        <div className="flex flex-col gap-4 mt-4">
          {posts.slice(0, visibleCount).map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-lg truncate">{post.title}</h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{post.content}</p>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    Reported by {post.user} • {post.reason}
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={selectedIds.includes(post.id)}
                  onChange={() =>
                    selectedIds.includes(post.id)
                      ? dispatch(deselect(post.id))
                      : dispatch(select(post.id))
                  }
                  className="w-5 h-5 accent-blue-500 cursor-pointer shrink-0"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    dispatch(approvePost(post.id));
                    setToast({ message: `✅ Approved "${post.title}"`, canUndo: true });
                  }}
                  className="px-3 py-1 bg-green-600 rounded hover:bg-green-700 text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    dispatch(rejectPost(post.id));
                    setToast({ message: `❌ Rejected "${post.title}"`, canUndo: true });
                  }}
                  className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-sm"
                >
                  Reject
                </button>
                <button
                  onClick={() => onView(post)}
                  className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default PostList;
