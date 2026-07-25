import { useEffect, useRef, useState } from "react";
import { createSnakeGame } from "../games/SnakeGame";
import { saveScore } from "../api";

export default function Snake({ nickname, onBack, onSaved }) {
  const containerRef = useRef(null);
  const gameRef = useRef(null);
  const [finalScore, setFinalScore] = useState(null);
  const [error, setError] = useState("");

  async function handleGameOver(score) {
    setFinalScore(score);

    try {
      await saveScore({ nickname, game: "snake", score });
      onSaved();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    gameRef.current = createSnakeGame(containerRef.current, handleGameOver);
    return () => gameRef.current?.destroy(true);
  }, []);

  function restart() {
    setFinalScore(null);
    setError("");
    gameRef.current?.destroy(true);
    gameRef.current = createSnakeGame(containerRef.current, handleGameOver);
  }

  return (
    <main className="game-screen">
      <header className="game-header">
        <button className="icon-button" onClick={onBack}>‹</button>
        <div>
          <span className="eyebrow">ИГРАЕ</span>
          <strong>{nickname}</strong>
        </div>
      </header>

      <section className="game-shell">
        <div ref={containerRef} className="phaser-container" />
      </section>

      <p className="game-help">Плъзгай по екрана или използвай стрелките.</p>

      {finalScore !== null && (
        <div className="modal-backdrop">
          <div className="modal">
            <span className="modal-icon">🐍</span>
            <h2>Край на играта</h2>
            <p>Резултат: <strong>{finalScore}</strong></p>
            {error && <p className="error">{error}</p>}
            <button className="primary-button" onClick={restart}>Играй отново</button>
            <button className="text-button" onClick={onBack}>Към портала</button>
          </div>
        </div>
      )}
    </main>
  );
}
