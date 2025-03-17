import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EditCameraForm from './Edit';
import CreateCameraForm from './Create';
import { router } from '@inertiajs/react';


interface ParkingArea {
  id: number;
  name: string;
}

interface Camera {
  id: number;
  index: string;
  parkingArea: ParkingArea;
  source: string;
  status: string;
  type: string;
}

interface CameraIndexProps {
  cameras: Camera[];
  parkingAreas: { id: number; name: string }[];
  onCreate: (cameraData: { index: string; parking_area_id: number; source: string; status: string; type: string }) => void;
  onEdit: (cameraData: { id: number; index: string; parking_area_id: number; source: string; status: string; type: string }) => void;
  onDelete: (cameraId: number) => void;
}

const CameraIndex: React.FC<CameraIndexProps> = ({ cameras, parkingAreas, onCreate, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null); // Store selected camera for editing

  // Handle edit button click
  const handleEditClick = (camera: Camera) => {
    setIsEditing(true);
    setSelectedCamera(camera); // Set the selected camera to edit
  };

  // Handle create button click
  const handleCreateClick = () => {
    setIsEditing(false);
    setSelectedCamera(null); // Reset selected camera for creating new camera
  };

  const handleEdit = (cameraData: { id: number; index: string; parking_area_id: number; source: string; status: string; type: string }) => {
    // Navigate to the store route using Inertia
    router.put(route('parking.camera.update', cameraData.id), cameraData);
  };

  const handleCreate = (cameraData: { index: string; parking_area_id: number; source: string; status: string; type: string }) => {
    // Navigate to the store route using Inertia
    router.post(route('parking.camera.store'), cameraData);
  };

  const handleDelete = (cameraId: number) => {
    // Navigate to the store route using Inertia
    router.delete(route('parking.camera.destroy', cameraId));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Cameras</h2>

      {/* Create New Camera Button */}
      <Button onClick={handleCreateClick} className="mb-4">Create New Camera</Button>

      {/* Render Create or Edit form based on the state */}
      {isEditing && selectedCamera ? (
        <EditCameraForm
          camera={selectedCamera}
          parkingAreas={parkingAreas}
          onSubmit={handleEdit} // Pass the onSubmit prop as onEdit function
        />
      ) : (
        <CreateCameraForm
          parkingAreas={parkingAreas}
          onSubmit={handleCreate} // Pass the onSubmit prop as onCreate function
        />
      )}

      {/* Render a list of cameras */}
      <div className="mt-4">
        {cameras?.map(camera => (
          <Card key={camera.id} className="mb-4 p-4">
            <h3>{camera.index}</h3>
            <p>Source: {camera.source}</p>
            <p>Status: {camera.status}</p>
            <p>Type: {camera.type}</p>
            <div className="mt-2">
              <Button onClick={() => handleEditClick(camera)}>Edit</Button>
              <Button className="ml-2" onClick={() => handleDelete(camera.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CameraIndex;
