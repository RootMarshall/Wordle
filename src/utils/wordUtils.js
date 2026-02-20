import wordles from 'wordles/wordles.json';
import nonwordles from 'wordles/nonwordles.json';

const VALID_WORDS = new Set([...wordles, ...nonwordles].map((w) => w.toLowerCase()));

/**
 * Check if a word is a valid guess (in solutions or accepted guesses).
 */
export function isValidGuess(word) {
  return word.length === 5 && VALID_WORDS.has(word.toLowerCase());
}

/**
 * Evaluate a guess against the solution. Returns array of 'correct' | 'present' | 'absent'.
 * Handles duplicate letters per Wordle rules:
 * - Letters highlight only as many times as they appear in the answer
 * - Correct position takes priority
 * - If guess has more occurrences than answer, only first instance gets yellow
 */
export function evaluateGuess(guess, solution) {
  const result = new Array(5).fill(null);
  const solutionCount = {};
  for (const c of solution.toLowerCase()) {
    solutionCount[c] = (solutionCount[c] || 0) + 1;
  }

  const guessLower = guess.toLowerCase();
  const solutionLower = solution.toLowerCase();

  // First pass: mark correct positions
  for (let i = 0; i < 5; i++) {
    if (guessLower[i] === solutionLower[i]) {
      result[i] = 'correct';
      solutionCount[guessLower[i]]--;
    }
  }

  // Second pass: mark present (yellow) for remaining letters
  for (let i = 0; i < 5; i++) {
    if (result[i] !== null) continue;
    const c = guessLower[i];
    if (solutionCount[c] && solutionCount[c] > 0) {
      result[i] = 'present';
      solutionCount[c]--;
    } else {
      result[i] = 'absent';
    }
  }

  return result;
}
