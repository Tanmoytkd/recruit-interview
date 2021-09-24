import styles from "../styles/Snake.module.css";
import CellType from "../types/cellType";

const Cell = ({ x, y, type, cellSize }) => {
    const getStyles = () => {
        switch (type) {
            case CellType.Snake:
                return {
                    backgroundColor: "yellowgreen",
                    borderRadius: 8,
                    padding: 2,
                };

            case CellType.Food:
                return {
                    backgroundColor: "darkorange",
                    borderRadius: 20,
                    width: 32,
                    height: 32,
                };

            default:
                return {};
        }
    };
    return (
        <div
            className={styles.cellContainer}
            style={{
                left: x * cellSize,
                top: y * cellSize,
                width: cellSize,
                height: cellSize,
            }}
        >
            <div className={styles.cell} style={getStyles()} />
        </div>
    );
};

export default Cell;
