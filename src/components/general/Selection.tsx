import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { LuChevronsUpDown } from "react-icons/lu";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
}

const SelectOption: React.FC<{
  option: string;
  selected: boolean;
}> = ({ option, selected }) => (
  <>
    <span
      className={`${selected ? 'font-medium' : 'font-normal'
        } block truncate`}
    >
      {option}
    </span>
    {selected ? (
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
        {/* Add your custom icon */}
      </span>
    ) : null}
  </>
);

const Selection: React.FC<SelectProps> = ({ value, onValueChange, options }) => {
  return (
    <Listbox value={value} onChange={onValueChange}>
      {({ open }) => (
        <>
          <div className="relative z-10">
            <Listbox.Button className="w-full py-2 pl-3 pr-10 text-left bg-white rounded-md shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 sm:text-sm">
              <span className="block truncate">{value || 'Select an option'}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <LuChevronsUpDown size={18} />
              </span>
            </Listbox.Button>
            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                {options.map((option, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      `${active ? 'text-indigo-900 bg-indigo-100' : 'text-gray-900'}
                      cursor-default select-none relative py-2 pl-10 pr-4`
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <SelectOption option={option} selected={selected} />
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default Selection;
