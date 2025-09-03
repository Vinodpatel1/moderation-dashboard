import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import {
  undoLast,
  approvePost,
  rejectPost,
} from "./features/modqueue/modqueueSlice";
import { selectCountsByStatus } from "./features/modqueue/modqueueSelectors";
import PostList from "./features/modqueue/components/PostList";
import ContentModal from "./features/modqueue/components/ContentModal";
import StatusTabs from "./features/modqueue/components/StatusTabs";
import Toast from "./ui/Toast";
import MotivationPopup from "./ui/MotivationPopup";

function App() {
  const [toast, setToast] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const selectedIds = useSelector((state) => state.modqueue.selectedIds);
  const dispatch = useDispatch();
  const counts = useSelector(selectCountsByStatus);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.key === "Escape") setSelectedPost(null);

      if (e.ctrlKey && e.key.toLowerCase() === "z") {
        dispatch(undoLast());
        setToast({ message: "↩️ Undid last action", canUndo: true });
        return;
      }

      if (selectedPost) {
        if (e.key.toLowerCase() === "a") {
          dispatch(approvePost(selectedPost.id));
          setToast({
            message: `✅ Post "${selectedPost.title}" approved (via keyboard)`,
            canUndo: true,
          });
          setSelectedPost(null);
        }
        if (e.key.toLowerCase() === "r") {
          dispatch(rejectPost(selectedPost.id));
          setToast({
            message: `❌ Post "${selectedPost.title}" rejected (via keyboard)`,
            canUndo: true,
          });
          setSelectedPost(null);
        }
        return;
      }

      if (selectedIds.length > 0) {
        if (e.key.toLowerCase() === "a") {
          dispatch(approvePosts(selectedIds));
          setToast({
            message: `✅ Approved ${selectedIds.length} post(s) (via keyboard)`,
            canUndo: true,
          });
        }
        if (e.key.toLowerCase() === "r") {
          dispatch(rejectPosts(selectedIds));
          setToast({
            message: `❌ Rejected ${selectedIds.length} post(s) (via keyboard)`,
            canUndo: true,
          });
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dispatch, selectedPost, selectedIds]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900 shadow-md">
        <div className="bg-gray-900 max-w-6xl mx-auto px-4 py-3 flex justify-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative text-3xl md:text-5xl font-extrabold text-center 
                 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 
                 bg-clip-text text-transparent drop-shadow-lg tracking-wide"
          >
            🚀 Moderation Dashboard
            <span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent 
                   animate-[shimmer_2.5s_infinite] bg-[length:200%_100%]"
            ></span>
          </motion.h1>
        </div>
        <div className="bg-gray-900 px-4 py-2 border-t border-gray-700 flex justify-center">
          <StatusTabs onPendingEmpty={() => setShowCongrats(true)} />
        </div>
      </header>

      {/* Main feed */}
      <main className="flex-1 max-w-3xl mx-auto p-4">
        <PostList setToast={setToast} onView={(post) => setSelectedPost(post)} />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 text-gray-400 text-center py-4 mt-auto">
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>

      {/* Floating UI */}
      <ContentModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        setToast={setToast}
      />

      {toast && (
        <Toast
          message={toast.message}
          onClose={() => setToast(null)}
          onUndo={toast.canUndo ? () => dispatch(undoLast()) : null}
        />
      )}

      {showCongrats && <MotivationPopup onClose={() => setShowCongrats(false)} />}
    </div>
  );
}

export default App;
