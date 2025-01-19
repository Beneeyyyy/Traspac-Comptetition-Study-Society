import { Link, useParams } from 'react-router-dom';
import { FiBook, FiClock, FiUsers } from 'react-icons/fi';

const MaterialCard = ({ material }) => {
  const { squadId } = useParams();

  return (
    <Link 
      to={`/squads/${squadId}/materials/${material.id}`}
      className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 transition-all duration-200 group"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center flex-shrink-0">
          <FiBook className="w-6 h-6 text-blue-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors mb-1 truncate">
            {material.title}
          </h3>
          <p className="text-sm text-white/60 line-clamp-2 mb-4">
            {material.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-white/40">
            <div className="flex items-center gap-1">
              <FiClock className="w-4 h-4" />
              <span>{material.estimated_time} min</span>
            </div>
            <div className="flex items-center gap-1">
              <FiUsers className="w-4 h-4" />
              <span>{material.learnerCount || 0} learners</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MaterialCard; 