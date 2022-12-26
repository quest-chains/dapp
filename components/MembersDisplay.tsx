import { Box, Button, Divider, Flex, Text } from '@chakra-ui/react';

import { UserDisplay } from '@/components/UserDisplay';

import { EditIcon } from './icons/EditIcon';

type RolesProps = {
  role: string;
  addresses: string[];
  statusesPoH: {
    [addr: string]: boolean;
  };
};

type MembersProps = {
  owners: string[];
  admins: string[];
  editors: string[];
  reviewers: string[];
  statusesPoH?: {
    [addr: string]: boolean;
  };
  onEdit?: () => void;
};

const MemberSection: React.FC<RolesProps> = ({
  role,
  addresses,
  statusesPoH,
}) => (
  <>
    <Flex justify="space-between" alignItems="center" my={3} w="100%">
      <Flex flexDir="column">
        {addresses.map(address => (
          <Box key={address}>
            {address && (
              <UserDisplay address={address} hasPoH={statusesPoH[address]} />
            )}
          </Box>
        ))}
      </Flex>
      <Text color="whiteAlpha.600">{role}</Text>
    </Flex>
    <Divider />
  </>
);

export const MembersDisplay: React.FC<MembersProps> = ({
  owners,
  admins,
  editors,
  reviewers,
  statusesPoH = {},
  onEdit,
}) => (
  <Flex flexDir="column" width="full">
    <Flex justify="space-between" align="center" mb={5}>
      <Text fontFamily="heading" fontSize="xl">
        Members
      </Text>
      {onEdit && (
        <Button
          onClick={onEdit}
          fontSize="xs"
          px={4}
          leftIcon={<EditIcon fontSize="sm" />}
        >
          Edit members
        </Button>
      )}
    </Flex>
    <Divider />
    <MemberSection role="OWNERS" addresses={owners} statusesPoH={statusesPoH} />
    {admins.length !== 0 && (
      <MemberSection
        role="ADMINS"
        addresses={admins}
        statusesPoH={statusesPoH}
      />
    )}
    {editors.length !== 0 && (
      <MemberSection
        role="EDITORS"
        addresses={editors}
        statusesPoH={statusesPoH}
      />
    )}
    {reviewers.length !== 0 && (
      <MemberSection
        role="REVIEWERS"
        addresses={reviewers}
        statusesPoH={statusesPoH}
      />
    )}
  </Flex>
);
