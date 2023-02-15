import {
  Button,
  Flex,
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
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useDropImage } from '@/hooks/useDropFiles';
import { fetchWithHeaders } from '@/utils/fetchWithHeaders';
import { uploadFiles } from '@/utils/metadata';
import { ipfsUriToHttp } from '@/utils/uriHelpers';
import { useWallet } from '@/web3';

import { ConfirmationModal } from '../ConfirmationModal';
import { SubmitButton } from '../SubmitButton';
import { UploadImageForm } from '../UploadImageForm';

export const EditProfileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { user, ens, setUser } = useWallet();

  const { push } = useRouter();

  const [username, setUsername] = useState(user?.username ?? ens ?? '');
  const [usernameError, setUsernameError] = useState('');

  const uploadImageProps = useDropImage();
  const { imageFile, onResetImage } = uploadImageProps;
  const [imageRemoved, setImageRemoved] = useState(false);
  const [imageError, setImageError] = useState('');

  const [isLoading, setLoading] = useState(false);

  const validateChanges = useCallback((): boolean => {
    setUsernameError('');
    setImageError('');
    if (!username) {
      setUsernameError('Username cannot be empty.');
      return false;
    }
    if (username.length < 3) {
      setUsernameError('Username must be between 3 and 30 characters long.');
      return false;
    }
    if (!/^[A-Za-z0-9]+(?:.*[A-Za-z0-9]+)*$/.test(username)) {
      setUsernameError('Username must start and end with a letter or number.');
      return false;
    }

    if (!/^[A-Za-z0-9_\-\.]+$/.test(username)) {
      setUsernameError(
        'Username can only contain letters, numbers, hyphens, dots, and underscores.',
      );
      return false;
    }

    if (!/^[A-Za-z0-9]+(?:[_\-\.][A-Za-z0-9]+)*$/.test(username)) {
      setUsernameError(
        'Username cannot have consecutive or adjacent hyphens, dots or underscores.',
      );
      return false;
    }

    const existingAvatarUri = user?.avatarUri;

    if ((!existingAvatarUri || imageRemoved) && !imageFile) {
      setImageError('Avatar image cannot be empty');
      return false;
    }

    return true;
  }, [user, username, imageFile, imageRemoved]);

  const handleUpdate = useCallback(async () => {
    let tid;
    try {
      setLoading(true);

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
      if (res.status === 200) {
        setUser(await res.json());
        toast.dismiss(tid);
        tid = toast.success('Profile updated successfully!');
        onClose();
        push('/profile/' + username);
      } else {
        const { error } = await res.json();
        throw new Error(error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.dismiss(tid);
      toast.error('Unable to update profile: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [username, imageFile, user, setUser, push, onClose]);

  useEffect(() => {
    if (isOpen) {
      setUsername(user?.username ?? ens ?? '');
      onResetImage();
      setUsernameError('');
      setImageError('');
      setImageRemoved(false);
    }
  }, [isOpen, user, ens, setUsername, onResetImage]);

  const {
    isOpen: isConfirmationOpen,
    onClose: onConfirmationClose,
    onOpen: onConfirmationOpen,
  } = useDisclosure();

  const [confirmationProps, setConfirmationProps] = useState<{
    title: string;
    content: string;
    onSubmit: () => void;
    cancelLabel?: string;
    submitLabel?: string;
  }>({ title: '', content: '', onSubmit: () => undefined });

  const isChanged = useMemo(
    () => imageRemoved || imageFile || username !== user?.username,
    [user, username, imageFile, imageRemoved],
  );

  const onModalClose = useCallback(() => {
    if (!isChanged) {
      return onClose();
    }

    setConfirmationProps({
      title: 'Discard Changes',
      content:
        'There are unsaved changes to your profile. Do you wish to discard them?',
      onSubmit: () => {
        onClose();
        onConfirmationClose();
      },
      cancelLabel: 'Go back',
      submitLabel: 'Discard',
    });

    onConfirmationOpen();
  }, [isChanged, onClose, onConfirmationOpen, onConfirmationClose]);

  const onSubmit = useCallback(() => {
    if (!validateChanges()) {
      return;
    }

    setConfirmationProps({
      title: 'Save Changes',
      content: 'Are you sure you want to save these changes to your profile?',
      onSubmit: () => {
        onConfirmationClose();
        handleUpdate();
      },
      cancelLabel: 'Cancel',
      submitLabel: 'Save',
    });

    onConfirmationOpen();
  }, [onConfirmationOpen, onConfirmationClose, handleUpdate, validateChanges]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onModalClose}
        closeOnOverlayClick={!isLoading}
      >
        <ModalOverlay />
        <ModalContent maxW="30rem">
          {!isLoading && <ModalCloseButton />}
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalBody>
            <form>
              <VStack w="100%" align="stretch" mb={10} spacing={8}>
                <FormControl w="full" isInvalid={!!usernameError}>
                  <Flex align="center" justify="space-between" w="100%">
                    <FormLabel htmlFor="name">Username</FormLabel>
                    <Text fontSize="sm">{username.length} / 30</Text>
                  </Flex>
                  <Input
                    color="white"
                    isDisabled={isLoading}
                    value={username}
                    bg="#0F172A"
                    id="name"
                    maxLength={30}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="username"
                  />
                  <FormErrorMessage>{usernameError}</FormErrorMessage>
                  <FormHelperText>
                    Choose a username that represents you across the platform.
                    Your username must be 3-30 characters long, start and end
                    with a letter or number, and only contain letters, numbers,
                    hyphens, and underscores. No consecutive or adjacent hyphens
                    or underscores allowed.
                  </FormHelperText>
                </FormControl>

                <UploadImageForm
                  {...uploadImageProps}
                  label="Avatar"
                  formControlProps={{
                    w: '100%',
                    h: '16rem',
                    position: 'relative',
                  }}
                  imageProps={{
                    h: '16rem',
                    w: '16rem',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                  dropzoneProps={{
                    ...uploadImageProps.dropzoneProps,
                    width: '100%',
                    height: '16rem',
                  }}
                  defaultImageUri={ipfsUriToHttp(user?.avatarUri)}
                  isDisabled={isLoading}
                  errorMessage={imageError}
                  helperText="Personalize your profile by uploading an image that represents you across the platform. This image will be visible to other users."
                  onResetDefaultImage={() => setImageRemoved(true)}
                />
              </VStack>
            </form>
          </ModalBody>
          <ModalFooter alignItems="baseline" mt={6}>
            <Button
              variant="ghost"
              mr={3}
              isDisabled={isLoading}
              onClick={onModalClose}
              borderRadius="full"
            >
              Close
            </Button>
            <SubmitButton
              mt={4}
              isLoading={isLoading}
              onClick={onSubmit}
              isDisabled={!isChanged}
            >
              Submit
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
        {...confirmationProps}
      />
    </>
  );
};
