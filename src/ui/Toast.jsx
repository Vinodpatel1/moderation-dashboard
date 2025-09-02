import { useEffect } from "react";

function Toast({ message, onClose, onUndo }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="
        fixed z-50
        bottom-4 right-4
        w-[90%] sm:w-auto
        max-w-sm
        px-4 py-3
        bg-gray-900 text-white
        rounded-xl shadow-lg
        animate-slide-up
        flex flex-col sm:flex-row items-center justify-between gap-2
      "
    >
      {/* Message */}
      <span className="text-sm font-medium">{message}</span>

      <div className="flex items-center gap-3">
        {/* Undo button */}
        {onUndo && (
          <button
            onClick={() => {
              onUndo();
              onClose();
            }}
            className="text-blue-400 hover:text-blue-300 font-semibold text-sm"
          >
            Undo
          </button>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-lg leading-none"
        >
          ✖
        </button>
      </div>
    </div>
  );
}

export default Toast;
