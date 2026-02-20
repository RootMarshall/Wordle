import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { isValidGuess, evaluateGuess } from './utils/wordUtils';
import { playCorrectSound, preloadCorrectSound, setSoundEnabled } from './utils/soundUtils';
import { loadStats, saveGameResult, loadSettings, saveSettings } from './utils/statsUtils';
import Fireworks from './Fireworks';
import { HeaderButtons } from './HeaderIcons';
import VictoryVideo from './VictoryVideo';
import wordles from 'wordles/wordles.json';

const WORDLE_EPOCH = new Date('2021-06-19');
function getSolutionByDate(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const epoch = new Date(WORDLE_EPOCH);
  epoch.setHours(0, 0, 0, 0);
  const index = Math.floor((d - epoch) / (24 * 60 * 60 * 1000));
  if (index >= 0 && index < wordles.length) return wordles[index].toLowerCase();
  return wordles[0].toLowerCase();
}

const ROWS = 6;
const COLS = 5;

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

function Tile({ letter, status, isActive, isHinted, correctColor, presentColor }) {
  const isEmpty = !letter;
  const bgColor =
    status === 'correct'
      ? correctColor
      : status === 'present'
        ? presentColor
        : status === 'absent'
          ? '#3a3a3c'
          : isEmpty
            ? '#121213'
            : '#121213';
  const borderColor = isActive
    ? '#565758'
    : status
      ? bgColor
      : isEmpty
        ? '#3a3a3c'
        : '#565758';
  const activeBorderColor = isActive && letter ? '#878a8c' : borderColor;
  const tileClass = status !== null ? 'tile-reveal' : '';
  const correctClass = status === 'correct' ? 'tile-correct' : '';
  const bounceClass = letter && !status ? 'tile-bounce' : '';
  const size = isActive ? 68 : 62;
  const fontSize = isActive ? 30 : 28;

  return (
    <div
      className={`${tileClass} ${correctClass} ${bounceClass}`.trim()}
      style={{
        width: size,
        height: size,
        border: `2px solid ${activeBorderColor}`,
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: 'bold',
        color: isHinted ? correctColor : 'white',
        textTransform: 'uppercase',
        transition: 'width 0.15s ease, height 0.15s ease, border-color 0.15s ease, font-size 0.15s ease',
      }}
    >
      {letter}
    </div>
  );
}

function KeyboardKey({ letter, status, onClick, wide, correctColor, presentColor }) {
  const bgColor =
    status === 'correct'
      ? correctColor
      : status === 'present'
        ? presentColor
        : status === 'absent'
          ? '#3a3a3c'
          : '#818384';
  const textColor = status ? 'white' : '#d7dadc';

  return (
    <button
      className="keyboard-key"
      onClick={() => onClick(letter)}
      style={{
        flex: wide ? 1.5 : 1,
        minWidth: wide ? 65 : 43,
        height: 58,
        border: 'none',
        borderRadius: 4,
        backgroundColor: bgColor,
        color: textColor,
        fontSize: 13,
        fontWeight: 'bold',
        cursor: 'pointer',
        textTransform: 'uppercase',
        transition: 'filter 0.1s ease',
      }}
    >
      {letter}
    </button>
  );
}

const REVEAL_DELAY_MS = 120;

