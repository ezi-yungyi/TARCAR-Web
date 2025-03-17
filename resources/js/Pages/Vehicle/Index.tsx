import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EditCameraForm from './Edit';
import CreateCameraForm from './Create';
import EditVehicleForm from './Edit';
import CreateVehicleForm from './Create';
import { router } from '@inertiajs/react';


interface ParkingArea {
  id: number;
  name: string;
}

interface Vehicle {
  id: number;
  license_plate: string;
  color: string;
  type: string;
}

interface VehicleIndexProps {
  vehicles: Vehicle[];
  parkingAreas: { id: number; name: string }[];
  onCreate: (vehicleData: { license_plate: string; color: string; type: string }) => void;
  onEdit: (vehicleData: { id: number; license_plate: string; color: string; type: string }) => void;
  onDelete: (vehicleId: number) => void;
}

const CameraIndex: React.FC<VehicleIndexProps> = ({ vehicles, parkingAreas, onCreate, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null); // Store selected vehicle for editing

  // Handle edit button click
  const handleEditClick = (vehicle: Vehicle) => {
    setIsEditing(true);
    setSelectedVehicle(vehicle); // Set the selected vehicle to edit
  };

  // Handle create button click
  const handleCreateClick = () => {
    setIsEditing(false);
    setSelectedVehicle(null); // Reset selected vehicle for creating new vehicle
  };

  const handleEdit = (vehicleData: { id: number; license_plate: string; color: string; type: string }) => {
    // Navigate to the store route using Inertia
    router.put(route('vehicles.update', vehicleData.id), vehicleData);
  };

  const handleCreate = (vehicleData: { license_plate: string; color: string; type: string }) => {
    // Navigate to the store route using Inertia
    router.post(route('vehicles.store'), vehicleData);
  };

  const handleDelete = (vehicleId: number) => {
    // Navigate to the store route using Inertia
    router.delete(route('vehicles.destroy', vehicleId));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Vehicle</h2>

      {/* Create New Vehicle Button */}
      <Button onClick={handleCreateClick} className="mb-4">Create New Vehicle</Button>

      {/* Render Create or Edit form based on the state */}
      {isEditing && selectedVehicle ? (
        <EditVehicleForm
          vehicle={selectedVehicle}
          onSubmit={handleEdit} // Pass the onSubmit prop as onEdit function
        />
      ) : (
        <CreateVehicleForm
          onSubmit={handleCreate} // Pass the onSubmit prop as onCreate function
        />
      )}

      {/* Render a list of vehicles */}
      <div className="mt-4">
        {vehicles?.map(vehicle => (
          <Card key={vehicle.id} className="mb-4 p-4">
            <h3>{vehicle.id}</h3>
            <p>Lincense Plate: {vehicle.license_plate}</p>
            <p>Color: {vehicle.color}</p>
            <p>Type: {vehicle.type}</p>
            <div className="mt-2">
              <Button onClick={() => handleEditClick(vehicle)}>Edit</Button>
              <Button className="ml-2" onClick={() => handleDelete(vehicle.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CameraIndex;
