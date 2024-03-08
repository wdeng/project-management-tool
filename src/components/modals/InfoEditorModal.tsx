import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { useSelected } from '@/hooks/useSelectedContext';
import { FileDesign, fetchSourceCode, updateFile } from '@/utils/apis';
import { InfoEditor } from '../general/DescView';

interface InfoEditorModalProps {
  onClose: () => void;
  fileId?: number | null | string;
  onChange?: (value: string | undefined) => void;
}

const displayTypes = {
  path: "label",
  goal: "textfield",
  content: "textarea",
}

const InfoEditorModal: React.FC<InfoEditorModalProps> = ({ onClose, fileId, onChange }) => {
  const { selectedProjectId } = useSelected();
  const [file, setFile] = useState<FileDesign | undefined>(undefined);

  useEffect(() => {
    if (fileId != null && selectedProjectId) {
      fetchSourceCode(selectedProjectId, fileId, "guidelines").then(file => {
        setFile(file);
      }).catch(err => {
        console.error(err);
      });
    }
  }, [selectedProjectId, fileId]);

  const onCloseModal = () => {
    setTimeout(() => {
      setFile(undefined);
    }, 300);
    onClose();
  };

  const handleInfoChange = (key: string, value: any) => {
    setFile(v => v ? { ...v, [key]: value } : undefined);
    onChange && onChange(value);
  };

  return (
    <Modal isOpen={fileId != null} onClose={onCloseModal} title={file?.path || "Info Edit"}>
      <InfoEditor values={file} onUpdateField={handleInfoChange} valueTypes={displayTypes} />
    </Modal>
  );
};

export default InfoEditorModal;
