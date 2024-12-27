import { FiPlay } from 'react-icons/fi';

const InteractiveDemo = ({ demoId }) => {
  // Placeholder untuk demo interaktif
  // Nantinya bisa diintegrasikan dengan GeoGebra atau library visualisasi matematika lainnya
  return (
    <div
      className="aspect-video rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.05] relative transition-opacity duration-300"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
          <FiPlay className="w-8 h-8 text-white/40" />
        </div>
        <p className="text-white/40 text-sm">Demo Interaktif akan segera hadir</p>
      </div>
    </div>
  );
};

export default InteractiveDemo; 