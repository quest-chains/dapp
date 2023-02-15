import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

import { SubmitButton } from './SubmitButton';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onSubmit: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<DialogProps> = ({
  title,
  content,
  isDisabled,
  isLoading,
  isOpen,
  onClose,
  onSubmit,
  cancelLabel = 'Cancel',
  submitLabel = 'Confirm',
}) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="30rem">
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{content}</ModalBody>
          <ModalFooter alignItems="baseline">
            <Button
              variant="ghost"
              mr={3}
              onClick={onClose}
              borderRadius="full"
            >
              {cancelLabel}
            </Button>
            <SubmitButton
              mt={4}
              onClick={onSubmit}
              isDisabled={isDisabled}
              isLoading={isLoading}
            >
              {submitLabel}
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
