import React from 'react';
import { Disclosure } from '@headlessui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';

interface Option {
  value: string,
  initialOpen?: boolean,
  children?: Option[]
}

const options: Option[] = [
  {
    value: 'Option 1',
    initialOpen: true,
    children: [
      {
        value: 'Sub-Option 1.1',
        initialOpen: false,
        children: [
          { value: 'Sub-Sub-Option 1.1.1', initialOpen: true },
          { value: 'Sub-Sub-Option 1.1.2', initialOpen: false },
        ]
      },
      { value: 'Sub-Option 1.2', initialOpen: true },
    ],
  },
  { value: 'Option 2', initialOpen: false },
];

interface DisclosurePanelProps {
  option: Option,
  handleCheckboxChange: (option: string) => void,
  mockCheckboxOptions: string[],
  selectedCheckboxOptions: string[],
}

const DisclosurePanel: React.FC<DisclosurePanelProps> = ({ 
  option, 
  handleCheckboxChange,
  mockCheckboxOptions,
  selectedCheckboxOptions,
 }) => {
  return (
    <Disclosure defaultOpen={option.initialOpen}>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-indigo-800 bg-indigo-100 rounded-lg hover:bg-indigo-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
            <span>{option.value}</span>
            <MdKeyboardArrowDown
              className={`${open ? 'transform rotate-180' : ''
                } w-5 h-5 text-indigo-500`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
            Content for {option.value}
            <div className="flex flex-wrap items-center">
              {mockCheckboxOptions.map((checkboxOption) => (
                <div className="flex items-center space-x-2 mr-10" key={checkboxOption}>
                  <input
                    type="checkbox"
                    id={checkboxOption}
                    checked={selectedCheckboxOptions.includes(checkboxOption)}
                    onChange={() => handleCheckboxChange(checkboxOption)}
                    className="form-checkbox h-4 w-4 border border-gray-300 rounded-md checked:bg-indigo-500"
                  />
                  <label htmlFor={checkboxOption}>{checkboxOption}</label>
                </div>
              ))}
            </div>
            {option.children?.map((childOption) => (
              <DisclosurePanel 
                key={childOption.value} 
                option={childOption} 
                handleCheckboxChange={handleCheckboxChange}
                mockCheckboxOptions={mockCheckboxOptions}
                selectedCheckboxOptions={selectedCheckboxOptions}
              />
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default DisclosurePanel;




// import React, { useState } from 'react';
// import DisclosurePanel, { Option } from './DisclosurePanel'; // Import DisclosurePanel and Option interface from the correct file

// const options: Option[] = [
//   {
//     value: 'Option 1',
//     initialOpen: true,
//     children: [
//       {
//         value: 'Sub-Option 1.1',
//         initialOpen: false,
//         children: [
//           { value: 'Sub-Sub-Option 1.1.1', initialOpen: true },
//           { value: 'Sub-Sub-Option 1.1.2', initialOpen: false },
//         ]
//       },
//       { value: 'Sub-Option 1.2', initialOpen: true },
//     ],
//   },
//   { value: 'Option 2', initialOpen: false },
// ];

// // Flatten options array to generate mockCheckboxOptions
// const flattenOptions = (options: Option[]): string[] => {
//   return options.reduce((acc, option) => {
//     if (option.children) {
//       return [...acc, option.value, ...flattenOptions(option.children)];
//     }
//     return [...acc, option.value];
//   }, [] as string[]);
// };

// const App = () => {
//   const [selectedCheckboxOptions, setSelectedCheckboxOptions] = useState<string[]>([]);
//   const mockCheckboxOptions = flattenOptions(options);

//   const handleCheckboxChange = (option: string) => {
//     if (selectedCheckboxOptions.includes(option)) {
//       setSelectedCheckboxOptions(selectedCheckboxOptions.filter(opt => opt !== option));
//     } else {
//       setSelectedCheckboxOptions([...selectedCheckboxOptions, option]);
//     }
//   };

//   return (
//     <div>
//       {options.map(option => (
//         <DisclosurePanel 
//           key={option.value}
//           option={option}
//           handleCheckboxChange={handleCheckboxChange}
//           mockCheckboxOptions={mockCheckboxOptions}
//           selectedCheckboxOptions={selectedCheckboxOptions}
//         />
//       ))}
//     </div>
//   );
// };

// export default App;
