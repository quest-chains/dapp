import { Tag } from '@chakra-ui/react';
export type Role = 'Owner' | 'Admin' | 'Editor' | 'Reviewer';

export const RoleTag: React.FC<{ role: Role }> = ({ role, ...props }) => (
  <>
    {role === 'Reviewer' && (
      <Tag fontSize="sm" color="neutral" {...props}>
        {role}
      </Tag>
    )}
    {role === 'Editor' && (
      <Tag fontSize="sm" color="rejected" {...props}>
        {role}
      </Tag>
    )}
    {role === 'Admin' && (
      <Tag fontSize="sm" color="pending" {...props}>
        {role}
      </Tag>
    )}
    {role === 'Owner' && (
      <Tag fontSize="sm" color="white" {...props}>
        {role}
      </Tag>
    )}
  </>
);
