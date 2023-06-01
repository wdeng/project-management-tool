import { Switch } from '@headlessui/react';

interface ToggleSwitchProps {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, setEnabled, label }) => {
  return (
    <Switch.Group as="div" className="flex items-center space-x-3 pb-4">
      <Switch.Label className='font-semibold'>{label}</Switch.Label>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? 'bg-indigo-600' : 'bg-gray-400'
          } relative inline-flex items-center h-6 rounded-full w-11 transition delay-100 duration-200`}
      >
        <span className="sr-only">Enable or disable</span>
        <span
          className={`${enabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform ease-in-out delay-100 duration-200`}
        />
      </Switch>
    </Switch.Group>
  );
};

export default ToggleSwitch;
