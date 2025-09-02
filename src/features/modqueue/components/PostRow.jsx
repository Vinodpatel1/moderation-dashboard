import { useDispatch } from "react-redux";
import { toggleSelect, approvePost, rejectPost } from "../modqueueSlice";

function PostRow({ post, isSelected, setToast, onView, rowIndex, isMobile }) {
  const dispatch = useDispatch();

  const handleApprove = () => {
    dispatch(approvePost(post.id));
    setToast({ message: `✅ Post "${post.title}" approved`, canUndo: true });
    
  };

  const handleReject = () => {
    dispatch(rejectPost(post.id));
    setToast({ message: `❌ Post "${post.title}" rejected`, canUndo: true });
  };

  // Card layout for mobile
  if (isMobile) {
    return (
      <div
        className={`bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-md flex flex-col gap-2 ${
          rowIndex % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">{post.title}</h2>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => dispatch(toggleSelect(post.id))}
            className="w-5 h-5 accent-blue-500 cursor-pointer"
            disabled={post.status !== "pending"}
          />
        </div>
        <p className="text-gray-300 text-sm">User: {post.author.username}</p>
        <p className="text-red-400 text-sm">Reason: {post.reportedReason}</p>
        <p className="text-gray-400 text-sm">
          Reported At: {new Date(post.reportedAt).toLocaleString()}
        </p>
        <span
          className={`inline-block px-2 py-1 rounded text-sm font-semibold ${
            post.status === "pending"
              ? "bg-yellow-500 text-gray-900"
              : post.status === "approved"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {post.status}
        </span>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={handleApprove}
            disabled={post.status !== "pending"}
            className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white text-sm font-medium transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            disabled={post.status !== "pending"}
            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm font-medium transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject
          </button>
          <button
            onClick={() => onView(post)}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium transition-transform duration-200 hover:scale-105"
          >
            View
          </button>
        </div>
      </div>
    );
  }

  // Default table row for md+
  return (
    <tr
      className={`border-b border-gray-700 transition-colors duration-200 ${
        rowIndex % 2 === 0 ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-900 hover:bg-gray-800"
      }`}
    >
      <td className="p-3 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => dispatch(toggleSelect(post.id))}
          className="w-5 h-5 accent-blue-500 cursor-pointer"
        />
      </td>
      <td className="p-3 font-medium text-gray-100">{post.title}</td>
      <td className="p-3 text-gray-300">{post.author.username}</td>
      <td className="p-3 text-red-400">{post.reportedReason}</td>
      <td className="p-3 text-gray-400 text-sm">
        {new Date(post.reportedAt).toLocaleString()}
      </td>
      <td className="p-3">
        <span
          className={`px-2 py-1 rounded text-sm font-semibold ${
            post.status === "pending"
              ? "bg-yellow-500 text-gray-900"
              : post.status === "approved"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {post.status}
        </span>
      </td>
      <td className="p-3 flex flex-wrap gap-2">
        <button
          onClick={handleApprove}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-white text-sm font-medium transition-transform duration-200 hover:scale-105"
          disabled={post.status !== "pending"}
        >
          Approve
        </button>
        <button
          onClick={handleReject}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm font-medium transition-transform duration-200 hover:scale-105"
          disabled={post.status !== "pending"}
        >
          Reject
        </button>
        <button
          onClick={() => onView(post)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium transition-transform duration-200 hover:scale-105"
        >
          View
        </button>
      </td>
    </tr>
  );
}

export default PostRow;
