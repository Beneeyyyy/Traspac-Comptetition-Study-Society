import { FiX, FiChevronRight } from 'react-icons/fi';

const MaterialNavSidebar = ({ show, onClose, materialSections }) => {
  if (!show) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        style={{ pointerEvents: 'auto' }}
      />
      <div
        className="fixed left-0 top-0 h-full w-96 bg-[#0A0A0B] border-r border-white/[0.05] z-50 overflow-y-auto transition-transform duration-300"
        style={{ 
          pointerEvents: 'auto',
          transform: show ? 'translateX(0)' : 'translateX(-100%)'
        }}
      >
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Daftar Materi</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/[0.05]"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {materialSections.map((section) => (
              <div
                key={section.id}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{section.title}</h3>
                  <FiChevronRight className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                </div>
                <p className="mt-2 text-sm text-white/60">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MaterialNavSidebar; 