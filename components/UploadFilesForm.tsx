import { SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Text,
} from '@chakra-ui/react';

import { DropFilesType } from '@/hooks/useDropFiles';

export const UploadFilesForm = ({
  dropzoneProps,
  inputProps,
  onOpenFilesInput,
  onRemoveFile,
  files,
  label = 'Upload files',
  labelColor = 'main',
}: DropFilesType & { label?: string; labelColor?: string }) => (
  <>
    <FormControl>
      <FormLabel color={labelColor} htmlFor="fileInput">
        {label}
      </FormLabel>
      <Flex
        {...dropzoneProps}
        flexDir="column"
        borderWidth={1}
        borderStyle="dashed"
        borderRadius={20}
        p={10}
        mb={4}
        onClick={onOpenFilesInput}
      >
        <input {...inputProps} id="fileInput" color="white" />
        <Box alignSelf="center">{`Drag 'n' drop some files here`}</Box>
      </Flex>
    </FormControl>
    {files.length > 0 && <Text mb={1}>Files:</Text>}
    {files.map((file: File) => (
      <Flex key={file.name} w="100%" mb={1}>
        <IconButton
          size="xs"
          borderRadius="full"
          onClick={() => onRemoveFile(file)}
          icon={<SmallCloseIcon boxSize="1rem" />}
          aria-label={''}
        />
        <Text ml={1} alignSelf="center">
          {file.name} - {file.size} bytes
        </Text>
      </Flex>
    ))}
  </>
);
