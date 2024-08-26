import {
  createMultiStyleConfigHelpers,
  defineStyleConfig,
  extendTheme,
  StyleFunctionProps,
  type ThemeConfig,
} from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import {
  alertAnatomy,
  accordionAnatomy,
  menuAnatomy,
  modalAnatomy,
  popoverAnatomy,
  switchAnatomy,
} from '@chakra-ui/anatomy';

// Theme configuration
const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

// Font settings
const fonts = {
  heading:
    "Now, BlinkMacSystemFont, 'Segoe UI', Raleway, Helvetica, Arial, sans-serif",
  body: "Raleway, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
};

// Color palette
export const colors = {
  brand: {
    50: '#ffe8df',
    100: '#ffccb5',
    200: '#ffaf88',
    300: '#ff925a',
    400: '#ff7e3e', // Primary brand color
    500: '#e66427',
    600: '#b34f1f',
    700: '#803917',
    800: '#4e230e',
    900: '#1f0b03',
  },
  success: {
    50: '#e5f9e7',
    100: '#b9efc2',
    200: '#8be39b',
    300: '#5ed674',
    400: '#30ca4d',
    500: '#18b134',
    600: '#0d8b27',
    700: '#046319',
    800: '#003d0b',
    900: '#001700',
  },
  error: {
    50: '#ffe5e7',
    100: '#ffb8bc',
    200: '#ff8b8f',
    300: '#ff5d61',
    400: '#ff3035',
    500: '#e6171c',
    600: '#b31013',
    700: '#80080c',
    800: '#4e0004',
    900: '#200000',
  },
  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    850: '#1f1f23',
    900: '#18181b',
  },
  blue: {
    50: '#e0edff',
    100: '#b0caff',
    200: '#7ea6ff',
    300: '#4b83ff',
    400: '#1a5fff',
    500: '#0042da',
    600: '#0036b4',
    700: '#002782',
    800: '#001751',
    900: '#1a202c',
  },
  orange: {
    50: '#fff1da',
    100: '#ffd7ae',
    200: '#ffbf7d',
    300: '#ffa54c',
    400: '#ff8b1a',
    500: '#e67200',
    600: '#b45800',
    700: '#813e00',
    800: '#4f2500',
    900: '#200b00',
  },
  yellow: {
    50: '#fff9da',
    100: '#ffedad',
    200: '#ffe17d',
    300: '#ffd54b',
    400: '#ffc91a',
    500: '#e6b000',
    600: '#b38800',
    700: '#806200',
    800: '#4e3a00',
    900: '#1d1400',
  },
};

// Component configurations
const Modal = createMultiStyleConfigHelpers(
  modalAnatomy.keys
).defineMultiStyleConfig({
  baseStyle: ({ colorMode }) => ({
    dialog: { bg: colorMode === 'dark' ? 'gray.800' : 'white' },
  }),
});

const Popover = createMultiStyleConfigHelpers(
  popoverAnatomy.keys
).defineMultiStyleConfig({
  baseStyle: ({ colorMode }) => ({
    popper: {
      width: 'fit-content',
      maxWidth: 'fit-content',
    },
    content: {
      bg: colorMode === 'dark' ? 'gray.800' : 'white',
    },
  }),
});

const Menu = createMultiStyleConfigHelpers(
  menuAnatomy.keys
).defineMultiStyleConfig({
  baseStyle: ({ colorMode }) => ({
    list: {
      shadow: 'lg',
      bg: colorMode === 'dark' ? 'gray.800' : 'white',
    },
    item: {
      bg: colorMode === 'dark' ? 'gray.800' : 'white',
      _hover: {
        bg: colorMode === 'dark' ? 'gray.700' : 'gray.100',
      },
    },
  }),
});

const Accordion = createMultiStyleConfigHelpers(
  accordionAnatomy.keys
).defineMultiStyleConfig({
  baseStyle: ({ colorMode }) => ({
    button: {
      _hover: {
        bg: colorMode === 'dark' ? 'gray.800' : 'gray.100',
      },
    },
  }),
});

const Button = defineStyleConfig({
  baseStyle: ({ colorMode }) => ({
    fontFamily: 'Now',
    bg: colorMode === 'dark' ? 'gray.800' : 'white',
  }),
  variants: {
    solid: ({ colorMode, colorScheme }) => {
      let bgColor =  colorMode === 'dark' ? 'brand.400' : 'brand.400'
      if (colorScheme === 'success') bgColor = 'success.500';
      if (colorScheme === 'error') bgColor = 'error.500';

      return {
        bg: bgColor,
        color: 'white',
        _hover: {
          bg: `${bgColor}.600`,
        },
        _active: {
          bg: `${bgColor}.700`,
        },
      };
    },
    outline: {
      bg: 'transparent',
    },
    ghost: {
      bg: 'transparent',
    },
  },
});

const Input = defineStyleConfig({
  baseStyle: {
    field: {
      fontWeight: "bold",
    },
  },
  variants: {
    outline: {
      field: {
        border: "2px solid",
        borderColor: "gray.300", // Default border color
        _hover: {
          borderColor: "brand.400", // Color when hovering over the input
        },
        _focus: {
          borderColor: "brand.400", // Brand color on focus
          boxShadow: `0 0 0 1px #ff7e3e`, // Focus ring effect
        },
        _focusVisible: {
          borderColor: 'brand.400', // Ensures brand color on focus-visible
          boxShadow: `0 0 0 1px #ff7e3e`, // Focus ring effect
        },
      },
    },
  },
});



const Alert = createMultiStyleConfigHelpers(
  alertAnatomy.keys
).defineMultiStyleConfig({
  variants: {
    subtle: ({ colorScheme, colorMode }) => {
      if (colorScheme === 'brand' || colorMode === 'dark') {
        return {
          container: {
            bg: colorScheme === 'brand' ? 'brand.50' : 'gray.800',
          },
        };
      }
      return {};
    },
  },
  baseStyle: {
    container: {
      borderRadius: 'md',
    },
  },
});

const Switch = createMultiStyleConfigHelpers(
  switchAnatomy.keys
).defineMultiStyleConfig({
  baseStyle: ({ colorMode, colorScheme }) => ({
    track: {
      _checked: {
        bg: colorMode === 'dark' ? `${colorScheme}.400` : `${colorScheme}.500`,
      },
    },
  }),
});

// All components
const components = {
  Modal,
  Popover,
  Menu,
  Button,
  Accordion,
  Alert,
  Switch,
  Spinner: {
    defaultProps: {
      colorScheme: 'brand',
    },
  },
  NumberInput: {
    baseStyle: {
      focusBorderColor: 'brand.200',
    },
  },
  Input, // Ensure Input is correctly added here
  Textarea: {
    baseStyle: {
      focusBorderColor: 'brand.200',
    },
  },
  Link: {
    baseStyle: {
      _hover: { textDecoration: 'none' },
    },
  },
  Tooltip: {
    baseStyle: {
      rounded: 'md',
    },
  },
};

// Global styles
const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      bg: mode("#f5f0f0", 'gray.900')(props),
      color: mode('gray.800', 'gray.100')(props),
      fontFamily: 'Raleway',
    },
    h1: {
      fontFamily: 'Now',
    },
    button: {
      fontFamily: 'Now',
    },
  }),
};

// Export the custom theme
export const customTheme = extendTheme({
  colors,
  fonts,
  components,
  config,
  styles,
});
