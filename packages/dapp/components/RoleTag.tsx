import { Tag } from '@chakra-ui/react';
export type Role = 'Owner' | 'Admin' | 'Editor' | 'Reviewer';

export const RoleTag: React.FC<{ role: Role }> = ({ role }) => (
  <>
    {role === 'Reviewer' && (
      <Tag fontSize="sm" color="neutral">
        {role}
      </Tag>
    )}
    {role === 'Editor' && (
      <Tag fontSize="sm" color="rejected">
        {role}
      </Tag>
    )}
    {role === 'Admin' && (
      <Tag fontSize="sm" color="pending">
        {role}
      </Tag>
    )}
    {role === 'Owner' && (
      <Tag fontSize="sm" color="white">
        {role}
      </Tag>
    )}
  </>
);
