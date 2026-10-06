Triki — Tres en Línea
Expo + React Native · Android · iOS · Web
Triki (Tic-Tac-Toe / Tres en línea) hecho con Expo + React Native. Funciona en Android, iOS y Web, con modo de 2 jugadores, modo contra la computadora y un historial de jugadas navegable (time-travel).
Creado por Juan Medina.
Tabla de contenidos
1.	Características
2.	Inicio rápido
3.	Stack tecnológico
4.	Estructura del proyecto
5.	Cómo funciona
6.	Scripts disponibles
7.	Builds con EAS
8.	Personalización
9.	Roadmap
10.	Contribuir
11.	Licencia y autor
Características
•	Tablero 3×3 responsive: las celdas se adaptan al ancho de pantalla con useWindowDimensions.
•	Dos modos de juego: 2 Jugadores (partida local, X contra O) y vs Computadora (tú juegas con X; la IA juega con O con movimiento aleatorio y 500 ms de retraso).
•	Detección de ganador en las 8 líneas posibles, con resaltado de la línea ganadora.
•	Detección de empate cuando el tablero se llena sin ganador.
•	Historial navegable: salta a cualquier movimiento (Inicio, Movimiento 1…n) sin romper la línea temporal.
•	Reinicio seguro: al reiniciar se cancelan los turnos pendientes de la IA.
•	Banner de estado con colores distintos para turno, ganador y empate.
•	Accesibilidad básica: accessibilityRole y accessibilityLabel en cada celda.
•	Estilos 100 % StyleSheet de React Native.
Inicio rápido
Requisitos: Node.js LTS (18 o superior), npm y, opcionalmente, la app Expo Go en tu celular o un emulador.
# 1. Clonar el repositorio
git clone <URL_DEL_REPO>
cd Triki
 
# 2. Instalar dependencias
npm install
 
# 3. (Opcional) Verificar el entorno
npx expo-doctor
 
# 4. Iniciar el servidor de desarrollo
npx expo start
Atajos del servidor de desarrollo
Tecla	Acción
Escanear QR con Expo Go	Abrir en tu celular
a	Android Emulator
i	iOS Simulator
w	Navegador web
r	Recargar
m	Menú de desarrollo

Cómo jugar
•	Elige el modo: 2 Jugadores o vs Computadora.
•	Toca una celda vacía para colocar tu marca.
•	Gana quien complete una fila, columna o diagonal.
•	Usa Reiniciar Juego o el Historial de Jugadas para volver atrás.
Nota: el proyecto no incluye carpetas nativas ios/ ni android/ (Continuous Native Generation); la configuración vive en app.json. Si añades una librería con código nativo necesitarás un development build:
npx expo run:android
npx expo run:ios
# o en la nube
npx eas-cli@latest build --profile development
Stack tecnológico
Tecnología	Versión	Uso
expo	~57.0.26	Framework y toolchain
react	19.2.3	UI y hooks (useState, useRef)
react-native	0.86.3	View, Text, Pressable, ScrollView, Image, StyleSheet
expo-status-bar	~57.0.1	Barra de estado

Sin dependencias de navegación, estado global ni backend: todo el estado vive en src/Game.jsx.
Estructura del proyecto
Triki/
├── App.js                   # Entrada: contenedor + <Game /> + <StatusBar>
├── index.js                 # registerRootComponent(App)
├── app.json                 # Configuración Expo
├── package.json
├── AGENTS.md                # Reglas del workspace
├── assets/                  # Icono, splash, favicon, iconos Android
├── public/img/
│   └── IconoJuanMedina.png  # Logo del footer
└── src/
    ├── Game.jsx             # Estado, turnos, IA e historial
    └── components/
        ├── Board.jsx        # Grilla 3×3 responsive
        ├── Square.jsx       # Celda con colores X/O y estado ganador
        └── Footer.jsx       # Firma, logo y año dinámico
