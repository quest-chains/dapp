import { extendTheme } from '@chakra-ui/react';
import { css } from '@emotion/react';

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
    heading: `'Nineties Display', sans-serif`,
    body: `'Baumans Regular', sans-serif`,
  },
  colors: {
    main: '#2DF8C7',
    pending: '#EFFF8F',
    rejected: '#FD86FF',
    neutral: '#BCBCBC',
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

export const globalStyles = css`
  /*
    This will hide the focus indicator if the element receives focus 
    via the mouse, but it will still show up on keyboard focus.
  */
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }
  body {
    background: #0d1117;
    overflow-x: hidden;
  }
`;
