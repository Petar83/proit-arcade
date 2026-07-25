import Fastify from "fastify";
import cors from "@fastify/cors";
import pg from "pg";
import { createClient } from "redis";
import { z } from "zod";

const app = Fastify({ logger: true });
const port = Number(process.env.PORT || 3000);

await app.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(",") || true
});

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

const redis = createClient({
  url: process.env.REDIS_URL
});

redis.on("error", (error) => app.log.error(error, "Redis error"));
await redis.connect();

app.get("/api/health", async () => {
  await pool.query("SELECT 1");
  await redis.ping();
  return { ok: true };
});

app.get("/api/leaderboard/:game", async (request) => {
  const game = z.string().min(1).max(64).parse(request.params.game);
  const cacheKey = `leaderboard:${game}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const { rows } = await pool.query(
    `SELECT nickname, MAX(score)::int AS score
       FROM scores
      WHERE game_slug = $1
      GROUP BY nickname
      ORDER BY score DESC, nickname ASC
      LIMIT 20`,
    [game]
  );

  const result = { game, scores: rows };
  await redis.setEx(cacheKey, 30, JSON.stringify(result));
  return result;
});

app.post("/api/scores", async (request, reply) => {
  const payload = z.object({
    nickname: z.string().trim().min(2).max(24)
      .regex(/^[\p{L}\p{N} _.-]+$/u, "Невалиден псевдоним"),
    game: z.string().trim().min(1).max(64)
      .regex(/^[a-z0-9-]+$/),
    score: z.number().int().min(0).max(100000000)
  }).parse(request.body);

  await pool.query(
    `INSERT INTO scores (nickname, game_slug, score)
     VALUES ($1, $2, $3)`,
    [payload.nickname, payload.game, payload.score]
  );

  await redis.del(`leaderboard:${payload.game}`);
  reply.code(201);
  return { saved: true };
});

app.setErrorHandler((error, request, reply) => {
  if (error instanceof z.ZodError) {
    return reply.code(400).send({
      error: "Невалидни данни",
      details: error.issues
    });
  }

  request.log.error(error);
  return reply.code(500).send({ error: "Вътрешна грешка" });
});

await app.listen({ host: "0.0.0.0", port });
