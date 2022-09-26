/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Code,
  Divider,
  Heading,
  Image,
  Link,
  Spacer,
  Table,
  Th,
} from '@chakra-ui/react';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type MarkdownViewerProps = { markdown: string };

const heading: Components['h1'] = props => {
  const { level } = props;
  const sizes = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  return (
    <Heading
      my={4}
      as={`h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'}
      size={sizes[level - 1]}
      {...props}
    />
  );
};

const markdownTheme: Components = {
  a: props => {
    return <Link color="main" isExternal {...props} />;
  },
  h1: heading,
  h2: heading,
  h3: heading,
  h4: heading,
  h5: heading,
  h6: heading,
  hr: () => <Divider borderBottomWidth="4px" my={2} />,
  blockquote: props => {
    return (
      <Box
        w="full"
        as="blockquote"
        p={2}
        pb="1px"
        borderLeft="4px solid"
        borderColor="inherit"
        my={2}
      >
        {props.children}
      </Box>
    );
  },
  table: props => <Table w="auto" {...props} />,
  th: props => <Th fontFamily="body">{props.children}</Th>,
  br: () => <Spacer />,
  // eslint-disable-next-line jsx-a11y/alt-text
  img: props => <Image w="100%" {...props} />,
  p: props => (
    <p
      style={{
        fontSize: '16px',
      }}
      {...props}
    >
      {props.children}
    </p>
  ),
  code: props => {
    const { inline } = props;

    if (inline) {
      return <Code {...props} />;
    }

    return (
      <Code
        whiteSpace="break-spaces"
        display="block"
        w="full"
        px={4}
        py={2}
        my={2}
        {...props}
      />
    );
  },
};

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ markdown }) => (
  <Box w="100%" color="white">
    <ReactMarkdown
      components={{ ...ChakraUIRenderer(), ...markdownTheme }}
      remarkPlugins={[remarkGfm]}
      skipHtml
    >
      {markdown}
    </ReactMarkdown>
  </Box>
);
