const iconStyle = { width: 22, height: 22, color: '#d7dadc' };

const LightbulbIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const HelpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const headerBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
};

const modalOverlay = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.85)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
};

const modalBox = {
  position: 'relative',
  backgroundColor: '#1a1a1b',
  border: '1px solid #3a3a3c',
  borderRadius: 8,
  width: '90%',
  maxWidth: 400,
  maxHeight: '80vh',
  overflow: 'auto',
  padding: '32px 24px 24px',
  color: '#d7dadc',
};

const closeBtn = {
  position: 'absolute',
  top: 10,
  right: 10,
  background: 'none',
  border: 'none',
  color: '#818384',
  fontSize: 22,
  cursor: 'pointer',
  lineHeight: 1,
  padding: 4,
  borderRadius: 4,
};

function ExampleTile({ letter, color }) {
  return (
    <div style={{
      width: 36,
      height: 36,
      background: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: 'white',
      fontSize: 16,
      flexShrink: 0,
    }}>
      {letter}
    </div>
  );
}

function StatBox({ value, label }) {
  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>{value}</div>
      <div style={{ fontSize: 11, lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}

const CORRECT_PRESETS = [
  { hex: '#538d4e', label: 'Classic green' },
  { hex: '#6aaa64', label: 'Bright green' },
  { hex: '#3b82f6', label: 'Blue' },
  { hex: '#8b5cf6', label: 'Purple' },
  { hex: '#ec4899', label: 'Pink' },
  { hex: '#ef4444', label: 'Red' },
  { hex: '#f97316', label: 'Orange' },
  { hex: '#14b8a6', label: 'Teal' },
];

const PRESENT_PRESETS = [
  { hex: '#b59f3b', label: 'Classic yellow' },
  { hex: '#c9b458', label: 'Bright yellow' },
  { hex: '#f59e0b', label: 'Amber' },
  { hex: '#d97706', label: 'Dark amber' },
  { hex: '#e879f9', label: 'Fuchsia' },
  { hex: '#fb923c', label: 'Light orange' },
  { hex: '#38bdf8', label: 'Sky blue' },
  { hex: '#a78bfa', label: 'Lavender' },
];

function ColorPicker({ label, value, onChange, presets }) {
  return (
    <div>
      <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{label}</span>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 4,
          backgroundColor: value,
          border: '2px solid #565758',
          flexShrink: 0,
        }} />
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        {presets.map((preset) => (
          <button
            key={preset.hex}
            title={preset.label}
            onClick={() => onChange(preset.hex)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: value === preset.hex ? '2px solid white' : '2px solid transparent',
              backgroundColor: preset.hex,
              cursor: 'pointer',
              padding: 0,
              outline: 'none',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 13, color: '#818384' }}>Custom:</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 36,
            height: 28,
            padding: 0,
            border: '1px solid #565758',
            borderRadius: 4,
            backgroundColor: 'transparent',
            cursor: 'pointer',
          }}
        />
        <span style={{ fontSize: 13, color: '#818384', fontFamily: 'monospace' }}>{value}</span>
      </div>
    </div>
  );
}