Archivos legacy: src/main.jsx y los *.css provienen de una versión web con Vite/ReactDOM. Se conservan solo como referencia y no se usan en la app Expo; puedes eliminarlos sin afectar el juego.
Cómo funciona
Estado (src/Game.jsx)
Variable	Tipo	Descripción
squares	Array(9) de 'X' | 'O' | null	Tablero actual
xIsNext	boolean	De quién es el turno
history	Array de Array(9)	Instantáneas para time-travel
gameMode	'pvp' | 'computer'	Modo de juego activo
stepNumber	number	Posición actual dentro de history

Funciones clave
Función	Descripción
calculateWinner(squares)	Revisa las 8 combinaciones ganadoras y retorna { winner, line }
handleClick(i)	Valida la celda, aplica la jugada y programa a la IA si le toca
makeComputerMove(board, fromStep)	Elige una celda vacía al azar, marca O y trunca el historial
jumpTo(step)	Viaja a un movimiento anterior y reprograma la IA si le toca a O
resetGame() / changeGameMode(mode)	Reinicia el tablero y cancela el setTimeout pendiente
getStatus()	Devuelve Turno de: X/O, ¡Ganador: X! o ¡Empate!

Tablero responsive (src/components/Board.jsx)
const HORIZONTAL_RESERVE = 88; // paddings + gaps
const cellSize = clamp(64, 110, (width - HORIZONTAL_RESERVE) / 3);
El tamaño de celda se mantiene entre 64 y 110 px, de modo que el tablero 3×3 siempre cabe sin scroll horizontal.
Scripts disponibles
Script	Comando	Descripción
npm start	expo start	Servidor de desarrollo
npm run android	expo start --android	Abre en Android
npm run ios	expo start --ios	Abre en iOS
npm run web	expo start --web	Abre en web

Comandos de diagnóstico útiles:
npx expo-doctor         # Revisa la salud del proyecto
npx expo install --fix  # Alinea dependencias con el SDK
npx tsc --noEmit        # Si migras a TypeScript
npx expo lint           # Si agregas eslint-config-expo
Builds con EAS
# Iniciar sesión y configurar
npx eas-cli@latest login
npx eas-cli@latest build:configure
 
# Builds en la nube
npx eas-cli@latest build --platform android
npx eas-cli@latest build --platform ios
npx eas-cli@latest build --platform all
 
# Actualizaciones OTA
npx eas-cli@latest update --branch preview --message "Fix turno IA"
Documentación: https://docs.expo.dev/eas/
Personalización
Qué	Dónde	Detalle
Color de fondo	App.js y src/Game.jsx	#667eea
Colores de marcas	src/components/Square.jsx	X #6366f1, O #ec4899
Tamaño de celda	src/components/Board.jsx	HORIZONTAL_RESERVE, mín 64, máx 110
Dificultad de la IA	makeComputerMove	Hoy es aleatoria; reemplázala por Minimax
Logo del footer	src/components/Footer.jsx	Apunta a public/img/IconoJuanMedina.png

Roadmap
☐  IA con Minimax (fácil / medio / imposible)
☐  Marcador persistente de victorias, derrotas y empates (AsyncStorage)
☐  Sonidos y haptics (expo-haptics, expo-audio)
☐  Migrar a Expo Router (src/app/)
☐  Migrar a TypeScript (.tsx) y ESLint
☐  Tests unitarios para calculateWinner (Jest)
☐  Animación de la línea ganadora y confeti
☐  Soporte para landscape/tablet y modo oscuro
Contribuir
1.	Haz un fork del repositorio.
2.	Crea una rama: git checkout -b feature/mi-mejora.
3.	Haz commit de tus cambios: git commit -m "feat: descripción".
4.	Sube la rama y abre un Pull Request.
¿Encontraste un error o tienes una idea? Abre un issue.
Licencia y autor
Este repositorio incluye la licencia MIT de Expo (LICENSE), heredada del template inicial. Si lo publicas como proyecto propio, considera reemplazarla por Copyright (c) <año> Juan Medina.
Juan Medina — Desarrollador de Triki.
