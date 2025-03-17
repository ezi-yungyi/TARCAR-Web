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

interface CameraFormProps {
  parkingAreas: ParkingArea[];
  onSubmit: (cameraData: { index: string; parking_area_id: number; source: string; status: string; type: string }) => void;
}

interface Camera {
  id: number;
  index: string;
  parking_area_id: number;
  source: string;
  status: string;
  type: string;
}

const CreateCameraForm: React.FC<CameraFormProps> = ({ parkingAreas, onSubmit }) => {
  const [index, setIndex] = useState<string>('');
  const [parkingArea, setParkingArea] = useState<{ id: number; name: string }>();
  const [type, setType] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [status, setStatus] = useState<string>('Setup');
  const availableParkingAreas = parkingAreas?.map(area => ({ id: area.id, name: area.name })) || [];

  const handleSubmit = () => {
    if (!index || !parkingArea) return;

    const cameraData = { index, parking_area_id: parkingArea.id, source, status, type };
    onSubmit(cameraData);
  };

  return (
    <Card className='w-80 p-4'>
      <CardHeader className='w-full flex text-center text-xl font-bold'>
        Create Camera
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
            setParkingArea(selectedArea)
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

      <Button className='w-full' onClick={handleSubmit}>Create Camera</Button>
    </Card>
  );
};

export default CreateCameraForm;
