import { SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  BoxProps,
  Flex,
  FormControl,
  FormControlProps,
  FormLabel,
  IconButton,
  Image,
} from '@chakra-ui/react';
import { ImageProps } from 'next/image';

import { DropFilesType } from '@/hooks/useDropFiles';

export const UploadImageForm = ({
  dropzoneProps,
  inputProps,
  onOpenFiles,
  onRemoveFile,
  files,
  label = 'Upload image',
  labelColor = 'white',
  formControlProps = {},
  imageProps = {},
}: DropFilesType & {
  label?: string;
  labelColor?: string;
  formControlProps?: FormControlProps;
  imageProps?: Omit<ImageProps, 'src'> & BoxProps;
}) => (
  <FormControl {...formControlProps}>
    <FormLabel color={labelColor} htmlFor="imageInput">
      {label}
    </FormLabel>
    {files.length ? (
      <>
        {files.map((file: File) => (
          <Flex key={file.name} pos="relative">
            {typeof window !== 'undefined' && (
              <Image
                {...imageProps}
                alt={`${label} image`}
                src={window.URL.createObjectURL(file)}
              />
            )}
            <IconButton
              pos="absolute"
              size="sm"
              top={2}
              left={2}
              borderRadius="full"
              onClick={() => onRemoveFile(file)}
              icon={<SmallCloseIcon boxSize="1.5rem" />}
              aria-label={''}
              backdropFilter="blur(40px)"
              boxShadow="inset 0px 0px 0px 1px white"
            />
          </Flex>
        ))}
      </>
    ) : (
      <Flex
        {...dropzoneProps}
        flexDir="column"
        borderWidth={1}
        borderStyle="dashed"
        borderRadius={20}
        p={10}
        onClick={onOpenFiles}
      >
        <input {...inputProps} id="imageInput" color="white" />
        <Flex
          justifyContent="center"
          alignItems="center"
          alignSelf="center"
          height="100%"
        >{`Drag 'n' drop an image here`}</Flex>
      </Flex>
    )}
  </FormControl>
);
