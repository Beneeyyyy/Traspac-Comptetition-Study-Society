import { FiSettings, FiEdit3 } from 'react-icons/fi';

const QuickActions = ({ onShowFeatures, onShowNotes, isDisabled }) => {
  return (
    <div className="fixed right-6 top-[200px] flex flex-col gap-2 z-50">
      <button
        onClick={onShowFeatures}
        disabled={isDisabled}
        className="p-2.5 bg-white/[0.02] border border-white/[0.05] rounded-lg hover:bg-white/[0.05] disabled:opacity-50 disabled:hover:bg-white/[0.02] transition-colors shadow-lg backdrop-blur-sm group relative"
        title="Fitur Pembelajaran"
      >
        <FiSettings className="w-5 h-5 text-white" />
        {/* Tooltip */}
        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/10 backdrop-blur-md rounded text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Fitur Pembelajaran
        </div>
      </button>

      <button
        onClick={onShowNotes}
        disabled={isDisabled}
        className="p-2.5 bg-white/[0.02] border border-white/[0.05] rounded-lg hover:bg-white/[0.05] disabled:opacity-50 disabled:hover:bg-white/[0.02] transition-colors shadow-lg backdrop-blur-sm group relative"
        title="Catatan"
      >
        <FiEdit3 className="w-5 h-5 text-white" />
        {/* Tooltip */}
        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/10 backdrop-blur-md rounded text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Catatan
        </div>
      </button>
    </div>
  );
};

export default QuickActions; 