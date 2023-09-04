import { Switch } from '@headlessui/react';

interface ToggleSwitchProps {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, setEnabled, label }) => {
  return (
    <Switch.Group as="div" className="flex items-center justify-between space-x-3">
      <Switch.Label className='font-medium'>{label}</Switch.Label>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? 'bg-indigo-500' : 'bg-gray-400'
          } relative inline-flex items-center h-4 rounded-full w-8 transition delay-100 duration-200`}
      >
        <span className="sr-only">Enable or disable</span>
        <span
          className={`${enabled ? 'translate-x-4' : 'translate-x-[-0.25rem]'
            } inline-block w-5 h-5 transform bg-white rounded-full transition-transform ease-in-out delay-100 duration-200 drop-shadow-lg`}
        />
      </Switch>
    </Switch.Group>
  );
};

export default ToggleSwitch;
