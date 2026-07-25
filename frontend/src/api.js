export async function getLeaderboard(game) {
  const response = await fetch(`/api/leaderboard/${game}`);
  if (!response.ok) throw new Error("Класацията не може да бъде заредена.");
  return response.json();
}

export async function saveScore(payload) {
  const response = await fetch("/api/scores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Резултатът не беше записан.");
  }

  return response.json();
}
