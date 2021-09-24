import Direction, { chooseNextDirection, getNextCell } from "../types/direction";
import { useEffect, useReducer, useRef, useState } from "react";
import CellType from "../types/cellType";

function getCellType(grid, {x, y}) {
    return grid.current[x][y].type;
}

function useFoodsLogic(grid, foodGenerationInterval, foodLifetime) {
    const [foods, setFoods] = useState([]);
    const foodId = useRef(0);

    const removeFoodIfExists = (foodToRemove) => {
        setFoods((foods) => foods.filter(food => !(food.id === foodToRemove.id)));
    }

    useEffect(() => {
        const createNewFood = () => {
            let newFood = getRandomCell(grid.current.width, grid.current.height);

            while ([CellType.Food, CellType.Snake].includes(getCellType(grid, newFood))) {
                newFood = getRandomCell(grid.current.width, grid.current.height);
            }

            newFood.id = foodId.current;
            foodId.current += 1;

            setTimeout(() => removeFoodIfExists(newFood), foodLifetime);
            setFoods(foods => [...foods, newFood]);
        };

        createNewFood();
        const foodGeneratorInterval = setInterval(createNewFood, foodGenerationInterval);

        return () => {
            clearInterval(foodGeneratorInterval);
        }
    }, []);

    return [foods, removeFoodIfExists];
}

function useSnakeGameLogic(defaultSnake, {width, height, foodLifetime, foodGenerationInterval}) {
    const initialGameState = {
        snake: defaultSnake,
        direction: Direction.Right,
        score: 0
    };

    const grid = useRef(makeGrid(width, height));

    const [foods, removeFoodIfExists] = useFoodsLogic(grid, foodGenerationInterval, foodLifetime);

    const [snakeState, snakeStateDispatch] = useReducer((gameState, action) => {
        switch (action.type) {
            case 'moveSnake':
                return { ...gameState, snake: getNextSnake(gameState.snake, gameState.direction) }
            case 'increaseScore':
                return { ...gameState, score: gameState.score + 1 };
            case 'changeDirection':
                return { ...gameState, direction: chooseNextDirection(gameState.direction, action.direction) };
            case 'reset':
                return {...initialGameState};
            default:
                return {...gameState};
        }
    }, initialGameState);

    useEffect(() => {
        grid.current = updateGrid(grid.current, snakeState.snake, foods);
    }, [snakeState, foods]);

    function isFoodCell({ x, y }) {
        return foods.find(food => food.x === x && food.y === y);
    }

    function isSnakeCell({ x, y }) {
        return snakeState.snake.find((position) => position.x === x && position.y === y);
    }

    function isInvalidSnake(snake) {
        const head = snake[0];

        return snake.slice(1).find((position) => position.x === head.x && position.y === head.y);
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
            const emptyCell = {type: CellType.Empty};
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

    snake.forEach(({x, y}) => {
        currentGrid[x][y].type = CellType.Snake;
    })

    foods.forEach(({x, y}) => {
        currentGrid[x][y].type = CellType.Food;
    })

    return currentGrid;
}

function getRandomCell(width, height) {
    return {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
    }
}

export default useSnakeGameLogic;
