import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  IconButton,
  Input,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import {
  Field,
  FieldArray,
  FieldProps,
  Form,
  Formik,
  FormikHelpers,
  FormikState,
} from 'formik';
import { useCallback } from 'react';

import { SubmitButton } from '@/components/SubmitButton';
import { UserDisplay } from '@/components/UserDisplay';
import { handleError } from '@/utils/helpers';
import { isSupportedNetwork, useWallet } from '@/web3';

export interface RolesFormValues {
  ownerAddresses: string[];
  adminAddresses: string[];
  editorAddresses: string[];
  reviewerAddresses: string[];
}

export const RolesForm: React.FC<{
  onSubmit: (values: RolesFormValues) => void | Promise<void>;
}> = ({ onSubmit }) => {
  const initialValues: RolesFormValues = {
    ownerAddresses: [''],
    adminAddresses: [''],
    editorAddresses: [''],
    reviewerAddresses: [''],
  };

  const { isConnected, chainId } = useWallet();

  const isDisabled = !isConnected || !isSupportedNetwork(chainId);

  const submitRoles = useCallback(
    async (
      values: RolesFormValues,
      { setSubmitting, resetForm }: FormikHelpers<RolesFormValues>,
    ) => {
      try {
        setSubmitting(true);
        await onSubmit(values);
        resetForm();
      } catch (error) {
        handleError(error);
      } finally {
        setSubmitting(false);
      }
    },
    [onSubmit],
  );

  return (
    <VStack
      w="100%"
      align="stretch"
      spacing={10}
      boxShadow="inset 0px 0px 0px 1px white"
      borderRadius={10}
      px={{ base: 4, md: 12 }}
      py={8}
    >
      <HStack w="100%">
        <Box
          py={1}
          px={3}
          borderWidth={1}
          borderColor="gray.500"
          color="gray.500"
          borderRadius={4}
          mr={4}
        >
          STEP 3
        </Box>
        <Text fontWeight="bold" fontSize={16}>
          Members
        </Text>
      </HStack>
      <Box maxW="3xl">
        <Text>
          A quest chain can exist with only you - its owner - as a member.
        </Text>
        <Text>
          However, adding members may be beneficial when you want to divide the
          responsibilities of maintenance and reviewing of quest submissions
          between multiple people.
        </Text>
      </Box>
      <Formik initialValues={initialValues} onSubmit={submitRoles}>
        {({ isSubmitting, values }: FormikState<RolesFormValues>) => (
          <Form>
            <Flex
              w="full"
              gap={8}
              flexDir={{ base: 'column', md: 'row' }}
              mb={8}
            >
              <VStack
                w={{ base: '100%', md: '50%' }}
                align="flex-start"
                spacing={4}
              >
                <Role role="owner" addresses={values.ownerAddresses} />
                <Role role="admin" addresses={values.adminAddresses} />
                <Role role="editor" addresses={values.editorAddresses} />
                <Role role="reviewer" addresses={values.reviewerAddresses} />
              </VStack>
              <Grid
                bgColor="rgba(0,0,0,0.4)"
                templateColumns="2fr 1fr 1fr 1fr 1fr"
                w="50%"
                p={8}
                alignItems="center"
                justifyItems="center"
                gap={4}
              >
                <Box />
                <Text fontSize={14} fontWeight="bold">
                  Owner
                </Text>
                <Text fontSize={14} fontWeight="bold">
                  Admin
                </Text>
                <Text fontSize={14} fontWeight="bold">
                  Editor
                </Text>
                <Text fontSize={14} fontWeight="bold">
                  Reviewer
                </Text>
                <Text fontSize={14} fontWeight="bold" pr={8}>
                  Add/remove owners or admins, and upgrade to premium chain
                </Text>
                <CheckIcon />
                <CloseIcon color="gray.600" />
                <CloseIcon color="gray.600" />
                <CloseIcon color="gray.600" />
                <Text fontSize={14} fontWeight="bold" pr={8}>
                  Add/remove admins, editors and reviewers
                </Text>
                <CheckIcon />
                <CheckIcon />
                <CloseIcon color="gray.600" />
                <CloseIcon color="gray.600" />
                <Text fontSize={14} fontWeight="bold" pr={8}>
                  Add/edit/delete quests
                </Text>
                <CheckIcon />
                <CheckIcon />
                <CheckIcon />
                <CloseIcon color="gray.600" />
                <Text fontSize={14} fontWeight="bold" pr={8}>
                  Approve/decline submissions
                </Text>
                <CheckIcon />
                <CheckIcon />
                <CheckIcon />
                <CheckIcon />
              </Grid>
            </Flex>

            <SubmitButton
              isLoading={isSubmitting}
              type="submit"
              isDisabled={isDisabled}
              w="full"
            >
              Continue to Step 4
            </SubmitButton>
          </Form>
        )}
      </Formik>
    </VStack>
  );
};
const Role: React.FC<{
  addresses: string[];
  role: string;
}> = ({ addresses, role }) => (
  <FieldArray
    name={role + 'Addresses'}
    render={arrayHelpers => (
      <Box w="100%">
        <FormLabel htmlFor={role + 'Addresses'}>
          {role.charAt(0).toUpperCase() + role.slice(1) + 's'}
        </FormLabel>
        {addresses.map((_address, index) => (
          <HStack key={index} mb={2}>
            {addresses.length - 1 === index ? (
              <Box w="100%">
                <Field name={`${role + 'Addresses'}.${index}`}>
                  {({ field }: FieldProps<string, RolesFormValues>) => (
                    <FormControl>
                      <Input
                        bg="#0F172A"
                        {...field}
                        id={`${role + 'Addresses'}.${index}`}
                        placeholder={`Paste or write in ${role}'s address...`}
                      />
                    </FormControl>
                  )}
                </Field>
              </Box>
            ) : (
              <Flex flexGrow={1}>
                <UserDisplay address={_address} full />
              </Flex>
            )}

            {addresses.length - 1 === index && (
              <Tooltip
                isDisabled={ethers.utils.isAddress(_address)}
                label="Please input a valid address"
                shouldWrapChildren
              >
                <Button
                  borderRadius="full"
                  isDisabled={!ethers.utils.isAddress(_address)}
                  onClick={() => {
                    arrayHelpers.push('');
                  }}
                >
                  Add
                </Button>
              </Tooltip>
            )}
            {addresses.length && (
              <IconButton
                borderRadius="full"
                isDisabled={addresses[index] === ''}
                onClick={() => {
                  if (addresses.length > 1) arrayHelpers.remove(index);
                  else {
                    arrayHelpers.remove(index);
                    arrayHelpers.push('');
                  }
                }}
                icon={<CloseIcon boxSize="0.7rem" />}
                aria-label={''}
              />
            )}
          </HStack>
        ))}
      </Box>
    )}
  />
);
