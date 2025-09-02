import { useState } from "react";
import Modal from "../../../ui/Modal";
import { useDispatch } from "react-redux";
import { approvePost, rejectPost } from "../modqueueSlice";

function ContentModal({ post, isOpen, onClose, setToast }) {
  const [activeImage, setActiveImage] = useState(null);
  const dispatch = useDispatch();

  if (!post) return null;

  const handleApprove = () => {
    dispatch(approvePost(post.id));
    setToast({ message: `✅ Post "${post.title}" approved`, canUndo: true });
    onClose();
  };

  const handleReject = () => {
    dispatch(rejectPost(post.id));
    setToast({ message: `❌ Post "${post.title}" rejected`, canUndo: true });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-gray-900 text-white rounded-3xl p-6 shadow-2xl w-full max-w-4xl mx-auto">
        {/* Post Header */}
        <h2 className="text-3xl font-bold mb-2 text-gray-100">{post.title}</h2>
        <p className="text-gray-400 mb-1">
          Reported by:{" "}
          <span className="font-semibold text-gray-200">{post.author.username}</span>
        </p>
        <p className="text-gray-500 text-sm mb-4">
          Reason: {post.reportedReason} | Reported At:{" "}
          {new Date(post.reportedAt).toLocaleString()}
        </p>

        {/* Post Content */}
        <p className="text-gray-200 mb-6">{post.content}</p>

        {/* Image Gallery */}
        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {post.images.map((img, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl cursor-pointer shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => setActiveImage(img)}
              >
                <img
                  src={img}
                  alt={`Post Image ${i + 1}`}
                  className="w-full h-52 sm:h-40 md:h-48 object-cover transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white font-semibold text-lg">
                  View
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <button
            onClick={handleApprove}
            disabled={post.status !== "pending"}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            disabled={post.status !== "pending"}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-xl text-white font-semibold transition-all duration-200"
          >
            Close
          </button>
        </div>

        {/* Fullscreen Image Modal */}
        {activeImage && (
          <Modal isOpen={!!activeImage} onClose={() => setActiveImage(null)}>
            <div className="flex items-center justify-center p-4">
              <img
                src={activeImage}
                alt="Full view"
                className="max-h-[90vh] max-w-full object-contain rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-105"
              />
            </div>
          </Modal>
        )}
      </div>
    </Modal>
  );
}

export default ContentModal;
