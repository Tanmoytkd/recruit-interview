import dynamic from "next/dynamic";
import { useEffect } from "react";
import styles from "../styles/Snake.module.css";
import Cell from "../components/cell";
import CellType from "../types/cellType";
import Direction from "../types/direction";
import useSnakeGameLogic from "../hooks/useSnakeGameLogic";

const Config = {
  height: 3,
  width: 6,
  cellSize: 32,
  foodGenerationInterval: 3000,
  foodLifetime: 10000,
};

const getDefaultSnake = () => [
  { x: 1, y: 0 },
  { x: 0, y: 0 }
];

const Snake = () => {
  const [score, changeDirection, isFoodCell, isSnakeCell] = useSnakeGameLogic(getDefaultSnake(), Config);

  useEffect(() => {
    const navigationHandler = handleNavigation(changeDirection);
    window.addEventListener("keydown", navigationHandler);

    return () => {
      window.removeEventListener("keydown", navigationHandler);
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

function handleNavigation(changeDirection) {
  return (event) => {
    switch (event.key) {
      case "ArrowUp":
        changeDirection(Direction.Top);
        break;

      case "ArrowDown":
        changeDirection(Direction.Bottom);
        break;

      case "ArrowLeft":
        changeDirection(Direction.Left);
        break;

      case "ArrowRight":
        changeDirection(Direction.Right);
        break;
    }
  }
}

export default dynamic(() => Promise.resolve(Snake), {
  ssr: false,
});
