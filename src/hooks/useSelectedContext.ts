import { ModuleHierarchy } from '@/utils/apiREAL';
import React, { createContext, useContext } from 'react';

interface SelectedContextType {
  selectedModule: ModuleHierarchy | null | undefined;
  setSelectedModule: React.Dispatch<React.SetStateAction<ModuleHierarchy | null | undefined>>;
  selectedProjectId: number | null;
  setSelectedProjectId: React.Dispatch<React.SetStateAction<number | null>>;
}

export const SelectedContext = createContext<SelectedContextType | undefined>(undefined);

export const useSelected = () => {
  const context = useContext(SelectedContext);
  if (!context) {
    throw new Error('useSelected must be used within a SelectedProvider');
  }
  return context;
};
