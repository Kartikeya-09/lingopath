"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { LessonDetail, AnswerResponse, CompleteResponse, Exercise } from '@/types/api';
import { useLessonSessionStore } from '@/stores/lessonSessionStore';
import { LessonHeader } from '@/components/lesson-player/LessonHeader';
import { MultipleChoiceExercise } from '@/components/lesson-player/MultipleChoiceExercise';
import { WordBankExercise } from '@/components/lesson-player/WordBankExercise';
import { TypeAnswerExercise } from '@/components/lesson-player/TypeAnswerExercise';
import { MatchPairsExercise } from '@/components/lesson-player/MatchPairsExercise';
import { FillBlankExercise } from '@/components/lesson-player/FillBlankExercise';
import { FeedbackPanel } from '@/components/lesson-player/FeedbackPanel';
import { OutOfHeartsModal } from '@/components/lesson-player/OutOfHeartsModal';
import { QuitConfirmModal } from '@/components/lesson-player/QuitConfirmModal';
import { CompletionScreen } from '@/components/lesson-player/CompletionScreen';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = Number(params.id);

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [hearts, setHearts] = useState(5);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [canCheck, setCanCheck] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [feedbackExplanation, setFeedbackExplanation] = useState<string | null>(null);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showOutOfHearts, setShowOutOfHearts] = useState(false);
  const [completionResult, setCompletionResult] = useState<CompleteResponse | null>(null);
  const [checking, setChecking] = useState(false);

  const startTimeRef = useRef(Date.now());
  const { currentExerciseIndex, errors, initSession, advanceExercise, recordError } = useLessonSessionStore();

  // Fetch lesson and stats on mount
  useEffect(() => {
    async function init() {
      try {
        const [lessonData, statsData] = await Promise.all([
          apiRequest<LessonDetail>(`/lessons/${lessonId}`),
          apiRequest<{ hearts: number }>('/stats'),
        ]);
        setLesson(lessonData);
        setHearts(statsData.hearts);
        initSession();
        await apiRequest(`/lessons/${lessonId}/start`, { method: 'POST' });
      } catch (e) {
        console.error('Failed to load lesson', e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [lessonId, initSession]);

  const currentExercise: Exercise | undefined = lesson?.exercises[currentExerciseIndex];
  const totalExercises = lesson?.exercises.length ?? 0;
  const progressPercent = totalExercises > 0 ? (currentExerciseIndex / totalExercises) * 100 : 0;

  const handleCheck = useCallback(async () => {
    if (!currentExercise || !currentAnswer.trim() || checking) return;
    setChecking(true);

    try {
      const result = await apiRequest<AnswerResponse>(`/lessons/${lessonId}/answer`, {
        method: 'POST',
        body: JSON.stringify({ exercise_id: currentExercise.id, answer: currentAnswer }),
      });

      if (result.correct) {
        setFeedbackStatus('correct');
        setFeedbackExplanation(result.explanation ?? null);
      } else {
        recordError();
        if (result.out_of_hearts) {
          setShowOutOfHearts(true);
        } else {
          setHearts(result.hearts_remaining ?? hearts);
          setFeedbackStatus('incorrect');
          setFeedbackExplanation(result.correct_answer ? `Correct answer: ${result.correct_answer}` : result.explanation ?? null);
        }
      }
    } catch (e) {
      console.error('Answer error', e);
    } finally {
      setChecking(false);
    }
  }, [currentExercise, currentAnswer, checking, lessonId, recordError, hearts]);

  const handleContinue = useCallback(async () => {
    setFeedbackStatus(null);
    setFeedbackExplanation(null);
    setCurrentAnswer('');
    setCanCheck(false);

    const nextIndex = currentExerciseIndex + 1;
    if (nextIndex >= totalExercises) {
      // Lesson complete
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      try {
        const result = await apiRequest<CompleteResponse>(`/lessons/${lessonId}/complete`, {
          method: 'POST',
          body: JSON.stringify({ errors, time_seconds: elapsed }),
        });
        setCompletionResult(result);
      } catch (e) {
        console.error('Complete error', e);
        router.push('/learn');
      }
    } else {
      advanceExercise();
    }
  }, [currentExerciseIndex, totalExercises, lessonId, errors, advanceExercise, router]);

  const handleSubmit = useCallback(() => {
    if (canCheck && !feedbackStatus) {
      handleCheck();
    }
  }, [canCheck, feedbackStatus, handleCheck]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-6 bg-[#111f24] text-[#f7f7f7]">
        <SkeletonLoader className="w-full max-w-[600px] h-6 rounded-full" />
        <SkeletonLoader className="w-3/4 max-w-[400px] h-10 rounded-xl mt-16" />
        <SkeletonLoader className="w-full max-w-[500px] h-16 rounded-xl" />
        <SkeletonLoader className="w-full max-w-[500px] h-16 rounded-xl" />
      </div>
    );
  }

  // Completion state
  if (completionResult) {
    return <CompletionScreen result={completionResult} />;
  }

  // No lesson found
  if (!lesson || !currentExercise) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[#111f24] text-[#f7f7f7]">
        <h2 className="text-2xl font-bold text-[#f7f7f7] mb-4">Lesson not found</h2>
        <button onClick={() => router.push('/learn')} className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold">
          Back to Learning
        </button>
      </div>
    );
  }

  const renderExercise = () => {
    switch (currentExercise.type) {
      case 'multiple_choice':
        return <MultipleChoiceExercise exercise={currentExercise} onAnswerSelected={setCurrentAnswer} onCanCheck={setCanCheck} />;
      case 'word_bank':
        return <WordBankExercise exercise={currentExercise} onAnswerSelected={setCurrentAnswer} onCanCheck={setCanCheck} />;
      case 'type_answer':
        return <TypeAnswerExercise exercise={currentExercise} onAnswerSelected={setCurrentAnswer} onCanCheck={setCanCheck} onSubmit={handleSubmit} />;
      case 'match_pairs':
        return <MatchPairsExercise exercise={currentExercise} onAnswerSelected={setCurrentAnswer} onCanCheck={setCanCheck} onSubmit={handleSubmit} />;
      case 'fill_blank':
        return <FillBlankExercise exercise={currentExercise} onAnswerSelected={setCurrentAnswer} onCanCheck={setCanCheck} onSubmit={handleSubmit} />;
      default:
        return <TypeAnswerExercise exercise={currentExercise} onAnswerSelected={setCurrentAnswer} onCanCheck={setCanCheck} onSubmit={handleSubmit} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#111f24] text-[#f7f7f7]">
      <LessonHeader progressPercent={progressPercent} hearts={hearts} onQuit={() => setShowQuitModal(true)} />

      <div className="exercise-enter flex-1" key={currentExerciseIndex}>
        {renderExercise()}
      </div>

      {!feedbackStatus && (
        <div className="sticky bottom-0 border-t border-[#34454d] bg-[#111f24] p-4">
          <div className="mx-auto max-w-[700px]">
            <button
              onClick={handleCheck}
              disabled={!canCheck || checking}
              className={`w-full rounded-[22px] py-4 text-xl font-extrabold transition-all ${
                canCheck
                  ? 'border-b-4 border-green-700 bg-green-500 text-white hover:bg-green-600 active:mt-1 active:border-b-0'
                  : 'cursor-not-allowed border-b-4 border-[#37464e] bg-[#37464e] text-[#7f8c92]'
              }`}
            >
              {checking ? 'CHECKING...' : 'CHECK'}
            </button>
          </div>
        </div>
      )}

      <FeedbackPanel status={feedbackStatus} explanation={feedbackExplanation} onContinue={handleContinue} />

      {showQuitModal && (
        <QuitConfirmModal onConfirm={() => router.push('/learn')} onCancel={() => setShowQuitModal(false)} />
      )}

      {showOutOfHearts && <OutOfHeartsModal />}
    </div>
  );
}
