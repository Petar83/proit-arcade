import { useEffect, useMemo, useState } from "react";
import Snake from "./components/Snake";
import Leaderboard from "./components/Leaderboard";
import { getLeaderboard } from "./api";

const upcoming = [
  { title: "Space Attack", icon: "🚀", className: "blue" },
  { title: "Neon Breakout", icon: "🧱", className: "orange" },
  { title: "Road Hopper", icon: "🐸", className: "purple" },
  { title: "2048", icon: "2048", className: "yellow" }
];

export default function App() {
  const [nickname, setNickname] = useState(
    localStorage.getItem("arcadeNickname") || ""
  );
  const [draftNickname, setDraftNickname] = useState(nickname);
  const [screen, setScreen] = useState("home");
  const [scores, setScores] = useState([]);
  const [loadingScores, setLoadingScores] = useState(true);
  const [nicknameError, setNicknameError] = useState("");

  async function refreshScores() {
    setLoadingScores(true);
    try {
      const data = await getLeaderboard("snake");
      setScores(data.scores || []);
    } catch {
      setScores([]);
    } finally {
      setLoadingScores(false);
    }
  }

  useEffect(() => {
    refreshScores();
  }, []);

  const validNickname = useMemo(
    () => /^[\p{L}\p{N} _.-]{2,24}$/u.test(draftNickname.trim()),
    [draftNickname]
  );

  function saveNickname(event) {
    event.preventDefault();

    if (!validNickname) {
      setNicknameError("Въведи между 2 и 24 букви или цифри.");
      return;
    }

    const clean = draftNickname.trim();
    localStorage.setItem("arcadeNickname", clean);
    setNickname(clean);
    setNicknameError("");
  }

  function startSnake() {
    if (!nickname) {
      document.getElementById("nickname")?.focus();
      return;
    }
    setScreen("snake");
  }

  if (screen === "snake") {
    return (
      <Snake
        nickname={nickname}
        onBack={() => {
          setScreen("home");
          refreshScores();
        }}
        onSaved={refreshScores}
      />
    );
  }

  return (
    <>
      <header className="hero">
        <nav className="top-nav">
          <div className="brand">
            <span className="brand-mark">P</span>
            <span>PRO-IT Arcade</span>
          </div>
          <span className="status-dot">● ONLINE</span>
        </nav>

        <div className="hero-content">
          <span className="hero-kicker">PLAY ANYWHERE</span>
          <h1>Твоята аркада.<br />Навсякъде.</h1>
          <p>Собствени браузърни игри, общи класации и отлично усещане на телефон.</p>
        </div>
      </header>

      <main className="page">
        <section className="profile-card">
          <div>
            <span className="eyebrow">ТВОЯТ ПРОФИЛ</span>
            <h2>{nickname || "Избери псевдоним"}</h2>
            <p>Не е необходима регистрация.</p>
          </div>

          <form onSubmit={saveNickname}>
            <input
              id="nickname"
              value={draftNickname}
              onChange={(event) => setDraftNickname(event.target.value)}
              placeholder="Например Petar83"
              maxLength={24}
            />
            <button className="small-button" type="submit">Запази</button>
          </form>
          {nicknameError && <p className="error">{nicknameError}</p>}
        </section>

        <section className="featured-card" onClick={startSnake}>
          <div>
            <span className="eyebrow light">ИГРА НА СЕДМИЦАТА</span>
            <h2>Snake Arena</h2>
            <p>Класическа игра, преработена с Phaser и обща класация.</p>
            <button className="play-button" onClick={startSnake}>
              ▶ Играй сега
            </button>
          </div>
          <span className="featured-icon">🐍</span>
        </section>

        <div className="section-heading">
          <div>
            <span className="eyebrow">СКОРО</span>
            <h2>Следващи игри</h2>
          </div>
        </div>

        <section className="game-grid">
          {upcoming.map((game) => (
            <article className={`game-card ${game.className}`} key={game.title}>
              <span>{game.icon}</span>
              <div>
                <h3>{game.title}</h3>
                <p>В разработка</p>
              </div>
            </article>
          ))}
        </section>

        <Leaderboard scores={scores} loading={loadingScores} />
      </main>

      <footer>PRO-IT Arcade · self-hosted · без реклами</footer>
    </>
  );
}
