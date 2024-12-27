import { FiSettings, FiEdit3 } from 'react-icons/fi';

const QuickActions = ({ onShowFeatures, onShowNotes, isDisabled }) => {
  return (
    <div className="fixed right-6 top-[200px] flex flex-col gap-2 z-50">
      <button
        onClick={onShowFeatures}
        disabled={isDisabled}
        className="p-2.5 bg-white/[0.02] border border-white/[0.05] rounded-lg hover:bg-white/[0.05] disabled:opacity-50 disabled:hover:bg-white/[0.02] transition-colors shadow-lg backdrop-blur-sm"
        title="Fitur Pembelajaran"
      >
        <FiSettings className="w-5 h-5 text-white" />
      </button>

      <button
        onClick={onShowNotes}
        disabled={isDisabled}
        className="p-2.5 bg-white/[0.02] border border-white/[0.05] rounded-lg hover:bg-white/[0.05] disabled:opacity-50 disabled:hover:bg-white/[0.02] transition-colors shadow-lg backdrop-blur-sm"
        title="Catatan"
      >
        <FiEdit3 className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default QuickActions; 