import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Role } from '@/types';

interface RolesMultiSelectProps {
  roles: Role[];
  selectedRoles: Role[];
  onChange: (roles: Role[]) => void;
}

export const RolesMultiSelect: React.FC<RolesMultiSelectProps> = ({ 
  roles, 
  selectedRoles, 
  onChange 
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleRole = useCallback((role: Role, checked: boolean) => {
    if (checked) {
      if (!selectedRoles.some(r => r.name === role.name)) {
        onChange([...selectedRoles, role]);
      }
    } else {
      onChange(selectedRoles.filter(r => r.name !== role.name));
    }
  }, [selectedRoles, onChange]);

  const handleRoleClick = useCallback((role: Role) => {
    const isSelected = selectedRoles.some(r => r.name === role.name);
    toggleRole(role, !isSelected);
  }, [selectedRoles, toggleRole]);

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      <Button
        type="button"
        onClick={() => setOpen(!open)}
        variant="outline"
        className="w-full justify-between"
      >
        <span className="truncate">
          {selectedRoles.length > 0
            ? selectedRoles.map(r => r.name).join(', ')
            : "Select roles..."}
        </span>
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </Button>

      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto border border-gray-200">
          {roles.map(role => {
            const isSelected = selectedRoles.some(r => r.name === role.name);
            return (
              <div
                key={role.name}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRoleClick(role)}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    if (checked !== 'indeterminate') {
                      toggleRole(role, checked as boolean);
                    }
                  }}
                  className="mr-2"
                />
                <Label className="cursor-pointer">{role.name}</Label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};