import { BoxProps, Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { MarkdownViewer } from '../MarkdownViewer';

const Editor = dynamic(() => import('./MarkdownEditor'), {
  ssr: false,
});

type EditorProps = {
  value: string;
  height?: string;
  placeholder?: string;
  onChange: (newValue: string) => void;
  isDisabled?: boolean;
};

export const MarkdownEditor: React.FC<
  EditorProps & Omit<BoxProps, keyof EditorProps>
> = ({
  value,
  placeholder,
  height,
  onChange,
  isDisabled = false,
  ...props
}) => (
  <Flex w="100%" {...(isDisabled ? { cursor: 'not-allowed' } : {})} {...props}>
    <Editor
      style={{
        pointerEvents: isDisabled ? 'none' : 'unset',
        height: height ?? '20rem',
        width: '100%',
        background: '#0F172A',
      }}
      defaultValue={value}
      placeholder={placeholder}
      renderHTML={text => <MarkdownViewer markdown={text} />}
      onChange={({ text }) => onChange(text)}
      htmlClass="nonexistant-class"
      readOnly={isDisabled}
      view={{
        menu: true,
        md: true,
        html: false,
      }}
    />
  </Flex>
);
