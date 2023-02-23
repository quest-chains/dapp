import { CheckIcon } from '@chakra-ui/icons';
import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  Select,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { contracts, graphql } from '@quest-chains/sdk';
import { ethers } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import { AddUserIcon } from '@/components/icons/AddUserIcon';
import { TrashOutlinedIcon } from '@/components/icons/TrashOutlinedIcon';
import { Role } from '@/components/RoleTag';
import { SubmitButton } from '@/components/SubmitButton';
import { UserDisplay } from '@/components/UserDisplay';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { AVAILABLE_NETWORK_INFO, useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

const QuestChainRoles = {
  Owner: '0x0000000000000000000000000000000000000000000000000000000000000000',
  Admin: '0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775',
  Editor: '0x21d1167972f621f75904fb065136bc8b53c7ba1c60ccd3a7758fbee465851e9c',
  Reviewer:
    '0xc10c77be35aff266144ed64c26a1fa104bae2f284ae99ac4a34203454704a185',
};

const changeRole = async (
  contract:
    | contracts.V0.QuestChain
    | contracts.V1.QuestChain
    | contracts.V2.QuestChain,
  address: string,
  oldRole: Role,
  newRole: Role,
) => {
  switch (oldRole) {
    case 'Reviewer':
      return contract.grantRole(QuestChainRoles[newRole], address);
    case 'Editor':
      if (newRole === 'Reviewer') {
        return contract.revokeRole(QuestChainRoles['Editor'], address);
      }
      return contract.grantRole(QuestChainRoles[newRole], address);
    case 'Admin':
      if (newRole === 'Reviewer') {
        return contract.revokeRole(QuestChainRoles['Editor'], address);
      } else if (newRole === 'Editor') {
        return contract.revokeRole(QuestChainRoles['Admin'], address);
      }
      return contract.grantRole(QuestChainRoles['Owner'], address);
    case 'Owner':
    default:
      if (newRole === 'Reviewer') {
        return contract.revokeRole(QuestChainRoles['Editor'], address);
      } else if (newRole === 'Editor') {
        return contract.revokeRole(QuestChainRoles['Admin'], address);
      }
      return contract.revokeRole(QuestChainRoles['Owner'], address);
  }
};

export const RolesEditor: React.FC<{
  questChain: graphql.QuestChainInfoFragment;
  members: { [addr: string]: Role };
  refresh: () => void;
  ownerAddress: string;
  onExit: () => void;
}> = ({
  members: existingMembers,
  ownerAddress,
  refresh,
  questChain,
  onExit,
}) => {
  const [newAddress, setNewAddress] = useState('');

  const [members, setMembers] = useState<{
    [addr: string]: {
      oldRole: Role | '';
      newRole: Role | '' | 'Remove';
      editing: boolean;
    };
  }>({});

  useEffect(() => {
    setMembers(
      Object.fromEntries(
        Object.entries(existingMembers).map(([addr, role]) => [
          addr,
          { oldRole: role, newRole: role, editing: false },
        ]),
      ),
    );
  }, [existingMembers]);

  const onAdd = (addr: string) =>
    setMembers({
      ...members,
      [addr]: { oldRole: '', newRole: '', editing: true },
    });

  const onRemove = (addr: string) => {
    if (Object.keys(existingMembers).includes(addr)) {
      setMembers({
        ...members,
        [addr]: {
          oldRole: members[addr].oldRole,
          newRole: 'Remove',
          editing: true,
        },
      });
    } else {
      const newMembers = { ...members };
      delete newMembers[addr];
      setMembers(newMembers);
    }
  };

  const memberToSave = Object.entries(members).find(([, m]) => m.editing);

  const { chainId, provider } = useWallet();

  const isEditing = useMemo(
    () =>
      !!memberToSave &&
      !!memberToSave[1].newRole &&
      memberToSave[1].newRole !== memberToSave[1].oldRole,
    [memberToSave],
  );

  const [isSaving, setSaving] = useState(false);

  const onSave = useCallback(async () => {
    if (!memberToSave) return;
    const [address, { newRole, oldRole }] = memberToSave;

    if (!chainId || !provider || questChain?.chainId !== chainId) {
      toast.error(
        `Wrong Chain, please switch to ${
          AVAILABLE_NETWORK_INFO[questChain?.chainId].label
        }`,
      );
      return;
    }
    setSaving(true);
    let tid = toast.loading(
      'Waiting for Confirmation - Confirm the transaction in your Wallet',
    );
    try {
      const contract = getQuestChainContract(
        questChain.address,
        questChain.version,
        provider.getSigner(),
      );
      let tx;
      if (oldRole === newRole || !newRole) return;
      if (!oldRole) {
        if (!newRole || newRole === 'Remove') return;
        tx = await contract.grantRole(QuestChainRoles[newRole], address);
      } else if (newRole === 'Remove') {
        tx = await contract.revokeRole(QuestChainRoles['Reviewer'], address);
      } else {
        tx = await changeRole(contract, address, oldRole, newRole);
      }
      toast.dismiss(tid);
      tid = handleTxLoading(tx.hash, chainId);
      const receipt = await tx.wait(1);
      toast.dismiss(tid);
      tid = toast.loading(
        'Transaction confirmed. Waiting for The Graph to index the transaction data.',
      );
      await waitUntilBlock(chainId, receipt.blockNumber);
      toast.dismiss(tid);
      toast.success(`Successfully updated members`);
      refresh();
    } catch (error) {
      toast.dismiss(tid);
      handleError(error);
    } finally {
      setSaving(false);
      onExit();
    }
  }, [chainId, provider, memberToSave, questChain, onExit, refresh]);

  return (
    <Flex flexDir="column" w="full" gap={4} my={8}>
      <Flex justify="space-between" align="center" mb={5}>
        <Text fontFamily="heading" fontSize="xl">
          Members
        </Text>
      </Flex>
      {!memberToSave && (
        <Flex bgColor="gray.800" alignItems="center" p={1} borderRadius={8}>
          <InputGroup flexGrow={1}>
            <InputLeftElement>
              <AddUserIcon ml={2} />
            </InputLeftElement>
            <Input
              border={0}
              pl={12}
              w="calc(100% - 4.5rem)"
              textOverflow="ellipsis"
              type="address"
              placeholder="Paste or write an ETH address..."
              value={newAddress}
              isDisabled={isEditing}
              onChange={e => setNewAddress(e.target.value?.toLowerCase() ?? '')}
            />
            <InputRightAddon bg="none" border="none" p="0">
              <Tooltip
                isDisabled={ethers.utils.isAddress(newAddress)}
                label="Please input a valid address"
                shouldWrapChildren
              >
                <IconButton
                  isDisabled={!ethers.utils.isAddress(newAddress)}
                  onClick={() => {
                    if (
                      Object.keys(members).find(member => member === newAddress)
                    ) {
                      toast.error('Address has already been added');
                    } else {
                      onAdd(newAddress);
                    }
                    setNewAddress('');
                  }}
                  icon={<CheckIcon />}
                  aria-label="Add"
                  height={9}
                  borderRadius="3"
                  w={16}
                />
              </Tooltip>
            </InputRightAddon>
          </InputGroup>
        </Flex>
      )}

      {Object.entries(members).map(([address, { oldRole, newRole }]) => (
        <Flex key={address}>
          <Flex w="full" justifyContent="space-between" alignItems="center">
            <UserDisplay address={address} />
            <Flex alignItems="center" gap={2}>
              <Select
                onChange={e =>
                  setMembers({
                    ...members,
                    [address]: {
                      oldRole,
                      newRole: e.target.value as Role,
                      editing: oldRole !== e.target.value,
                    },
                  })
                }
                value={newRole}
                placeholder="Select role"
                isDisabled={
                  isSaving ||
                  ownerAddress === address ||
                  (memberToSave && memberToSave?.[0] !== address)
                }
                w="auto"
              >
                <option value={'Owner'}>Owner</option>
                <option value={'Admin'}>Admin</option>
                <option value={'Editor'}>Editor</option>
                <option value={'Reviewer'}>Reviewer</option>
                {oldRole && (
                  <option value={'Remove'} style={{ color: 'red' }}>
                    Remove
                  </option>
                )}
              </Select>
              <IconButton
                aria-label="remove address"
                variant="outline"
                icon={<TrashOutlinedIcon />}
                onClick={() => onRemove(address)}
                isDisabled={
                  ownerAddress === address || newRole === 'Remove' || isSaving
                }
                visibility={
                  ownerAddress === address ||
                  (memberToSave && memberToSave?.[0] !== address)
                    ? 'hidden'
                    : 'unset'
                }
              />
            </Flex>
          </Flex>
        </Flex>
      ))}

      <Flex align="center" justify="space-between" gap={4} pt={3}>
        {isEditing && (
          <SubmitButton
            onClick={onSave}
            flex={1}
            isLoading={isSaving}
            height={10}
            px={6}
            fontSize="sm"
          >
            Save
          </SubmitButton>
        )}
        <SubmitButton
          onClick={onExit}
          flex={1}
          isDisabled={isSaving}
          fontSize="sm"
          bg="transparent"
          height={10}
          border="1px solid #9EFCE5"
          color="green.200"
          _hover={{
            bg: 'whiteAlpha.200',
          }}
          px={6}
        >
          Cancel
        </SubmitButton>
      </Flex>
    </Flex>
  );
};
