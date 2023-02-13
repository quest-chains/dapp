import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useDropImage } from '@/hooks/useDropFiles';
import { useInputText } from '@/hooks/useInputText';
import { fetchWithHeaders } from '@/utils/fetchWithHeaders';
import { uploadFiles } from '@/utils/metadata';
import { ipfsUriToHttp } from '@/utils/uriHelpers';
import { useWallet } from '@/web3';

import { SubmitButton } from '../SubmitButton';
import { UploadImageForm } from '../UploadImageForm';

export const EditProfileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { user } = useWallet();

  const [usernameRef, setUsername] = useInputText();
  const [usernameError, setUsernameError] = useState('');

  const uploadImageProps = useDropImage();
  const { imageFile, onResetImage } = uploadImageProps;
  const [imageRemoved, setImageRemoved] = useState(false);
  const [imageError, setImageError] = useState('');

  const [isLoading, setLoading] = useState(false);

  const handleUpdate = useCallback(async () => {
    let tid;
    try {
      setLoading(true);
      const username = usernameRef.current;
      if (!username) {
        setUsernameError('Username cannot be empty.');
        return;
      }
      if (username.length < 4) {
        setUsernameError('Username must be longer than 3 characters.');
        return;
      }
      if (!/^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/.test(username)) {
        setUsernameError('Username contains invalid characters.');
        return;
      }

      const existingAvatarUri = user?.avatarUri;

      if ((!existingAvatarUri || imageRemoved) && !imageFile) {
        setImageError('Avatar image cannot be empty');
        return;
      }

      setUsernameError('');
      setImageError('');

      const toUpdate = { username, avatarUri: user?.avatarUri ?? '' };

      if (imageFile) {
        tid = toast.loading('Uploading image to IPFS via web3.storage');
        const imageHash = await uploadFiles([imageFile]);
        toUpdate.avatarUri = `ipfs://${imageHash}`;
        toast.dismiss(tid);
      }

      tid = toast.loading('Updating profile');
      const res = await fetchWithHeaders(
        '/api/profile/update',
        'PUT',
        toUpdate,
      );
      if (res.ok && res.status === 200) {
        window.location.href = '/profile/' + username;
        toast.dismiss(tid);
        tid = toast.success('Profile successfully updated!');
        onClose();
      } else {
        throw new Error('Got status code: ' + res.status);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.dismiss(tid);
      toast.error('Unable to update profile');
    } finally {
      setLoading(false);
    }
  }, [usernameRef, imageFile, imageRemoved, user, onClose]);

  useEffect(() => {
    if (isOpen && user) {
      setUsername(user.username ?? '');
      onResetImage();
      setUsernameError('');
      setImageError('');
      setImageRemoved(false);
    }
  }, [isOpen, user, setUsername, onResetImage]);

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={!isLoading}>
      <ModalOverlay />
      <ModalContent maxW="48rem">
        {!isLoading && <ModalCloseButton />}
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalBody>
          <form>
            <VStack w="100%" align="stretch" mb={10} spacing={4}>
              <FormControl w="full" isInvalid={!!usernameError} isRequired>
                <FormLabel htmlFor="name">Username</FormLabel>
                <Input
                  color="white"
                  isDisabled={isLoading}
                  defaultValue={usernameRef.current}
                  bg="#0F172A"
                  id="name"
                  maxLength={120}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="username"
                />
                {usernameError ? (
                  <FormErrorMessage>{usernameError}</FormErrorMessage>
                ) : (
                  <FormHelperText>
                    Enter a username that will be visible across the Quest
                    Chains platform. It must be atleast 4 characters long and
                    contain only _ or -. It must also start and end with an
                    alphanumeric character.
                  </FormHelperText>
                )}
              </FormControl>

              <UploadImageForm
                {...uploadImageProps}
                label="Avatar"
                formControlProps={{
                  w: '100%',
                  h: '16rem',
                  position: 'relative',
                  isRequired: true,
                }}
                imageProps={{
                  h: '16rem',
                  w: '16rem',
                }}
                dropzoneProps={{
                  ...uploadImageProps.dropzoneProps,
                  width: '100%',
                  height: '16rem',
                }}
                defaultImageUri={ipfsUriToHttp(user.avatarUri)}
                isDisabled={isLoading}
                errorMessage={imageError}
                helperText="Upload an image as your avatar that will be visible across the Quest Chains platform"
                onResetDefaultImage={() => setImageRemoved(true)}
              />
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter alignItems="baseline">
          <Button
            variant="ghost"
            mr={3}
            isDisabled={isLoading}
            onClick={onClose}
            borderRadius="full"
          >
            Close
          </Button>
          <SubmitButton mt={4} isLoading={isLoading} onClick={handleUpdate}>
            Submit
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
