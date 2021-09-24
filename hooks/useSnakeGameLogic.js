import Direction, { chooseNextDirection, getNextCell } from "../types/direction";
import { useEffect, useReducer, useRef, useState } from "react";

function useSnakeGameLogic(config) {
    const getRandomCell = () => ({
        x: Math.floor(Math.random() * config.width),
        y: Math.floor(Math.random() * config.height),
    });

    const getDefaultSnake = () => [
        { x: 2, y: 3 },
        { x: 1, y: 3 },
        { x: 0, y: 3 },
    ];

    const initialGameState = {
        snake: getDefaultSnake(),
        direction: Direction.Right,
        score: 0
    };

    const [foods, setFoods] = useState([]);
    const foodId = useRef(0);

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

    function isFoodCell({ x, y }) {
        return foods.find(food => food?.x === x && food?.y === y);
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
        const newHead = getNextCell(head, direction, config);

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
        setFoods((foods) => foods.filter(food => !(food.id === foodToRemove.id)));
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

    useEffect(() => {
        const createNewFood = () => {
            let newFood = getRandomCell();
            while (isSnakeCell(newFood) || isFoodCell(newFood)) {
                newFood = getRandomCell();
            }

            newFood.id = foodId.current;
            foodId.current += 1;

            setTimeout(() => removeFoodIfExists(newFood), config.foodLifetime);
            addFood(newFood);
        };

        createNewFood();
        const foodGeneratorInterval = setInterval(createNewFood, config.foodGenerationInterval);

        return () => {
            clearInterval(foodGeneratorInterval);
        }
    }, []);

    return [snakeState.snake, foods, snakeState.score, changeDirection, isFoodCell, isSnakeCell];
}

export default useSnakeGameLogic;
