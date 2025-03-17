// components/pages/VehiclePassIndex.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EditVehiclePassForm from './Edit';
import CreateVehiclePassForm from './Create';
import { router } from '@inertiajs/react';

interface VehiclePass {
  id: number;
  parking_user_id: number;
  vehicle_id: number;
  verified_at: string;
  duration: number;
  status: string;
}

interface VehiclePassIndexProps {
  vehiclePasses: VehiclePass[];
  onCreate: (vehiclePassData: { parking_user_id: number; vehicle_id: number; verified_at: string; duration: number; status: string }) => void;
  onEdit: (vehiclePassData: { id: number; parking_user_id: number; vehicle_id: number; verified_at: string; duration: number; status: string }) => void;
  onDelete: (vehiclePassId: number) => void;
}

const VehiclePassIndex: React.FC<VehiclePassIndexProps> = ({ vehiclePasses, onCreate, onEdit, onDelete }) => {
  console.log(vehiclePasses)
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedVehiclePass, setSelectedVehiclePass] = useState<VehiclePass | null>(null); // Store selected vehicle pass for editing

  const handleEditClick = (vehiclePass: VehiclePass) => {
    setIsEditing(true);
    setSelectedVehiclePass(vehiclePass); // Set the selected vehicle pass to edit
  };

  const handleCreateClick = () => {
    setIsEditing(false);
    setSelectedVehiclePass(null); // Clear selected vehicle pass for creating a new vehicle pass
  };

  const handleEdit = (vehiclePassData: { id: number; parking_user_id: number; vehicle_id: number; verified_at: string; duration: number; status: string }) => {
    // Navigate to the store route using Inertia
    router.put(route('vehicle.pass.update', vehiclePassData.id), vehiclePassData);
  };

  const handleCreate = (vehiclePassData: { parking_user_id: number; vehicle_id: number; verified_at: string; duration: number; status: string }) => {
    // Navigate to the store route using Inertia
    router.post(route('vehicle.pass.store'), vehiclePassData);
  };

  const handleDelete = (vehiclePassId: number) => {
    // Navigate to the store route using Inertia
    router.delete(route('vehicle.pass.destroy', vehiclePassId));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Vehicle Passes</h2>

      <Button onClick={handleCreateClick} className="mb-4">Create New Vehicle Pass</Button>

      {/* Display Create Vehicle Pass Form or Edit Vehicle Pass Form */}
      {isEditing && selectedVehiclePass ? (
        <EditVehiclePassForm
          vehiclePass={selectedVehiclePass}
          onSubmit={handleEdit} // Pass the onSubmit prop as onEdit function
        />
      ) : (
        <CreateVehiclePassForm
          onSubmit={handleCreate} // Pass the onSubmit prop as onCreate function
        />
      )}

      {/* List all vehicle passes */}
      <div className="mt-4">
        {vehiclePasses?.map((vehiclePass) => (
          <Card key={vehiclePass.id} className="mb-4 p-4">
            <h3>Parking User ID: {vehiclePass.parking_user_id}</h3>
            <p>Vehicle ID: {vehiclePass.vehicle_id}</p>
            <p>Verified At: {vehiclePass.verified_at}</p>
            <p>Status: {vehiclePass.status}</p>
            <Button onClick={() => handleEditClick(vehiclePass)}>Edit</Button>
            <Button className="ml-2" onClick={() => handleDelete(vehiclePass.id)}>Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VehiclePassIndex;
