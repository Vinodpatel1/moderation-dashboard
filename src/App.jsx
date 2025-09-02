import { useEffect, useState } from "react";
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

  const dispatch = useDispatch();
  const counts = useSelector(selectCountsByStatus);

  // ✅ Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSelectedPost(null);

      if (e.ctrlKey && e.key === "z") {
        dispatch(undoLast());
        setToast({ message: "↩️ Undid last action", canUndo: true });
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
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dispatch, selectedPost]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Combined Header + Tabs (single sticky block) */}
<header className="sticky top-0 z-50 bg-gray-800 shadow-md">
  <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
    <h1 className="text-xl font-bold">🚦 Moderation Dashboard</h1>
  </div>
  <div className="bg-gray-900 px-4 py-2 border-t border-gray-700">
    <StatusTabs onPendingEmpty={() => setShowCongrats(true)} />
  </div>
</header>


      {/* Feed (scrolls like Twitter/Instagram) */}
      <main className="max-w-3xl mx-auto p-4">
        <PostList setToast={setToast} onView={(post) => setSelectedPost(post)} />
      </main>

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
