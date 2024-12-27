import { RiLightbulbLine } from 'react-icons/ri';

const QuickTips = ({ tips }) => {
  return (
    <div className="bg-gradient-to-br from-black/40 to-black/20 border border-white/[0.05] rounded-xl p-4 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 flex items-center justify-center">
          <RiLightbulbLine className="w-3 h-3 text-yellow-400" />
        </div>
        <h3 className="text-sm font-medium text-white/80">Quick Tips</h3>
      </div>
      <ul className="space-y-2">
        {tips?.map((tip, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-white/60 hover:text-white/80 transition-all duration-200 cursor-pointer group"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-500/10 to-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform mt-0.5">
              <span className="text-[10px] text-yellow-400">{index + 1}</span>
            </div>
            <span className="text-xs">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickTips; 