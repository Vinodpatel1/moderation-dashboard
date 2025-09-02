import { useDispatch, useSelector } from "react-redux";
import { setStatusFilter } from "../modqueueSlice";
import { selectCountsByStatus } from "../modqueueSelectors";

function StatusTabs({ onPendingEmpty }) {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.modqueue.statusFilter);
  const counts = useSelector(selectCountsByStatus);

  const tabs = [
    { key: "pending", label: "Pending", color: "bg-yellow-600" },
    { key: "approved", label: "Approved", color: "bg-green-600" },
    { key: "rejected", label: "Rejected", color: "bg-red-600" },
    { key: "all", label: "All", color: "bg-gray-600" },
  ];

  const handleTabClick = (key) => {
    dispatch(setStatusFilter(key));
    if (key === "pending" && counts.pending === 0) {
      onPendingEmpty?.(); // trigger popup if no pending
    }
  };

  return (
  <div className="overflow-x-auto scrollbar-hide -mx-2 mb-4">
    <div className="flex space-x-3 px-2 min-w-max">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => handleTabClick(tab.key)}
          className={`px-3 py-1 rounded text-white text-sm flex items-center space-x-2 whitespace-nowrap ${
            filter === tab.key ? tab.color : "bg-gray-700"
          }`}
        >
          <span>{tab.label}</span>
          <span className="bg-black bg-opacity-30 px-2 rounded">
            {tab.key === "all"
              ? counts.pending + counts.approved + counts.rejected
              : counts[tab.key]}
          </span>
        </button>
      ))}
    </div>
  </div>
);

}

export default StatusTabs;
