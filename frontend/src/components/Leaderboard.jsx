export default function Leaderboard({ scores, loading }) {
  return (
    <section className="leaderboard">
      <div className="section-title">
        <div>
          <span className="eyebrow">ОБЩА КЛАСАЦИЯ</span>
          <h2>Snake Champions</h2>
        </div>
        <span className="trophy">🏆</span>
      </div>

      {loading ? (
        <p className="muted">Зареждане...</p>
      ) : scores.length === 0 ? (
        <p className="muted">Все още няма записани резултати.</p>
      ) : (
        <ol className="score-list">
          {scores.slice(0, 10).map((item, index) => (
            <li key={`${item.nickname}-${index}`}>
              <span className="rank">{index + 1}</span>
              <span className="player">{item.nickname}</span>
              <strong>{item.score}</strong>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
