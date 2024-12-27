import { RiLightbulbLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

export function QuickTips({ tips }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center pt-8 gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 flex items-center justify-center">
          <RiLightbulbLine className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white/90">Quick Tips</h2>
          <p className="text-sm text-white/60">Tips berguna untuk kamu</p>
        </div>
      </div>

      {/* Tips List */}
      <div className="space-y-3">
        {tips?.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border border-white/5 hover:border-white/10 transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-yellow-400">{index + 1}</span>
              </div>
              <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                {tip}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Re-export for backward compatibility
export default QuickTips; 