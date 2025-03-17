// components/forms/EditVehicleForm.tsx

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface EditVehicleFormProps {
  vehicle: { id: number; license_plate: string; color: string; type: string };
  onSubmit: (vehicleData: { id: number; license_plate: string; color: string; type: string }) => void;
}

const EditVehicleForm: React.FC<EditVehicleFormProps> = ({ vehicle, onSubmit }) => {
  const [licensePlate, setLicensePlate] = useState<string>(vehicle.license_plate);
  const [color, setColor] = useState<string>(vehicle.color);
  const [type, setType] = useState<string>(vehicle.type);

  const handleSubmit = () => {
    if (!licensePlate || !color || !type) return;

    const updatedVehicle = { id: vehicle.id, license_plate: licensePlate, color, type };
    onSubmit(updatedVehicle); // Pass the updated data back
  };

  return (
    <div className="w-80 p-4">
      <h2>Edit Vehicle</h2>
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

      <Button onClick={handleSubmit}>Update Vehicle</Button>
    </div>
  );
};

export default EditVehicleForm;
