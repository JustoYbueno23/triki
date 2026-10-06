import { Pressable, StyleSheet, Text } from 'react-native'

/**
 * @param {string} value
 * @param {boolean} isWinning
 * @param {number} size
 * @param {function} onClick
 */

function Square({ value, isWinning, size, onClick }) {
    const mark = value?.toLowerCase()

    return (
        <Pressable
            style={[
                styles.square,
                { width: size, height: size },
                mark === 'x' && styles.squareX,
                mark === 'o' && styles.squareO,
                isWinning && styles.squareWinning,
            ]}
            onPress={onClick}
            accessibilityRole="button"
            accessibilityLabel={value ? `Celda con ${value}` : 'Celda vacía'}
        >
            <Text style={[styles.squareText, mark === 'x' && styles.textX, mark === 'o' && styles.textO]}>
                {value}
            </Text>
        </Pressable>
    )
}

export default Square

/**
 * Estilos migrados desde src/components/Square.css
 * El ancho/alto llega desde Board para que el tablero quepa en cualquier pantalla.
 */
const styles = StyleSheet.create({
    square: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    squareX: {
        backgroundColor: '#e0e7ff',
    },
    squareO: {
        backgroundColor: '#e0e7ff',
    },
    squareWinning: {
        shadowColor: '#6366f1',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
    },
    squareText: {
        fontSize: 40,
        fontWeight: '700',
        color: '#6366f1',
    },
    textX: {
        color: '#6366f1',
    },
    textO: {
        color: '#ec4899',
    },
})