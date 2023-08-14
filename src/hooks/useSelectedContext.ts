import { ModuleHierarchy } from '@/utils/apis';
import React, { createContext, useContext } from 'react';

interface SelectedContextType {
  selectedModule: ModuleHierarchy | null | undefined;
  setSelectedModule: React.Dispatch<React.SetStateAction<ModuleHierarchy | null | undefined>>;
  selectedProjectId: number | null;
  setSelectedProjectId: React.Dispatch<React.SetStateAction<number | null>>;
  refreshCurrentProject: () => void;
}

export const SelectedContext = createContext<SelectedContextType | undefined>(undefined);

export const useSelected = () => {
  const context = useContext(SelectedContext);
  if (!context) {
    throw new Error('useSelected must be used within a SelectedProvider');
  }
  return context;
};
