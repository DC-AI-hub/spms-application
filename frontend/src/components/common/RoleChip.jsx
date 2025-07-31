import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

/**
 * Reusable chip component for displaying roles with remove functionality
 * @param {Object} props - Component props
 * @param {Object} props.role - Role object { id: string, name: string }
 * @param {Function} props.onRemove - Remove handler function (roleId: string) => void
 * @param {boolean} props.disabled - Disabled state
 * @returns {JSX.Element} Role chip component
 */
const RoleChip = ({ role, onRemove, disabled }) => {
  return (
    <Box 
      className="flex items-center bg-gray-100 rounded-full px-3 py-1"
      data-testid="role-chip"
    >
      <span className="mr-2">{role.name}</span>
      <IconButton 
        size="small" 
        onClick={() => onRemove(role.id)}
        disabled={disabled}
        aria-label={`Remove ${role.name} role`}
      >
        <Delete fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default RoleChip;
