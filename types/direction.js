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

export default Direction;
