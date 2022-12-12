import { Box, Button, Divider, Flex, Image, Text } from '@chakra-ui/react';

import Edit from '@/assets/Edit.svg';
import { UserDisplay } from '@/components/UserDisplay';

type RolesProps = {
  role: string;
  addresses: string[];
};

type MembersProps = {
  owners: string[];
  admins: string[];
  editors: string[];
  reviewers: string[];
  onEdit?: () => void;
};

const MemberSection: React.FC<RolesProps> = ({ role, addresses }) => (
  <>
    <Flex justify="space-between" alignItems="center" my={3} pl={4} w="100%">
      <Text color="whiteAlpha.600">{role}</Text>
      <Flex flexDir="column">
        {addresses.map(address => (
          <Box key={address}>
            {address && <UserDisplay address={address} />}
          </Box>
        ))}
      </Flex>
    </Flex>
    <Divider />
  </>
);

export const MembersDisplay: React.FC<MembersProps> = ({
  owners,
  admins,
  editors,
  reviewers,
  onEdit,
}) => (
  <Flex flexDir="column" width="full">
    <Flex justify="space-between" align="center" mb={5}>
      <Text fontFamily="heading" fontSize="xl">
        Members
      </Text>
      {onEdit && (
        <Button onClick={onEdit} fontSize="xs" px={4}>
          <Image src={Edit.src} alt="Edit" mr={2} />
          Edit members
        </Button>
      )}
    </Flex>
    <Divider />
    <MemberSection role="OWNERS" addresses={owners} />
    {admins.length !== 0 && <MemberSection role="ADMINS" addresses={admins} />}
    {editors.length !== 0 && (
      <MemberSection role="EDITORS" addresses={editors} />
    )}
    {reviewers.length !== 0 && (
      <MemberSection role="REVIEWERS" addresses={reviewers} />
    )}
  </Flex>
);
