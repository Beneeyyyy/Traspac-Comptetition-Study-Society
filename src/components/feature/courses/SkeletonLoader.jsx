import { motion } from 'framer-motion';

const SkeletonLoader = ({ duration = 0.8 }) => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Title Skeleton */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration * 0.5 }}
        className="mb-16 text-center"
      >
        <div className="h-4 w-32 bg-white/[0.05] rounded mx-auto mb-2 animate-pulse" />
        <div className="h-8 w-64 bg-white/[0.07] rounded mx-auto animate-pulse" />
      </motion.div>

      {/* Top Learners Skeleton */}
      <div className="flex flex-col md:flex-row justify-center items-end gap-6 md:gap-12">
        {/* Second Place */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: duration * 0.7, delay: duration * 0.1 }}
          className="w-full md:w-72 md:translate-y-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-transparent rounded-lg" />
            <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/[0.07] animate-pulse" />
                <div className="flex-1">
                  <div className="h-5 w-32 bg-white/[0.07] rounded mb-2 animate-pulse" />
                  <div className="h-4 w-20 bg-white/[0.05] rounded animate-pulse" />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Champion */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration * 0.7, delay: duration * 0.2 }}
          className="w-full md:w-80"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-blue-500/10 to-transparent rounded-lg" />
            <div className="relative bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-white/[0.07] animate-pulse" />
                <div className="flex-1">
                  <div className="h-6 w-40 bg-white/[0.07] rounded mb-2 animate-pulse" />
                  <div className="h-5 w-24 bg-white/[0.05] rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                    <div className="h-full w-[90%] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-white/[0.05] rounded animate-pulse" />
                  <div className="h-4 w-16 bg-white/[0.05] rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Third Place */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: duration * 0.7, delay: duration * 0.1 }}
          className="w-full md:w-72 md:translate-y-12"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-transparent rounded-lg" />
            <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/[0.07] animate-pulse" />
                <div className="flex-1">
                  <div className="h-5 w-32 bg-white/[0.07] rounded mb-2 animate-pulse" />
                  <div className="h-4 w-20 bg-white/[0.05] rounded animate-pulse" />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SkeletonLoader; 