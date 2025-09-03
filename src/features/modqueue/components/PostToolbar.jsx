import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  approvePosts,
  rejectPosts,
  clearSelection,
  selectAll,
} from "../modqueueSlice";
import { selectFilteredPosts } from "../modqueueSelectors";

export default function PostToolbar({ setToast }) {
  const dispatch = useDispatch();
  const posts = useSelector(selectFilteredPosts);
  const selectedIds = useSelector((state) => state.modqueue.selectedIds);

  // Get pending posts
  const pendingIds = posts.filter((p) => p.status === "pending").map((p) => p.id);

  const allPendingSelected =
    pendingIds.length > 0 && pendingIds.every((id) => selectedIds.includes(id));
  const someSelected =
    selectedIds.length > 0 && !allPendingSelected && pendingIds.length > 0;

  const handleHeaderCheckbox = () => {
    if (allPendingSelected) dispatch(clearSelection());
    else dispatch(selectAll(pendingIds));
  };

  const handleApproveSelected = () => {
    if (selectedIds.length === 0) return;
    dispatch(approvePosts(selectedIds));
    setToast({
      message: `✅ Approved ${selectedIds.length} post(s)`,
      canUndo: true,
    });
  };

  const handleRejectSelected = () => {
    if (selectedIds.length === 0) return;
    const ok = window.confirm(
      `Are you sure you want to reject ${selectedIds.length} post(s)?`
    );
    if (!ok) return;
    dispatch(rejectPosts(selectedIds));
    setToast({
      message: `❌ Rejected ${selectedIds.length} post(s)`,
      canUndo: true,
    });
  };

  const handleClear = () => {
    dispatch(clearSelection());
  };

  return (
    <div className="sticky top-[120px] z-40 
    bg-gray-900 border-b border-gray-700 flex flex-wrap items-center justify-between gap-2 px-4 py-2 shadow-md">
      {/* ✅ Left side: Select All */}
      <div className="flex items-center gap-2 text-sm text-gray-300">
        {pendingIds.length > 0 && (
          <>
            <input
              type="checkbox"
              // ref={(el) => {
              //   if (el) el.indeterminate = someSelected;
              // }}
              checked={allPendingSelected}
              onChange={handleHeaderCheckbox}
              className="w-5 h-5 accent-blue-500 cursor-pointer"
            />
            <span>
              Select all pending posts ({selectedIds.length})
            </span>
          </>
        )}
      </div>

      {/* ✅ Right side: Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleApproveSelected}
          disabled={selectedIds.length === 0}
          className="px-3 py-1 bg-green-700 rounded text-white text-sm disabled:opacity-40"
        >
          Approve Selected
        </button>

        <button
          onClick={handleRejectSelected}
          disabled={selectedIds.length === 0}
          className="px-3 py-1 bg-red-700 rounded text-white text-sm disabled:opacity-40"
        >
          Reject Selected
        </button>

        <button
          onClick={handleClear}
          disabled={selectedIds.length === 0}
          className="px-3 py-1 bg-gray-700 rounded text-white text-sm disabled:opacity-40"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
