import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import styles from "../styles/Snake.module.css";
import Cell from "../components/cell";
import CellType from "../types/cellType";
import Direction, { getNextCell, oppositeDirection } from "../types/direction";

const Config = {
  height: 25,
  width: 25,
  cellSize: 32,
};

const getRandomCell = () => ({
  x: Math.floor(Math.random() * Config.width),
  y: Math.floor(Math.random() * Config.width),
});

const Snake = () => {
  const getDefaultSnake = () => [
    { x: 8, y: 12 },
    { x: 7, y: 12 },
    { x: 6, y: 12 },
  ];
  // const grid = useRef();

  // snake[0] is head and snake[snake.length - 1] is tail
  const [snake, setSnake] = useState(getDefaultSnake());
  const [direction, setDirection] = useState(Direction.Right);

  const [food, setFood] = useState({ x: 4, y: 10 });
  const [score, setScore] = useState(0);

  // move the snake
  useEffect(() => {
    const runSingleStep = () => {
      setSnake((snake) => {
        const head = snake[0];
        const newHead = getNextCell(head, direction, Config);

        // make a new snake by extending head
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
        const newSnake = [newHead, ...snake];

        // remove tail
        if (!isFood(newHead)) {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    runSingleStep();
    const timer = setInterval(runSingleStep, 500);

    return () => clearInterval(timer);
  }, [direction, food]);

  // update score whenever head touches a food
  useEffect(() => {
    const head = snake[0];
    if (isFood(head)) {
      setScore((score) => {
        return score + 1;
      });

      let newFood = getRandomCell();
      while (isSnake(newFood)) {
        newFood = getRandomCell();
      }

      setFood(newFood);
    }
  }, [snake]);

  useEffect(() => {
    const handleNavigation = (event) => {
      let newDirection = direction;

      switch (event.key) {
        case "ArrowUp":
          newDirection = Direction.Top;
          break;

        case "ArrowDown":
          newDirection = Direction.Bottom;
          break;

        case "ArrowLeft":
          newDirection = Direction.Left;
          break;

        case "ArrowRight":
          newDirection = Direction.Right;
          break;
      }

      setDirection((direction) => {
        return (newDirection !== oppositeDirection(direction)) ? newDirection : direction;
      });
    };
    window.addEventListener("keydown", handleNavigation);

    return () => window.removeEventListener("keydown", handleNavigation);
  }, []);

  // ?. is called optional chaining
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
  const isFood = ({ x, y }) => food?.x === x && food?.y === y;

  const isSnake = ({ x, y }) =>
    snake.find((position) => position.x === x && position.y === y);

  const cells = [];
  for (let x = 0; x < Config.width; x++) {
    for (let y = 0; y < Config.height; y++) {
      let type = CellType.Empty;
      if (isFood({ x, y })) {
        type = CellType.Food;
      } else if (isSnake({ x, y })) {
        type = CellType.Snake;
      }
      cells.push(<Cell key={`${x}-${y}`} x={x} y={y} type={type} cellSize={Config.cellSize} />);
    }
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.header}
        style={{ width: Config.width * Config.cellSize }}
      >
        Score: {score}
      </div>
      <div
        className={styles.grid}
        style={{
          height: Config.height * Config.cellSize,
          width: Config.width * Config.cellSize,
        }}
      >
        {cells}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Snake), {
  ssr: false,
});
