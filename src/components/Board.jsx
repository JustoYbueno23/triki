import { StyleSheet, useWindowDimensions, View } from 'react-native'
import Square from './Square'

/**
 * Tablero 3x3 del juego
 * @param {Array} squares
 * @param {Array} winningLine
 * @param {function} onSquareClick
 */

// Reserva: padding del juego (16*2) + padding del tablero (16*2) + huecos (12*2)
const HORIZONTAL_RESERVE = 88

function Board({ squares, winningLine, onSquareClick }) {
    const { width } = useWindowDimensions()
    // Las celdas se calculan para que el tablero siempre quepa en la pantalla
    const cellSize = Math.max(64, Math.min(110, Math.floor((width - HORIZONTAL_RESERVE) / 3)))

    // Renderiza el tablero de 3x3
    const renderSquare = (i) => {
        const isWinning = winningLine && winningLine.includes(i)
        return (
            <Square
                key={i}
                value={squares[i]}
                isWinning={isWinning}
                size={cellSize}
                onClick={() => onSquareClick(i)}
            />
        )
    }

    // Crear las filas del tablero
    const rows = [0, 1, 2].map(row => (
        <View key={row} style={styles.boardRow}>
            {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
        </View>
    ))
    return <View style={styles.board}>{rows}</View>
}
export default Board

/**
 * Estilos migrados desde src/components/Board.css
 */
const styles = StyleSheet.create({
    board: {
        gap: 12,
        padding: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    boardRow: {
        flexDirection: 'row',
        gap: 12,
    },
})