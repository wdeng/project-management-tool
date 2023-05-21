import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { MdAddCircleOutline, MdClose } from 'react-icons/md'; // Import icons from react-icons

interface ProjectCreationModalProps {
  onNewProject: (projectName: string, requirements: string, schema: string) => Promise<void>;
}

export const ProjectCreationModal: React.FC<ProjectCreationModalProps> = ({ onNewProject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [requirements, setRequirements] = useState('');
  const [schema, setSchema] = useState('');

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const validateForm = () => {
    return projectName.length > 0 && requirements.length > 0 && schema.length > 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onNewProject(projectName, requirements, schema);
      setProjectName(''); // reset form
      setRequirements(''); // reset form
      setSchema(''); // reset form
      close();
    } catch (error) {
      // Display error messages
    }
  };

  return (
    <>
      <button 
        className="w-full flex items-center justify-center p-2 bg-gray-200 rounded-md shadow-md hover:bg-gray-300 transition-colors duration-200 ease-in-out cursor-pointer" 
        onClick={open}
      >
        <MdAddCircleOutline className="mr-1" />
        Create Project
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={close}
        >
          <div className="flex items-center justify-center min-h-screen text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex justify-between items-center border-b p-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create New Project
                  </Dialog.Title>
                  <button onClick={close}>
                    <MdClose className="text-gray-400 hover:text-gray-500" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4">
                  <label htmlFor="projectName">Project Name</label>
                  <input
                    id="projectName"
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                  />
                  <label htmlFor="requirements">Requirements</label>
                  <textarea
                    id="requirements"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full p-2 mb-4 h-20 border rounded"
                  />
                  <label htmlFor="schema">Project Schema</label>
                  <textarea
                    id="schema"
                    value={schema}
                    onChange={(e) => setSchema(e.target.value)}
                    className="w-full p-2 mb-4 h-20 border rounded"
                  />
                  <button type="submit" disabled={!validateForm()} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 ease-in-out">
                    Create
                  </button>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ProjectCreationModal;
