import { useState } from 'react';
import { RiQuestionLine, RiCheckLine, RiCloseLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

export function QuickQuiz({ quiz }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const isCorrect = selectedAnswer === quiz.correct;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
          <RiQuestionLine className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white/90">Quick Quiz</h2>
          <p className="text-sm text-white/60">Uji pemahamanmu</p>
        </div>
      </div>

      {/* Question */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-white/5">
        <p className="text-sm text-white/90">{quiz?.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {quiz?.options?.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectAnswer = quiz.correct === index;
          
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !showResult && handleAnswer(index)}
              disabled={showResult}
              className={`
                w-full p-3 rounded-xl border transition-all duration-200 group relative
                ${showResult 
                  ? isCorrectAnswer
                    ? 'bg-green-500/10 border-green-500/20'
                    : isSelected
                      ? 'bg-red-500/10 border-red-500/20'
                      : 'bg-white/5 border-white/5 opacity-50'
                  : 'hover:border-white/10 hover:bg-white/5 border-white/5'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className={`
                  text-sm transition-colors
                  ${showResult
                    ? isCorrectAnswer
                      ? 'text-green-400'
                      : isSelected
                        ? 'text-red-400'
                        : 'text-white/60'
                    : 'text-white/70 group-hover:text-white/90'
                  }
                `}>
                  {option}
                </span>

                {showResult && (isSelected || isCorrectAnswer) && (
                  <div className={`
                    w-6 h-6 rounded-lg flex items-center justify-center
                    ${isCorrectAnswer ? 'bg-green-500/20' : 'bg-red-500/20'}
                  `}>
                    {isCorrectAnswer ? (
                      <RiCheckLine className="w-4 h-4 text-green-400" />
                    ) : (
                      <RiCloseLine className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Result Message */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            p-3 rounded-xl border text-center
            ${isCorrect 
              ? 'bg-green-500/5 border-green-500/20' 
              : 'bg-red-500/5 border-red-500/20'
            }
          `}
        >
          <p className={`
            text-sm font-medium
            ${isCorrect ? 'text-green-400' : 'text-red-400'}
          `}>
            {isCorrect 
              ? '🎉 Jawaban benar! Keren!' 
              : '😅 Ups, coba lagi ya!'}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// Re-export for backward compatibility
export default QuickQuiz; 