export function HeaderButtons({
  onHint,
  hintUsed,
  canHint,
  stats,
  soundEnabled,
  onSoundToggle,
  correctColor,
  onCorrectColorChange,
  presentColor,
  onPresentColorChange,
  openModal,
  setOpenModal,
}) {
  return (
    <>
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <button
          onClick={onHint}
          disabled={!canHint || hintUsed}
          title="Reveal one letter"
          style={{
            ...headerBtn,
            cursor: canHint && !hintUsed ? 'pointer' : 'default',
            opacity: canHint && !hintUsed ? 1 : 0.35,
          }}
        >
          <LightbulbIcon />
        </button>
        <button onClick={() => setOpenModal('stats')} title="Statistics" style={headerBtn}>
          <ChartIcon />
        </button>
        <button onClick={() => setOpenModal('help')} title="How to play" style={headerBtn}>
          <HelpIcon />
        </button>
        <button onClick={() => setOpenModal('settings')} title="Settings" style={headerBtn}>
          <SettingsIcon />
        </button>
      </div>

      {openModal === 'help' && (
        <div style={modalOverlay} onClick={() => setOpenModal(null)}>
          <div style={modalBox} onClick={(e) => e.stopPropagation()}>
            <button style={closeBtn} onClick={() => setOpenModal(null)} aria-label="Close">×</button>
            <h2 style={{ color: 'white', marginBottom: 16, fontSize: 18 }}>How to play</h2>
            <p style={{ marginBottom: 10, lineHeight: 1.6 }}>
              Guess the <strong style={{ color: 'white' }}>WORDLE</strong> in 6 tries.
            </p>
            <p style={{ marginBottom: 10, lineHeight: 1.6 }}>
              Each guess must be a valid 5-letter word. Press Enter to submit.
            </p>
            <p style={{ marginBottom: 16, lineHeight: 1.6 }}>
              After each guess, the tiles change color to show how close your guess was.
            </p>
            <div style={{ borderTop: '1px solid #3a3a3c', paddingTop: 16 }}>
              <p style={{ marginBottom: 12, fontWeight: 600, color: 'white' }}>Examples</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
                <ExampleTile letter="W" color={correctColor} />
                <span style={{ fontSize: 14 }}>is in the word and in the correct spot.</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
                <ExampleTile letter="I" color={presentColor} />
                <span style={{ fontSize: 14 }}>is in the word but in the wrong spot.</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <ExampleTile letter="U" color="#3a3a3c" />
                <span style={{ fontSize: 14 }}>is not in the word in any spot.</span>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #3a3a3c', marginTop: 16, paddingTop: 12 }}>
              <p style={{ fontSize: 13, color: '#818384' }}>
                Use the lightbulb for a one-time hint that reveals the next correct letter.
              </p>
            </div>
          </div>
        </div>
      )}

      {openModal === 'stats' && (
        <div style={modalOverlay} onClick={() => setOpenModal(null)}>
          <div style={modalBox} onClick={(e) => e.stopPropagation()}>
            <button style={closeBtn} onClick={() => setOpenModal(null)} aria-label="Close">×</button>
            <h2 style={{ color: 'white', marginBottom: 20, fontSize: 18 }}>Statistics</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <StatBox value={stats.gamesPlayed} label="Played" />
              <StatBox value={`${stats.winRate}%`} label="Win Rate" />
              <StatBox value={stats.currentStreak} label="Current Streak" />
              <StatBox value={stats.maxStreak} label="Max Streak" />
            </div>
            {stats.gamesPlayed === 0 && (
              <p style={{ fontSize: 14, color: '#818384', textAlign: 'center' }}>
                Play a game to see your stats.
              </p>
            )}
          </div>
        </div>
      )}

      {openModal === 'settings' && (
        <div style={modalOverlay} onClick={() => setOpenModal(null)}>
          <div style={modalBox} onClick={(e) => e.stopPropagation()}>
            <button style={closeBtn} onClick={() => setOpenModal(null)} aria-label="Close">×</button>
            <h2 style={{ color: 'white', marginBottom: 20, fontSize: 18 }}>Settings</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <span>Sound effects</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => onSoundToggle(e.target.checked)}
                />
                <span className="toggle-track" />
              </label>
            </div>

            <div style={{ borderTop: '1px solid #3a3a3c', paddingTop: 20, marginBottom: 20 }}>
              <ColorPicker
                label="Correct (right letter, right spot)"
                value={correctColor}
                onChange={onCorrectColorChange}
                presets={CORRECT_PRESETS}
              />
            </div>

            <div style={{ borderTop: '1px solid #3a3a3c', paddingTop: 20 }}>
              <ColorPicker
                label="Present (right letter, wrong spot)"
                value={presentColor}
                onChange={onPresentColorChange}
                presets={PRESENT_PRESETS}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
