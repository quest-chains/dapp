import { extendTheme } from '@chakra-ui/react';
import { css } from '@emotion/react';

const Input = {
  variants: {
    outline: {
      field: {
        _focus: {
          borderColor: 'transparent',
          boxShadow: '0px 0px 0px 2px #AD90FF',
        },
      },
    },
  },
};

export const theme = extendTheme({
  breakpoints: {
    '3xl': '108em',
    '2xl': '96em',
    base: '0em',
    lg: '62em',
    md: '48em',
    sm: '30em',
    xl: '80em',
  },
  sizes: {
    '9xl': '108rem',
    '10xl': '120em',
  },
  fonts: {
    heading: `'Museo Moderno', sans-serif`,
    // body: `'Baumans Regular', sans-serif`,
  },
  colors: {
    main: '#2DF8C7',
    pending: '#EFFF8F',
    rejected: '#FD86FF',
    neutral: '#BCBCBC',
  },
  shadows: {
    outline: '0px 0px 0px 2px #AD90FF',
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  components: {
    Input,
  },
});

export const globalStyles = css`
  body {
    background: #0d1117;
    overflow-x: hidden;
  }
`;
