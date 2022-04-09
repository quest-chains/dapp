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
  fonts: {
    heading: 'NinetiesDisplay',
  },
  colors: {
    main: '#2DF8C7',
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
  @font-face {
    font-family: 'NinetiesDisplay';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url('./fonts/NinetiesDisplay.otf');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
      U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212,
      U+2215, U+FEFF, U+FFFD;
  }
`;
