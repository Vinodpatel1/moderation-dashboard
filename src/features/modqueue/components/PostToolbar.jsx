import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { approvePosts, rejectPosts, clearSelection } from "../modqueueSlice";

export default function PostToolbar({ setToast }) {
  const dispatch = useDispatch();
  const selectedIds = useSelector((state) => state.modqueue.selectedIds);

  const handleApproveSelected = () => {
    if (selectedIds.length === 0) return;
    dispatch(approvePosts(selectedIds));
    setToast({ message: `✅ Approved ${selectedIds.length} post(s)`, canUndo: true });
  };

  const handleRejectSelected = () => {
    if (selectedIds.length === 0) return;
    const ok = window.confirm(
      `Are you sure you want to reject ${selectedIds.length} post(s)?`
    );
    if (!ok) return;
    dispatch(rejectPosts(selectedIds));
    setToast({ message: `❌ Rejected ${selectedIds.length} post(s)`, canUndo: true });
  };

  const handleClear = () => {
    dispatch(clearSelection());
  };

  return (
    <div className="sticky top-[110px] z-30 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4 py-2 shadow-md">
      {/* Left: count */}
      <div className="text-sm text-gray-300">
        Selected: <span className="font-semibold text-white">{selectedIds.length}</span>
      </div>

      {/* Right: buttons */}
      <div className="space-x-2">
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
