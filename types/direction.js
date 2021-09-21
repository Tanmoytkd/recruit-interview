const Direction = {
    Left: { x: -1, y: 0 },
    Right: { x: 1, y: 0 },
    Top: { x: 0, y: -1 },
    Bottom: { x: 0, y: 1 },
};

export function oppositeDirection(direction) {
    if (direction === Direction.Left) {
        return Direction.Right;
    } else if (direction === Direction.Right) {
        return Direction.Left;
    } else if (direction === Direction.Top) {
        return Direction.Bottom;
    } else if (direction === Direction.Bottom) {
        return Direction.Top;
    }
}

export function getNextCell({ x, y }, direction, { height, width }) {
    let nextX = (x + direction.x + width) % width;
    let nextY = (y + direction.y + height) % height;
    return { x: nextX, y: nextY }
}

export function chooseNextDirection(currentDirection, newDirection) {
    return (newDirection !== oppositeDirection(currentDirection)) ? newDirection : currentDirection;
}

export default Direction;
