import React from 'react'
import ScoreGauge from './ScoreGauge'
import ScoreBadge from './ScoreBadge';

const Category = ({ title, score }: { title: string; score: number }) => {

    const textColor = score >= 80 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="resume-summary">
            <div className="category">
                <div className='flex flex-row gap-2 items-center'>
                    <p className='text-2xl'>{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className='text-2xl'><span className={textColor}>{score}</span>/100</p>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback | null }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      <div className="flex flex-row items-center p-4 gap-8">
        <ScoreGauge score={feedback?.overallScore ?? 0} />
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-bold">Your Resume Score</div>
          <p className="text-sm text-gray-500">
            This score is calculated based on the variaables listed below.
          </p>
        </div>
      </div>

      <Category
        title="Tone & Style"
        score={feedback?.toneAndStyle.score ?? 0}
      />
      <Category title="Content" score={feedback?.content.score ?? 0} />
      <Category title="Structure" score={feedback?.structure.score ?? 0} />
      <Category
        title="Skills"
        score={feedback?.skills.score ?? 0}
      />
    </div>
  );
}

export default Summary
