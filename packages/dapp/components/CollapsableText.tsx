import { Box, useBoolean } from '@chakra-ui/react';

export const CollapsableText: React.FC<{
  title: string | null | undefined;
  children: unknown;
}> = ({ title, children }) => {
  const [isOpen, { toggle }] = useBoolean(false);
  return (
    <>
      <Box onClick={toggle} cursor="pointer">
        <details>
          <summary>{title}</summary>
        </details>
      </Box>
      {isOpen && children}
    </>
  );
};
