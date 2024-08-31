// theme.js

// 1. import `extendTheme` function
import { extendTheme } from '@chakra-ui/react'

// 2. Add your color mode config

const colors = {
    customGreen: {
        100: '#1DB954'
    },
    customBlack: {
        50: '#000000'
    },
    customRed: {
        50: '#FA2D48'
    }
}

// 3. extend the theme
const theme = extendTheme({ 
    styles: {
        global: {
          body: {
            bg: '#28282b',
            color: 'white', // Setting text color to white for better contrast
          },
        },
    },
   colors: colors
})

export default theme