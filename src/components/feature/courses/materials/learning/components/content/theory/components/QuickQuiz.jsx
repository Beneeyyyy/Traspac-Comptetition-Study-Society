import { RiQuestionLine } from 'react-icons/ri';

const QuickQuiz = ({ quiz }) => {
  if (!quiz) return null;

  return (
    <div className="bg-gradient-to-br from-black/40 to-black/20 border border-white/[0.05] rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
          <RiQuestionLine className="w-3 h-3 text-purple-400" />
        </div>
        <h3 className="text-sm font-medium text-white/80">Quick Quiz</h3>
      </div>
      <p className="text-xs text-white/70 mb-3">{quiz.question}</p>
      <div className="grid grid-cols-1 gap-2">
        {quiz.options.map((option, index) => (
          <button
            key={index}
            className="p-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] rounded-lg text-xs text-white/60 hover:text-white transition-all text-left"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickQuiz; 