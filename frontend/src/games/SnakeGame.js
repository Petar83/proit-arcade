import Phaser from "phaser";

export function createSnakeGame(parent, onGameOver) {
  const gridSize = 20;
  const cellSize = 20;
  const width = gridSize * cellSize;
  const height = gridSize * cellSize;

  class SnakeScene extends Phaser.Scene {
    constructor() {
      super("snake");
      this.snake = [];
      this.direction = { x: 1, y: 0 };
      this.nextDirection = { x: 1, y: 0 };
      this.score = 0;
      this.running = true;
    }

    create() {
      this.cameras.main.setBackgroundColor("#07130c");
      this.graphics = this.add.graphics();
      this.scoreText = this.add.text(14, 12, "0", {
        fontFamily: "system-ui",
        fontSize: "22px",
        fontStyle: "bold",
        color: "#ffffff"
      }).setDepth(2);

      this.snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
      ];

      this.placeFood();

      this.input.keyboard.on("keydown", (event) => {
        const map = {
          ArrowUp: [0, -1],
          ArrowDown: [0, 1],
          ArrowLeft: [-1, 0],
          ArrowRight: [1, 0]
        };
        const move = map[event.key];
        if (move) this.setDirection(move[0], move[1]);
      });

      let sx = 0;
      let sy = 0;

      this.input.on("pointerdown", (pointer) => {
        sx = pointer.x;
        sy = pointer.y;
      });

      this.input.on("pointerup", (pointer) => {
        const dx = pointer.x - sx;
        const dy = pointer.y - sy;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;

        if (Math.abs(dx) > Math.abs(dy)) {
          this.setDirection(Math.sign(dx), 0);
        } else {
          this.setDirection(0, Math.sign(dy));
        }
      });

      this.time.addEvent({
        delay: 95,
        loop: true,
        callback: () => this.tick()
      });

      this.draw();
    }

    setDirection(x, y) {
      if (
        this.direction.x + x === 0 &&
        this.direction.y + y === 0
      ) return;

      this.nextDirection = { x, y };
    }

    placeFood() {
      do {
        this.food = {
          x: Phaser.Math.Between(0, gridSize - 1),
          y: Phaser.Math.Between(0, gridSize - 1)
        };
      } while (this.snake.some((part) =>
        part.x === this.food.x && part.y === this.food.y
      ));
    }

    tick() {
      if (!this.running) return;

      this.direction = this.nextDirection;
      const head = {
        x: this.snake[0].x + this.direction.x,
        y: this.snake[0].y + this.direction.y
      };

      const collision =
        head.x < 0 ||
        head.y < 0 ||
        head.x >= gridSize ||
        head.y >= gridSize ||
        this.snake.some((part) => part.x === head.x && part.y === head.y);

      if (collision) {
        this.running = false;
        navigator.vibrate?.([70, 40, 70]);
        onGameOver(this.score);
        return;
      }

      this.snake.unshift(head);

      if (head.x === this.food.x && head.y === this.food.y) {
        this.score += 10;
        this.scoreText.setText(String(this.score));
        navigator.vibrate?.(18);
        this.placeFood();
      } else {
        this.snake.pop();
      }

      this.draw();
    }

    draw() {
      this.graphics.clear();

      this.graphics.lineStyle(1, 0xffffff, 0.035);
      for (let i = 0; i <= gridSize; i += 1) {
        this.graphics.lineBetween(i * cellSize, 0, i * cellSize, height);
        this.graphics.lineBetween(0, i * cellSize, width, i * cellSize);
      }

      this.graphics.fillStyle(0xfb7185, 1);
      this.graphics.fillCircle(
        this.food.x * cellSize + cellSize / 2,
        this.food.y * cellSize + cellSize / 2,
        7
      );

      this.snake.forEach((part, index) => {
        this.graphics.fillStyle(index === 0 ? 0xbbf7d0 : 0x22c55e, 1);
        this.graphics.fillRoundedRect(
          part.x * cellSize + 2,
          part.y * cellSize + 2,
          cellSize - 4,
          cellSize - 4,
          5
        );
      });
    }
  }

  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width,
    height,
    backgroundColor: "#07130c",
    scene: SnakeScene,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  });
}
