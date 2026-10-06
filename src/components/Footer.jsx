import { Image, StyleSheet, Text, View } from 'react-native'

function Footer() {
    return (
        <View style={styles.footer}>
            <View style={styles.footerContent}>
                <View style={styles.footerLogo}>
                    <Image
                        source={require('../../public/img/IconoJuanMedina.png')}
                        style={styles.footerLogoImg}
                    />
                </View>
                <View style={styles.footerText}>
                    <Text style={styles.footerName}>Realizado por Juan Medina</Text>
                    <Text style={styles.footerCopy}> {new Date().getFullYear()} Juego Triki</Text>
                </View>
            </View>
        </View>
    )
}

export default Footer

/**
 * Estilos migrados desde src/components/Footer.css
 */
const styles = StyleSheet.create({
    footer: {
        marginTop: 24,
        padding: 20,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    footerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    footerLogo: {
        flexDirection: 'row',
    },
    footerLogoImg: {
        width: 50,
        height: 50,
        borderRadius: 12,
    },
    footerText: {
        gap: 4,
    },
    footerName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footerCopy: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
})