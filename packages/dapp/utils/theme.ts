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
    headingLight: `'Museo Moderno Light', sans-serif`,
    // body: `'Baumans Regular', sans-serif`,
  },
  colors: {
    main: '#2DF8C7',
    ['main.100']: '#2DF8C710',
    ['main.200']: '#2DF8C720',
    ['main.300']: '#2DF8C730',
    ['main.400']: '#2DF8C740',
    ['main.500']: '#2DF8C750',
    ['main.600']: '#2DF8C760',
    ['main.700']: '#2DF8C770',
    ['main.800']: '#2DF8C780',
    ['main.900']: '#2DF8C790',
    ['main.950']: '#2DF8C795',
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
  /* width */
  ::-webkit-scrollbar {
    width: 8px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #444444;
    border-radius: 2.5px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #2df8c7;
    border-radius: 2.5px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #1f7165;
  }
  body {
    scrollbar-color: #2df8c7 #444444;
    ::-webkit-scrollbar-track {
      background: #444444;
      border-radius: 0px;
    }
    background: #0d1117;
    overflow-x: hidden;
  }
`;
