import { SmallCloseIcon } from '@chakra-ui/icons';
import {
  BoxProps,
  Flex,
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  Image,
} from '@chakra-ui/react';
import { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';
import Zoom from 'react-medium-image-zoom';

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
  isDisabled = false,
  errorMessage = '',
  helperText = '',
}: DropImageType & {
  defaultImageUri?: string | null | undefined;
  onResetDefaultImage?: () => void;
  label?: string;
  labelColor?: string;
  formControlProps?: FormControlProps;
  imageProps?: Omit<ImageProps, 'src'> & BoxProps;
  isDisabled?: boolean;
  errorMessage?: string;
  helperText?: string;
}) => {
  const [defaultImageUri, setDefaultImageUri] = useState<string>(
    defaultImageUriInput ?? '',
  );

  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  return (
    <FormControl
      {...(isDisabled ? { cursor: 'not-allowed' } : {})}
      {...formControlProps}
      isInvalid={!!errorMessage}
    >
      <FormLabel color={labelColor} htmlFor="imageInput">
        {label}
      </FormLabel>
      {imageFile && (
        <Flex pos="relative" {...(isDisabled ? { pointerEvents: 'none' } : {})}>
          {ready && (
            <Zoom>
              <Image
                {...imageProps}
                alt={`${label} imageFile`}
                src={window.URL.createObjectURL(imageFile)}
              />
            </Zoom>
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
            isDisabled={isDisabled}
          />
        </Flex>
      )}
      {!imageFile && defaultImageUri && onResetDefaultImage && (
        <Flex pos="relative" {...(isDisabled ? { pointerEvents: 'none' } : {})}>
          <Zoom>
            <Image
              {...imageProps}
              alt={`${label} imageFile`}
              src={defaultImageUri}
            />
          </Zoom>

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
            isDisabled={isDisabled}
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
          onClick={isDisabled ? undefined : onOpenImageInput}
          {...(isDisabled ? { pointerEvents: 'none' } : {})}
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
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
