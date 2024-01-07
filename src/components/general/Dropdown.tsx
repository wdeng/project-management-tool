import React, { FC, ReactNode } from 'react';
import { Transition } from '@headlessui/react';

interface Props {
    children: ReactNode;
    show?: boolean;
    // You can add more props here if needed, like duration, enterFrom, leaveTo, etc.
}

const Dropdown: FC<Props> = ({ children, show = undefined }) => {
    return (
        <Transition
            as={React.Fragment}
            show={show}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-90"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-90"
        >
            {children}
        </Transition>
    );
};

export default Dropdown;
