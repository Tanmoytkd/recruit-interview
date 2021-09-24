import CellType from "../types/cellType";
import { useEffect, useRef, useState } from "react";

function getCellType(grid, { x, y }) {
    return grid.current[x][y].type;
}

function useFoodGenerator(grid, foodGenerationInterval, foodLifetime) {
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

function getRandomCell(width, height) {
    return {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
    }
}

export default useFoodGenerator;
