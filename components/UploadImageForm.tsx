import { SmallCloseIcon } from '@chakra-ui/icons';
import {
  BoxProps,
  Flex,
  FormControl,
  FormControlProps,
  FormLabel,
  IconButton,
  Image,
} from '@chakra-ui/react';
import { ImageProps } from 'next/image';
import { useState } from 'react';

import { DropImageType } from '@/hooks/useDropFiles';

export const UploadImageForm = ({
  dropzoneProps,
  inputProps,
  onOpenImageInput,
  onResetImage,
  imageFile,
  label = 'Upload image',
  labelColor = 'white',
  formControlProps = {},
  imageProps = {},
  defaultImageUri: defaultImageUriInput,
  onResetDefaultImage,
}: DropImageType & {
  defaultImageUri?: string | null | undefined;
  onResetDefaultImage?: () => void;
  label?: string;
  labelColor?: string;
  formControlProps?: FormControlProps;
  imageProps?: Omit<ImageProps, 'src'> & BoxProps;
}) => {
  const [defaultImageUri, setDefaultImageUri] = useState<string>(
    defaultImageUriInput ?? '',
  );

  return (
    <FormControl {...formControlProps}>
      <FormLabel color={labelColor} htmlFor="imageInput">
        {label}
      </FormLabel>
      {imageFile && (
        <Flex pos="relative">
          {typeof window !== 'undefined' && (
            <Image
              {...imageProps}
              alt={`${label} imageFile`}
              src={window.URL.createObjectURL(imageFile)}
            />
          )}
          <IconButton
            pos="absolute"
            size="sm"
            top={2}
            left={2}
            borderRadius="full"
            onClick={onResetImage}
            icon={<SmallCloseIcon boxSize="1.5rem" />}
            aria-label={''}
            backdropFilter="blur(40px)"
            boxShadow="inset 0px 0px 0px 1px white"
          />
        </Flex>
      )}
      {!imageFile && defaultImageUri && onResetDefaultImage && (
        <Flex pos="relative">
          {typeof window !== 'undefined' && (
            <Image
              {...imageProps}
              alt={`${label} imageFile`}
              src={defaultImageUri}
            />
          )}
          <IconButton
            pos="absolute"
            size="sm"
            top={2}
            left={2}
            borderRadius="full"
            onClick={() => {
              onResetDefaultImage();
              setDefaultImageUri('');
            }}
            icon={<SmallCloseIcon boxSize="1.5rem" />}
            aria-label={''}
            backdropFilter="blur(40px)"
            boxShadow="inset 0px 0px 0px 1px white"
          />
        </Flex>
      )}
      {!imageFile && (!defaultImageUri || !onResetDefaultImage) && (
        <Flex
          {...dropzoneProps}
          flexDir="column"
          borderWidth={1}
          borderStyle="dashed"
          borderRadius={20}
          p={10}
          onClick={onOpenImageInput}
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
};
