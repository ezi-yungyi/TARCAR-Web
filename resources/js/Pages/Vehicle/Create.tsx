// components/forms/CreateVehicleForm.tsx

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface CreateVehicleFormProps {
  onSubmit: (vehicleData: { license_plate: string; color: string; type: string }) => void;
}

const CreateVehicleForm: React.FC<CreateVehicleFormProps> = ({ onSubmit }) => {
  const [licensePlate, setLicensePlate] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [type, setType] = useState<string>('');

  const handleSubmit = () => {
    if (!licensePlate || !color || !type) return;

    const vehicleData = { license_plate: licensePlate, color, type };
    onSubmit(vehicleData); // Call the onSubmit function passed via props
  };

  return (
    <div className="w-80 p-4">
      <h2>Create Vehicle</h2>
      <div className="mb-4">
        <label htmlFor="license_plate">License Plate</label>
        <Input
          id="license_plate"
          type="text"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
          placeholder="Enter vehicle license plate"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="color">Color</label>
        <Input
          id="color"
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="Enter vehicle color"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="type">Type</label>
        <Input
          id="type"
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Enter vehicle type"
        />
      </div>

      <Button onClick={handleSubmit}>Create Vehicle</Button>
    </div>
  );
};

export default CreateVehicleForm;
