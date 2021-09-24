import Direction, { chooseNextDirection, getNextCell } from "../types/direction";
import { useEffect, useReducer, useRef } from "react";
import CellType from "../types/cellType";
import useFoodGenerator from "./useFoodGenerator";

function useSnakeGameLogic(defaultSnake, { width, height, foodLifetime, foodGenerationInterval }) {
    const initialSnakeState = {
        snake: defaultSnake,
        direction: Direction.Right,
        score: 0
    };

    const grid = useRef(makeGrid(width, height));

    const [foods, removeFoodIfExists] = useFoodGenerator(grid, foodGenerationInterval, foodLifetime);

    const [snakeState, snakeStateDispatch] = useReducer((snakeState, action) => {
        switch (action.type) {
            case 'moveSnake':
                return { ...snakeState, snake: getNextSnake(snakeState.snake, snakeState.direction) }
            case 'increaseScore':
                return { ...snakeState, score: snakeState.score + 1 };
            case 'changeDirection':
                return { ...snakeState, direction: chooseNextDirection(snakeState.direction, action.direction) };
            case 'reset':
                return initialSnakeState;
            default:
                return snakeState;
        }
    }, initialSnakeState);

    useEffect(() => {
        grid.current = updateGrid(grid.current, snakeState.snake, foods);
    }, [snakeState, foods]);

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

            const foodToRemove = foods.find(food => food.x === head.x && food.y === head.y);
            removeFoodIfExists(foodToRemove);
        }

    }, [snakeState.snake]);

    function isFoodCell({ x, y }) {
        return foods.some(food => food.x === x && food.y === y);
    }

    function isSnakeCell({ x, y }) {
        return snakeState.snake.some((position) => position.x === x && position.y === y);
    }

    function isInvalidSnake(snake) {
        const head = snake[0];
        return snake.slice(1).some((position) => position.x === head.x && position.y === head.y);
    }

    function getNextSnake(snake, direction) {
        const head = snake[0];
        const newHead = getNextCell(head, direction, height, width);

        const newSnake = [newHead, ...snake];

        // remove tail
        if (!isFoodCell(newHead)) {
            newSnake.pop();
        }

        return newSnake;
    }

    const changeDirection = (direction) => {
        snakeStateDispatch({ type: 'changeDirection', direction: direction });
    }

    return [snakeState.score, changeDirection, isFoodCell, isSnakeCell];
}

function makeGrid(width, height) {
    const grid = [];

    for (let x = 0; x < width; x++) {
        const column = [];

        for (let y = 0; y < height; y++) {
            const emptyCell = { type: CellType.Empty };
            column.push(emptyCell);
        }

        grid.push(column);
    }

    grid.width = width;
    grid.height = height;

    return grid;
}

function updateGrid(currentGrid, snake, foods) {
    currentGrid = makeGrid(currentGrid.width, currentGrid.height);

    snake.forEach(({ x, y }) => {
        currentGrid[x][y].type = CellType.Snake;
    })

    foods.forEach(({ x, y }) => {
        currentGrid[x][y].type = CellType.Food;
    })

    return currentGrid;
}

export default useSnakeGameLogic;
