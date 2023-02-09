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
  title: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  content: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel?: string;
}

export const ConfirmationModal: React.FC<DialogProps> = ({
  title,
  content,
  isDisabled,
  isLoading,
  isOpen,
  onClose,
  onSubmit,
  submitLabel = 'Confirm',
}) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
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
              Cancel
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
