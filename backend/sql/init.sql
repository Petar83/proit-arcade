CREATE TABLE IF NOT EXISTS scores (
    id BIGSERIAL PRIMARY KEY,
    nickname VARCHAR(24) NOT NULL,
    game_slug VARCHAR(64) NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scores_game_score
ON scores (game_slug, score DESC, created_at ASC);