export default function Wordle() {
  const [solution, setSolution] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');
  const [usedLetters, setUsedLetters] = useState({});
  const [message, setMessage] = useState('');
  const [animatingRow, setAnimatingRow] = useState(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [openModal, setOpenModal] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintPos, setHintPos] = useState(-1);
  const [stats, setStats] = useState(() => loadStats());
  const [soundEnabled, setSoundEnabledState] = useState(() => loadSettings().soundEnabled);
  const [correctColor, setCorrectColor] = useState(() => loadSettings().correctColor);
  const [presentColor, setPresentColor] = useState(() => loadSettings().presentColor);
  const [showVictoryVideo, setShowVictoryVideo] = useState(false);
  const messageTimer = useRef(null);

  useEffect(() => {
    setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--correct-color', correctColor);
    const r = parseInt(correctColor.slice(1, 3), 16);
    const g = parseInt(correctColor.slice(3, 5), 16);
    const b = parseInt(correctColor.slice(5, 7), 16);
    root.style.setProperty('--correct-color-glow', `rgba(${r},${g},${b},0.5)`);
  }, [correctColor]);

  useEffect(() => {
    if (window.wordleAPI) {
      window.wordleAPI.getTodaysWord().then((word) => setSolution(word));
    } else {
      setSolution(getSolutionByDate(new Date()));
    }
    preloadCorrectSound();
  }, []);

  const activeRowIndex = gameStatus === 'won' ? guesses.length - 1 : guesses.length;

  const evaluations = useMemo(() => {
    if (!solution) return [];
    return guesses.map((g) => evaluateGuess(g, solution));
  }, [guesses, solution]);

  useEffect(() => {
    if (animatingRow === null || revealedCount >= 5) return;
    const timer = setTimeout(() => {
      setRevealedCount((c) => {
        const next = c + 1;
        if (next <= 5 && animatingRow !== null && guesses[animatingRow]) {
          const evaluation = evaluations[animatingRow];
          if (evaluation && evaluation[c] === 'correct') {
            playCorrectSound();
          }
        }
        return next;
      });
    }, REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [animatingRow, revealedCount, guesses, solution, evaluations]);

  useEffect(() => {
    if (animatingRow !== null && revealedCount >= 5) {
      const guess = guesses[animatingRow];
      const evaluation = evaluations[animatingRow];
      if (!evaluation) return;
      const isWin = guess.toLowerCase() === solution;

      const newUsed = { ...usedLetters };
      for (let i = 0; i < 5; i++) {
        const c = guess[i].toUpperCase();
        const status = evaluation[i];
        if (!newUsed[c] || status === 'correct') {
          newUsed[c] = status;
        } else if (status === 'present' && newUsed[c] !== 'correct') {
          newUsed[c] = 'present';
        } else if (status === 'absent' && !newUsed[c]) {
          newUsed[c] = 'absent';
        }
      }
      setUsedLetters(newUsed);
      if (isWin) {
        setGameStatus('won');
        saveGameResult(true);
        setShowVictoryVideo(true);
      } else if (animatingRow + 1 >= ROWS) {
        setGameStatus('lost');
        saveGameResult(false);
      }
      setAnimatingRow(null);
      setRevealedCount(0);
    }
  }, [animatingRow, revealedCount, guesses, solution, usedLetters, evaluations]);

  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      setStats(loadStats());
    }
  }, [gameStatus]);

  const showMessage = useCallback((text) => {
    if (messageTimer.current) clearTimeout(messageTimer.current);
    setMessage(text);
    messageTimer.current = setTimeout(() => setMessage(''), 1500);
  }, []);

  const handleKey = useCallback(
    (key) => {
      if (gameStatus !== 'playing' || !solution) return;
      if (animatingRow !== null) return;
      if (openModal) return;

      if (key === 'ENTER') {
        if (currentGuess.length !== 5) {
          showMessage('Not enough letters');
          return;
        }
        if (!isValidGuess(currentGuess)) {
          showMessage('Not in word list');
          return;
        }
        setGuesses((g) => [...g, currentGuess]);
        setCurrentGuess('');
        setHintPos(-1);
        setAnimatingRow(guesses.length);
        setRevealedCount(0);
      } else if (key === 'BACKSPACE') {
        setCurrentGuess((g) => g.slice(0, -1));
      } else if (/^[A-Za-z]$/.test(key) && currentGuess.length < 5) {
        setCurrentGuess((g) => g + key.toUpperCase());
      }
    },
    [currentGuess, solution, gameStatus, guesses.length, animatingRow, openModal, showMessage]
  );

  const handleHint = useCallback(() => {
    if (gameStatus !== 'playing' || !solution || hintUsed || animatingRow !== null) return;
    if (currentGuess.length >= 5) return;
    const pos = currentGuess.length;
    const letter = solution[pos].toUpperCase();
    setCurrentGuess((g) => g + letter);
    setHintPos(pos);
    setHintUsed(true);
  }, [gameStatus, solution, hintUsed, animatingRow, currentGuess.length]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (openModal) {
        if (e.key === 'Escape') setOpenModal(null);
        return;
      }
      if (gameStatus === 'lost' && e.key === 'Escape') {
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        handleKey('ENTER');
      } else if (e.key === 'Backspace') {
        handleKey('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        handleKey(e.key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey, openModal, gameStatus]);

  const getTileStatus = (rowIndex, colIndex) => {
    if (rowIndex < guesses.length && evaluations[rowIndex]) {
      if (rowIndex === animatingRow && colIndex >= revealedCount) return null;
      return evaluations[rowIndex][colIndex];
    }
    return null;
  };

  const getTileLetter = (rowIndex, colIndex) => {
    if (rowIndex < guesses.length) return guesses[rowIndex][colIndex];
    if (rowIndex === guesses.length) return currentGuess[colIndex];
    return '';
  };

  if (!solution && !message) {
    return (
      <div style={{ color: 'white', textAlign: 'center', padding: 40 }}>
        Loading today's word...
      </div>
    );
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#121213',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: 500,
          padding: '12px 16px',
          borderBottom: '1px solid #3a3a3c',
          flexShrink: 0,
        }}
      >
        <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>
          The New York Times Games
        </span>
        <HeaderButtons
          onHint={handleHint}
          hintUsed={hintUsed}
          canHint={gameStatus === 'playing' && currentGuess.length < 5 && animatingRow === null}
          stats={{
            ...stats,
            winRate: stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0,
          }}
          soundEnabled={soundEnabled}
          onSoundToggle={(enabled) => {
            setSoundEnabledState(enabled);
            saveSettings({ soundEnabled: enabled, correctColor, presentColor });
          }}
          correctColor={correctColor}
          onCorrectColorChange={(color) => {
            setCorrectColor(color);
            saveSettings({ soundEnabled, correctColor: color, presentColor });
          }}
          presentColor={presentColor}
          onPresentColorChange={(color) => {
            setPresentColor(color);
            saveSettings({ soundEnabled, correctColor, presentColor: color });
          }}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      </header>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 0',
          minHeight: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {Array.from({ length: ROWS }).map((_, rowIndex) => {
            const isActiveRow = rowIndex === activeRowIndex && animatingRow === null;
            return (
              <div key={rowIndex} style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                {Array.from({ length: COLS }).map((_, colIndex) => {
                  const isCurrentRow = rowIndex === guesses.length;
                  const isHinted = isCurrentRow && colIndex === hintPos;
                  return (
                    <Tile
                      key={colIndex}
                      letter={getTileLetter(rowIndex, colIndex)}
                      status={getTileStatus(rowIndex, colIndex)}
                      isActive={isActiveRow}
                      isHinted={isHinted}
                      correctColor={correctColor}
                      presentColor={presentColor}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {message && (
        <div
          className="toast-message"
          style={{
            position: 'fixed',
            top: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#d7dadc',
            color: '#121213',
            padding: '12px 24px',
            borderRadius: 4,
            fontWeight: 600,
            fontSize: 14,
            zIndex: 50,
          }}
        >
          {message}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          maxWidth: 500,
          width: '100%',
          padding: '0 8px 12px',
          flexShrink: 0,
        }}
      >
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', gap: 6, justifyContent: 'center', width: '100%' }}>
            {rowIndex === 2 && (
              <KeyboardKey letter="ENTER" onClick={() => handleKey('ENTER')} wide />
            )}
            {row.map((key) => (
              <KeyboardKey
                key={key}
                letter={key}
                status={usedLetters[key]}
                onClick={() => handleKey(key)}
                correctColor={correctColor}
                presentColor={presentColor}
              />
            ))}
            {rowIndex === 2 && (
              <KeyboardKey letter="⌫" onClick={() => handleKey('BACKSPACE')} wide />
            )}
          </div>
        ))}
      </div>

      <Fireworks active={gameStatus === 'won' && !showVictoryVideo} correctColor={correctColor} presentColor={presentColor} />

      {gameStatus === 'won' && !showVictoryVideo && (
        <div className="win-banner">You won!</div>
      )}

      <VictoryVideo
        active={showVictoryVideo}
        onClose={() => setShowVictoryVideo(false)}
      />

      {gameStatus === 'lost' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 16,
            zIndex: 50,
            cursor: 'pointer',
          }}
          onClick={() => setGameStatus('lost-dismissed')}
        >
          <div style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
            Game over
          </div>
          <div style={{ color: correctColor, fontSize: 18 }}>
            The word was: {solution?.toUpperCase()}
          </div>
          <div style={{ color: '#818384', fontSize: 13, marginTop: 8 }}>
            Click anywhere to dismiss
          </div>
        </div>
      )}
    </div>
  );
}
