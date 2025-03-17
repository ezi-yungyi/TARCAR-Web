import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import CreateAreaForm from './Create';
import EditAreaForm from './Edit';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Area {
  id: number;
  name: string;
  campus_location: string;
  gps_location: { latitude: number, longitude: number }[];
  nearBy: number[];
}

interface Props {
  areas: Area[];
}

const Index = ({ areas }: Props) => {
  // State for handling the form type (Create or Edit)
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  const handleCreateArea = (areaData: {
    name: string;
    campus_location: string;
    gps_locations: { latitude: number, longitude: number }[];
    nearBy: { id: number, name: string }[];
  }) => {
    console.log("Created Area Data:", areaData);
    router.post(route('area.store'), areaData);
    // Handle area creation logic (e.g., API call)
  };

  const handleEditArea = (areaData: {
    id: number;
    name: string;
    campus_location: string;
    gps_locations: { latitude: number, longitude: number }[];
    nearBy: { id: number, name: string }[];
  }) => {
    console.log("Edited Area Data:", areaData);
    // Handle area edit logic (e.g., API call)
  };

  const handleDeleteArea = (areaId: number) => {
    console.log("Deleted Area ID:", areaId);
    router.delete(route('area.destroy', areaId));
    // Handle delete logic (e.g., API call)
  };

  const handleEditClick = (area: Area) => {
    setIsEditing(true);
    setSelectedArea(area); // Set the selected area to edit
  };

  const handleCreateClick = () => {
    setIsEditing(false);
    setSelectedArea(null); // Clear selected area for creating a new area
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Area
        </h2>
      }
      items={[{ label: 'Area', url: '/' }]}
    >
      <Head title="Area" />

      {/* Show Create Form when isEditing is false */}
      {!isEditing && (
        <CreateAreaForm areas={areas} onSubmit={handleCreateArea} />
      )}

      {/* Show Edit Form when isEditing is true and a selected area is available */}
      {isEditing && selectedArea && (
        <EditAreaForm area={selectedArea} areas={areas} onSubmit={handleEditArea} />
      )}

      {/* Display All Areas with Edit and Delete buttons */}
      <div className="mt-4">
        {areas?.map((area) => (
          <Card key={area.id} className="mb-4 p-4">
            <h3>{area.name}</h3>
            <p>Campus Location: {area.campus_location}</p>
            <p>Nearby Areas: {area.nearBy}</p>
            <Button onClick={() => handleEditClick(area)}>Edit</Button>
            <Button className="ml-2" onClick={() => handleDeleteArea(area.id)}>Delete</Button>
          </Card>
        ))}
      </div>

      {/* Button to switch to Create form */}
      <Button onClick={handleCreateClick}>Create New Area</Button>
    </AuthenticatedLayout>
  );
};

export default Index;
