import { motion } from 'framer-motion'

const regions = [
  { id: 'jakarta', name: 'DKI Jakarta', province: 'DKI Jakarta' },
  { id: 'jabar', name: 'Jawa Barat', province: 'Jawa Barat' },
  { id: 'jatim', name: 'Jawa Timur', province: 'Jawa Timur' },
  { id: 'jogja', name: 'DI Yogyakarta', province: 'DI Yogyakarta' },
  { id: 'jateng', name: 'Jawa Tengah', province: 'Jawa Tengah' },
  { id: 'sumut', name: 'Sumatera Utara', province: 'Sumatera Utara' },
  { id: 'sumsel', name: 'Sumatera Selatan', province: 'Sumatera Selatan' }
];

export default function RegionCards({ onRegionSelect }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12"
    >
      {regions.map((region, index) => (
        <motion.div
          key={region.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          onClick={() => onRegionSelect(region.province)}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent rounded-lg" />
          <div className="absolute top-0 left-0 w-[2px] h-12 bg-blue-500/50" />
          <div className="absolute top-0 left-0 w-12 h-[2px] bg-blue-500/50" />
          
          <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-blue-500/30 transition-colors">
            <h3 className="text-xl font-medium text-white/90 mb-2">{region.name}</h3>
            <p className="text-sm text-white/60">View top learners in {region.name}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
} 