import dynamic from "next/dynamic";
import { useEffect, useReducer, useState } from "react";
import styles from "../styles/Snake.module.css";
import Cell from "../components/cell";
import CellType from "../types/cellType";
import Direction, { chooseNextDirection, getNextCell } from "../types/direction";

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

  const initialGameState = {
    snake: getDefaultSnake(),
    direction: Direction.Right,
    score: 0
  };

  const [foods, setFoods] = useState([]);

  const [snakeState, snakeStateDispatch] = useReducer((gameState, action) => {
    switch (action.type) {
      case 'moveSnake':
        return { ...gameState, snake: getNextSnake(gameState.snake, gameState.direction) }
      case 'increaseScore':
        return { ...gameState, score: gameState.score + 1 };
      case 'changeDirection':
        return { ...gameState, direction: chooseNextDirection(gameState.direction, action.direction) };
      case 'reset':
        return initialGameState;
      default:
        return gameState;
    }
  }, initialGameState);

  function isFoodCell ({ x, y }) {
    return foods.find(food => food?.x === x && food?.y === y);
  }

  function isSnakeCell ({ x, y }) {
    return snakeState.snake.find((position) => position.x === x && position.y === y);
  }

  function isInvalidSnake(snake) {
    const head = snake[0];

    return snake.slice(1).find((position) => position.x === head.x && position.y === head.y);
  }

  function getNextSnake (snake, direction) {
    const head = snake[0];
    const newHead = getNextCell(head, direction, Config);

    const newSnake = [newHead, ...snake];

    // remove tail
    if (!isFoodCell(newHead)) {
      newSnake.pop();
    }

    return newSnake;
  }

  function addFood(newFood) {
    setFoods(foods => [...foods, newFood]);
  }

  const removeFoodIfExists = (foodToRemove) => {
    setFoods((foods) => foods.filter(food => !(food.x === foodToRemove.x && food.y === foodToRemove.y)))
  }

  // move the snake
  useEffect(() => {
    const runSingleStep = () => {
      snakeStateDispatch({ type: 'moveSnake' });
    };

    runSingleStep();
    const timer = setInterval(runSingleStep, 500);

    return () => clearInterval(timer);
  }, [snakeState.direction]);

  // update score whenever head touches a food
  useEffect(() => {
    const head = snakeState.snake[0];

    if (isInvalidSnake(snakeState.snake)) {
      snakeStateDispatch({ type: 'reset' });

    } else if (isFoodCell(head)) {
      snakeStateDispatch({ type: 'increaseScore' });
      removeFoodIfExists(head);
    }

  }, [snakeState.snake]);

  useEffect(() => {
    const handleNavigation = (event) => {
      switch (event.key) {
        case "ArrowUp":
          snakeStateDispatch({ type: 'changeDirection', direction: Direction.Top });
          break;

        case "ArrowDown":
          snakeStateDispatch({ type: 'changeDirection', direction: Direction.Bottom });
          break;

        case "ArrowLeft":
          snakeStateDispatch({ type: 'changeDirection', direction: Direction.Left });
          break;

        case "ArrowRight":
          snakeStateDispatch({ type: 'changeDirection', direction: Direction.Right });
          break;
      }
    };
    window.addEventListener("keydown", handleNavigation);

    const createNewFood = () => {
      let newFood = getRandomCell();
      while (isSnakeCell(newFood) || isFoodCell(newFood)) {
        newFood = getRandomCell();
      }

      setTimeout(() => removeFoodIfExists(newFood), 10000);
      addFood(newFood);
    };

    createNewFood();
    const foodGeneratorInterval = setInterval(createNewFood, 3000);

    return () => {
      window.removeEventListener("keydown", handleNavigation);
      clearInterval(foodGeneratorInterval);
    }
  }, []);

  const cells = [];
  for (let x = 0; x < Config.width; x++) {
    for (let y = 0; y < Config.height; y++) {
      let type = CellType.Empty;
      if (isFoodCell({ x, y })) {
        type = CellType.Food;
      } else if (isSnakeCell({ x, y })) {
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
        Score: {snakeState.score}
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
