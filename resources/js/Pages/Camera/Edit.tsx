// components/forms/CreateCameraForm.tsx

import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface ParkingArea {
  id: number;
  name: string;
}

interface EditCameraFormProps {
  camera: Camera
  parkingAreas: ParkingArea[];
  onSubmit: (cameraData: { id:number; index: string; parking_area_id: number; source: string; status: string; type: string }) => void;
}

interface Camera {
  id: number;
  index: string;
  parkingArea: ParkingArea;
  source: string;
  status: string;
  type: string;
}

const CreateCameraForm: React.FC<EditCameraFormProps> = ({ camera, parkingAreas, onSubmit }) => {
  const [index, setIndex] = useState<string>(camera.index);
  const [parkingArea, setParkingArea] = useState<{ id: number; name: string }>(camera.parkingArea);
  const [type, setType] = useState<string>(camera.type);
  const [source, setSource] = useState<string>(camera.source);
  const [status, setStatus] = useState<string>(camera.status);
  const availableParkingAreas = parkingAreas?.map(area => ({ id: area.id, name: area.name })) || [];

  const handleSubmit = () => {
    if (!index || !parkingArea) return;

    const cameraData = { id: camera.id, index, parking_area_id: parkingArea.id, source, status, type };
    onSubmit(cameraData);
  };

  return (
    <Card className='w-80 p-4'>
      <CardHeader className='w-full flex text-center text-xl font-bold'>
        Edit Camera
      </CardHeader>

      <div className="mb-4">
        <Label htmlFor="index">Camera Index</Label>
        <Input
          id="index"
          type="text"
          placeholder="Enter camera index"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="parking_area_id">Parking Area</Label>
        <Select
          value={parkingArea?.id.toString() || ''}
          onValueChange={(value) => {
            const selectedArea = availableParkingAreas.find(area => area.id === Number(value));
            if (selectedArea) {
              setParkingArea(selectedArea)
            }
          }}
        >

          <SelectTrigger disabled={availableParkingAreas?.length === 0}>
            <SelectValue placeholder={(availableParkingAreas?.length !== 0) ? "Select Paking Area" : "No Area Available"} />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Parking Area</SelectLabel>
              {parkingAreas?.map(area => (
                <SelectItem key={area.id} value={String(area.id)}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={(value) => setType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select camera type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="scanner">Scanner</SelectItem>
              <SelectItem value="tracker">Tracker</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select camera status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="maintain">Maintainance</SelectItem>
              <SelectItem value="terminate">Terminated</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button className='w-full' onClick={handleSubmit}>Edit Camera</Button>
    </Card>
  );
};

export default CreateCameraForm;
