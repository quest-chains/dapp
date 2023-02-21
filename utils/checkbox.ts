import { checkboxAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const circular = definePartsStyle({
  control: defineStyle({
    rounded: 'full',
    borderWidth: '1.5px',
    padding: '0.5rem',
    transform: 'scale(0.9)',
  }),
});

const baseStyle = definePartsStyle({
  control: {
    borderWidth: '1.5px',
    _checked: {
      backgroundColor: 'transparent',
      borderWidth: '1.5px',
      color: 'white',
      _hover: {
        bg: 'transparent',
        borderColor: 'white',
      },
      borderColor: 'white',
    },
  },
});

export const checkboxTheme = defineMultiStyleConfig({
  baseStyle,
  variants: { circular },
});
