import { useEffect } from "react";

function MotivationPopup({ onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // auto close after 5s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="relative bg-green-700 text-white p-6 rounded-2xl shadow-xl text-center animate-bounce">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-lg hover:text-gray-200"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-2">🎉 Congratulations! 🎉</h2>
        <p className="text-lg">All posts have been reviewed 👏</p>
        <p className="text-sm mt-2">Keep up the great work 💪🚀</p>
      </div>
    </div>
  );
}

export default MotivationPopup;
