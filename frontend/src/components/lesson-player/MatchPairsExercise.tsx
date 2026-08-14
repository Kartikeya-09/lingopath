import React, { useEffect, useMemo, useState } from "react";
import { Exercise } from "@/types/api";

interface MatchPairsExerciseProps {
  exercise: Exercise;
  onAnswerSelected: (answer: string) => void;
  onCanCheck: (canCheck: boolean) => void;
  onSubmit: () => void;
}

interface PairItem {
  pairId: number;
  text: string;
}

function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[i],
    ];
  }

  return shuffled;
}

export function MatchPairsExercise({
  exercise,
  onAnswerSelected,
  onCanCheck,
}: MatchPairsExerciseProps) {
  /*
   * Backend currently sends match-pair options like:
   *
   * 0 -> hello
   * 1 -> hola
   * 2 -> goodbye
   * 3 -> adiós
   * 4 -> thank you
   * 5 -> gracias
   *
   * Therefore each consecutive 2 options form one pair.
   */
  const pairData = useMemo(() => {
    const options = exercise.exercise_options ?? [];

    if (options.length < 2 || options.length % 2 !== 0) {
      return null;
    }

    const left: PairItem[] = [];
    const right: PairItem[] = [];

    for (let index = 0; index < options.length; index += 2) {
      const pairId = index / 2;

      left.push({
        pairId,
        text: options[index].text,
      });

      right.push({
        pairId,
        text: options[index + 1].text,
      });
    }

    return {
      left,
      right,
    };
  }, [exercise]);

  const [rightCards, setRightCards] = useState<PairItem[]>([]);

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);

  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(
    new Set()
  );

  const [showIncorrect, setShowIncorrect] = useState(false);

  /*
   * Reset the exercise whenever a new exercise arrives.
   */
  useEffect(() => {
    if (pairData) {
      setRightCards(shuffleArray(pairData.right));
    } else {
      setRightCards([]);
    }

    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs(new Set());
    setShowIncorrect(false);

    onAnswerSelected("");
    onCanCheck(false);
  }, [exercise.id, pairData, onAnswerSelected, onCanCheck]);

  /*
   * Compare selected left/right cards.
   */
  useEffect(() => {
    if (
      selectedLeft === null ||
      selectedRight === null ||
      !pairData
    ) {
      return;
    }

    // CORRECT MATCH
    if (selectedLeft === selectedRight) {
      const updatedMatchedPairs = new Set(matchedPairs);

      updatedMatchedPairs.add(selectedLeft);

      setMatchedPairs(updatedMatchedPairs);

      setSelectedLeft(null);
      setSelectedRight(null);
      setShowIncorrect(false);

      /*
       * All pairs completed.
       */
      if (updatedMatchedPairs.size === pairData.left.length) {
        onAnswerSelected("matched");
        onCanCheck(true);
      }

      return;
    }

    // INCORRECT MATCH
    setShowIncorrect(true);

    const timeout = window.setTimeout(() => {
      setSelectedLeft(null);
      setSelectedRight(null);
      setShowIncorrect(false);
    }, 600);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    selectedLeft,
    selectedRight,
    pairData,
    matchedPairs,
    onAnswerSelected,
    onCanCheck,
  ]);

  /*
   * Invalid/malformed data should not leave a blank lesson.
   */
  if (!pairData) {
    return (
      <div className="mx-auto flex h-full w-full max-w-[680px] flex-col px-4 pt-8">
        <h2 className="mb-8 text-[28px] font-extrabold text-[#f7f7f7]">
          {exercise.prompt || "Tap the matching pairs"}
        </h2>

        <div className="rounded-xl border-2 border-[#536871] p-4 text-[#f7f7f7]">
          This matching exercise could not be loaded.
        </div>
      </div>
    );
  }

  const getLeftCardStyle = (pairId: number) => {
    if (matchedPairs.has(pairId)) {
      return `
        border-[#58cc02]
        bg-[rgba(88,204,2,0.12)]
        text-[#b8ff87]
        opacity-60
      `;
    }

    if (showIncorrect && selectedLeft === pairId) {
      return `
        border-[#ff4b4b]
        bg-[rgba(255,75,75,0.12)]
        text-[#ffd1d1]
      `;
    }

    if (selectedLeft === pairId) {
      return `
        border-[#1cb0f6]
        bg-[rgba(28,176,246,0.12)]
        text-[#f7f7f7]
      `;
    }

    return `
      border-[#3f535d]
      bg-transparent
      text-[#f7f7f7]
      hover:bg-[rgba(255,255,255,0.04)]
    `;
  };

  const getRightCardStyle = (pairId: number) => {
    if (matchedPairs.has(pairId)) {
      return `
        border-[#58cc02]
        bg-[rgba(88,204,2,0.12)]
        text-[#b8ff87]
        opacity-60
      `;
    }

    if (showIncorrect && selectedRight === pairId) {
      return `
        border-[#ff4b4b]
        bg-[rgba(255,75,75,0.12)]
        text-[#ffd1d1]
      `;
    }

    if (selectedRight === pairId) {
      return `
        border-[#1cb0f6]
        bg-[rgba(28,176,246,0.12)]
        text-[#f7f7f7]
      `;
    }

    return `
      border-[#3f535d]
      bg-transparent
      text-[#f7f7f7]
      hover:bg-[rgba(255,255,255,0.04)]
    `;
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[680px] flex-col px-4 pt-8">
      <h2 className="mb-8 text-[28px] font-extrabold text-[#f7f7f7]">
        {exercise.prompt || "Tap the matching pairs"}
      </h2>

      <div className="grid grid-cols-2 gap-5">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4">
          {pairData.left.map((card) => {
            const matched = matchedPairs.has(card.pairId);

            return (
              <button
                key={`left-${card.pairId}`}
                type="button"
                disabled={matched || showIncorrect}
                onClick={() => {
                  if (!matched) {
                    setSelectedLeft(card.pairId);
                  }
                }}
                className={`
                  min-h-[60px]
                  rounded-xl
                  border-2
                  border-b-4
                  px-4
                  py-3
                  text-lg
                  font-bold
                  transition-all
                  ${getLeftCardStyle(card.pairId)}
                `}
              >
                {card.text}
              </button>
            );
          })}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4">
          {rightCards.map((card) => {
            const matched = matchedPairs.has(card.pairId);

            return (
              <button
                key={`right-${card.pairId}`}
                type="button"
                disabled={matched || showIncorrect}
                onClick={() => {
                  if (!matched) {
                    setSelectedRight(card.pairId);
                  }
                }}
                className={`
                  min-h-[60px]
                  rounded-xl
                  border-2
                  border-b-4
                  px-4
                  py-3
                  text-lg
                  font-bold
                  transition-all
                  ${getRightCardStyle(card.pairId)}
                `}
              >
                {card.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Small completion indication */}
      {matchedPairs.size === pairData.left.length && (
        <p className="mt-6 text-center text-lg font-bold text-[#58cc02]">
          All pairs matched!
        </p>
      )}
    </div>
  );
}