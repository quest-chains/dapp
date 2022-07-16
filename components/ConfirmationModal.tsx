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
}

export const ConfirmationModal: React.FC<DialogProps> = ({
  title,
  content,
  isDisabled,
  isLoading,
  isOpen,
  onClose,
  onSubmit,
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
              Close
            </Button>
            <SubmitButton
              mt={4}
              type="submit"
              onClick={onSubmit}
              isDisabled={isDisabled}
              isLoading={isLoading}
            >
              Submit
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
