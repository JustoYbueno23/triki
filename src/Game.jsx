import React, { useState, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Board from './components/Board'
import Footer from './components/Footer'

/**
 * Funcion auxiliar que verifica si hay un ganador en el tablero
 * @param {Array} squares
 * @returns {Object}
 */

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]

    for (const [a, b, c] of lines) {
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: [a, b, c] }
        }
    }

    return { winner: null, line: null }
}

function Game() {
    const [squares, setSquares] = useState(Array(9).fill(null))
    const [xIsNext, setXIsNext] = useState(true)
    const [history, setHistory] = useState([Array(9).fill(null)])
    const [gameMode, setGameMode] = useState('pvp')
    const [stepNumber, setStepNumber] = useState(0)
    const computerTimer = useRef(null)

    const { winner, line } = calculateWinner(squares)
    const isDraw = !winner && squares.every(square => square !== null)

    /**
     * Maneja el clic en una celda
     * @param {number} i
     */
    function handleClick(i) {
        if (squares[i] || winner || isDraw) return
        // Contra la computadora solo juega el humano (X)
        if (gameMode === 'computer' && !xIsNext) return

        const newSquares = squares.slice()
        newSquares[i] = xIsNext ? 'X' : 'O'

        setSquares(newSquares)
        setXIsNext(!xIsNext)
        setHistory(prev => [...prev.slice(0, stepNumber + 1), newSquares])
        setStepNumber(stepNumber + 1)

        const next = calculateWinner(newSquares)
        const boardFull = newSquares.every(s => s !== null)

        if (gameMode === 'computer' && !next.winner && !boardFull) {
            clearTimeout(computerTimer.current)
            computerTimer.current = setTimeout(() => makeComputerMove(newSquares, stepNumber + 1), 500)
        }
    }

    /**
     * Jugada aleatoria de la computadora (marca 'O')
     * @param {Array} currentSquares
     * @param {number} fromStep paso del historial del que parte la jugada
     */
    function makeComputerMove(currentSquares, fromStep = stepNumber) {
        const emptySquares = currentSquares
            .map((sq, idx) => (sq === null ? idx : null))
            .filter(idx => idx !== null)
        if (emptySquares.length === 0) return

        const computerSquares = currentSquares.slice()
        const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)]
        computerSquares[randomIndex] = 'O'

        setSquares(computerSquares)
        setXIsNext(true)
        // Trunca el historial a partir del salto para no mezclar líneas de tiempo
        setHistory(prev => [...prev.slice(0, fromStep + 1), computerSquares])
        setStepNumber(fromStep + 1)
    }

    function cancelComputerMove() {
        clearTimeout(computerTimer.current)
        computerTimer.current = null
    }

    function resetGame() {
        cancelComputerMove()
        setSquares(Array(9).fill(null))
        setXIsNext(true)
        setHistory([Array(9).fill(null)])
        setStepNumber(0)
    }

    /**
     * Cambia el modo de juego y reinicia la partida
     * @param {'pvp' | 'computer'} mode
     */
    function changeGameMode(mode) {
        setGameMode(mode)
        resetGame()
    }

    /**
     * Retrocede o avanza a un movimiento del historial
     * @param {number} step
     */
    function jumpTo(step) {
        cancelComputerMove()
        const board = history[step]
        setSquares(board)
        setStepNumber(step)
        setXIsNext(step % 2 === 0)

        // Modo computadora: si tras el salto le toca a la IA, reprograma su jugada
        const next = calculateWinner(board)
        const boardFull = board.every(s => s !== null)
        if (gameMode === 'computer' && step % 2 === 1 && !next.winner && !boardFull) {
            computerTimer.current = setTimeout(() => makeComputerMove(board, step), 500)
        }
    }

    function getStatus() {
        if (winner) return `¡Ganador: ${winner}!`
        if (isDraw) return '¡Empate!'
        return `Turno de: ${xIsNext ? 'X' : 'O'}`
    }

    return (
        <ScrollView style={styles.gameScroll} contentContainerStyle={styles.game}>
            <Text style={styles.gameTitle}>Triki</Text>

            <View style={styles.gameMode}>
                <Pressable
                    style={[styles.modeBtn, gameMode === 'pvp' && styles.modeBtnActive]}
                    onPress={() => changeGameMode('pvp')}
                >
                    <Text style={[styles.modeBtnText, gameMode === 'pvp' && styles.modeBtnTextActive]}>
                        2 Jugadores
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.modeBtn, gameMode === 'computer' && styles.modeBtnActive]}
                    onPress={() => changeGameMode('computer')}
                >
                    <Text style={[styles.modeBtnText, gameMode === 'computer' && styles.modeBtnTextActive]}>
                        vs Computadora
                    </Text>
                </Pressable>
            </View>

            <View style={styles.gameInfo}>
                <View style={[styles.status, winner && styles.statusWinner, isDraw && styles.statusDraw]}>
                    <Text style={styles.statusText}>{getStatus()}</Text>
                </View>
            </View>

            <Board
                squares={squares}
                winningLine={line}
                onSquareClick={handleClick}
            />

            <Pressable style={styles.resetBtn} onPress={resetGame}>
                <Text style={styles.resetBtnText}>Reiniciar Juego</Text>
            </Pressable>

            {history.length > 1 && (
                <View style={styles.history}>
                    <Text style={styles.historyTitle}>Historial de Jugadas</Text>
                    <View style={styles.historyList}>
                        {history.map((_, step) => (
                            <Pressable
                                key={step}
                                style={[styles.historyBtn, step === stepNumber && styles.historyBtnCurrent]}
                                onPress={() => jumpTo(step)}
                            >
                                <Text
                                    style={[
                                        styles.historyBtnText,
                                        step === stepNumber && styles.historyBtnCurrentText,
                                    ]}
                                >
                                    {step === 0 ? 'Inicio' : `Movimiento ${step}`}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            )}

            <Footer />
        </ScrollView>
    )
}

export default Game

/**
 * Estilos migrados desde src/Game.css (React Native no admite archivos .css)
 * Los gradientes se aproximan con un color solido equivalente.
 */
const styles = StyleSheet.create({
    gameScroll: {
        flex: 1,
        backgroundColor: '#667eea',
    },
    game: {
        alignItems: 'center',
        gap: 24,
        paddingVertical: 32,
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    gameTitle: {
        fontSize: 40,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    gameMode: {
        flexDirection: 'row',
        gap: 12,
    },
    modeBtn: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    modeBtnActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
    },
    modeBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    modeBtnTextActive: {
        color: '#667eea',
    },
    gameInfo: {
        alignItems: 'center',
        gap: 8,
    },
    status: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    statusWinner: {
        backgroundColor: '#10b981',
    },
    statusDraw: {
        backgroundColor: '#f59e0b',
    },
    statusText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
    resetBtn: {
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 14,
        backgroundColor: '#f43f5e',
        shadowColor: '#f43f5e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 6,
    },
    resetBtnText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    history: {
        alignItems: 'center',
        gap: 12,
        marginTop: 16,
    },
    historyTitle: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
    historyList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
    },
    historyBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    historyBtnCurrent: {
        backgroundColor: '#fff',
    },
    historyBtnText: {
        fontSize: 14,
        color: '#fff',
    },
    historyBtnCurrentText: {
        color: '#667eea',
        fontWeight: '600',
    },
})