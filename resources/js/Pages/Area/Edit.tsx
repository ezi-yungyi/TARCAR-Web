// components/forms/EditAreaForm.tsx

import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';

interface GPSLocation {
  latitude: number;
  longitude: number;
}

interface Area {
  id: number;
  name: string;
  campus_location: string;
  gps_location: GPSLocation[];
  nearBy: number[];
}

interface EditAreaFormProps {
  area: Area; // The area to edit
  areas: Area[]; // Available areas for nearby selection
  onSubmit: (areaData: { id: number; name: string; campus_location: string; gps_locations: GPSLocation[]; nearBy: { id: number; name: string }[] }) => void;
}

const EditAreaForm: React.FC<EditAreaFormProps> = ({ area, areas, onSubmit }) => {
  console.log(area.gps_location)
  // SECTION - Form Variables
  const [name, setName] = useState<string>(area.name);
  const [campusLocation, setCampusLocation] = useState<string>(area.campus_location);
  const [nearBy, setNearBy] = useState<{ id: number; name: string }[]>(area.nearBy?.map(id => areas.find(a => a.id === id)!)) || [];
  const [newNearBy, setNewNearBy] = useState<{ id: number; name: string } | null>(null);
  const [gpsLocations, setGpsLocations] = useState<{ latitude: number; longitude: number }[]>(area.gps_location || []);
  const [newLatitude, setNewLatitude] = useState<string>('');
  const [newLongitude, setNewLongitude] = useState<string>('');
  const availableAreas = areas?.map(area => ({ id: area.id, name: area.name })) || [];
  // ! SECTION
  useEffect(() => {
    setGpsLocations(area.gps_location || []);  // Fallback to empty array if gpsLocation is undefined
  }, [area]);

  const addGpsLocation = () => {
    if (Number(newLatitude) !== 0 || Number(newLongitude) !== 0) {
      const isDuplicate = gpsLocations?.some(
        (location) => location.latitude === Number(newLatitude) && location.longitude === Number(newLongitude)
      );

      if (!isDuplicate) {
        setGpsLocations([...gpsLocations, { latitude: Number(newLatitude), longitude: Number(newLongitude) }]);
        setNewLatitude('');
        setNewLongitude('');
        return;
      }
    }
  };

  const removeGpsLocation = (index: number) => {
    setGpsLocations(gpsLocations.filter((_, i) => i !== index));
  };

  const addNearbyArea = () => {
    if (newNearBy && !nearBy.some(nb => nb.id === newNearBy.id)) {
      setNearBy([...nearBy, newNearBy]);
    }
    setNewNearBy(null);
  };

  const removeNearbyArea = (id: number) => {
    setNearBy(nearBy.filter(nb => nb.id !== id));
  };

  const handleSubmit = () => {
    if (name == "" || campusLocation == "") return;

    const areaData = {
      id: area.id, // Pass the existing area ID for update
      name,
      campus_location: campusLocation,
      gps_locations: gpsLocations,
      nearBy,
    };

    onSubmit(areaData); // Call the onSubmit function passed via props
  };

  return (
    <Card className='w-80 p-4'>
      <CardHeader className='w-full flex text-center text-xl font-bold'>
        Edit Area
      </CardHeader>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Area Name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Enter area name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Campus Location */}
      <div className="mb-4 w-full">
        <Label htmlFor="campus_location" className="block text-sm font-medium text-gray-700">
          Campus Location
        </Label>

        <Select
          value={campusLocation}
          onValueChange={(value: string) => setCampusLocation(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select campus location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Campus Location</SelectLabel>
              <SelectItem value="east">East</SelectItem>
              <SelectItem value="west">West</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* GPS Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">GPS Location</label>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Latitude"
            value={newLatitude}
            onChange={(e) => {
              if (!isNaN(Number(e.target.value)) || e.target.value === "") {
                setNewLatitude(e.target.value);
              }
            }}
          />
          <Input
            type="text"
            placeholder="Longitude"
            value={newLongitude}
            onChange={(e) => {
              if (e.target.value === '' || !isNaN(Number(e.target.value))) {
                setNewLongitude(e.target.value);
              }
            }}
          />
          <Button onClick={addGpsLocation}>Add</Button>
        </div>

        <div className="mt-2">
          {gpsLocations?.map((gps, index) => (
            <Card key={index} className="mr-2 mb-2">
              {`Lat: ${gps.latitude}, Lng: ${gps.longitude}`}
              <button onClick={() => removeGpsLocation(index)} className="ml-2 text-red-500">
                x
              </button>
            </Card>
          ))}
        </div>
      </div>

      {/* Nearby Areas */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Nearby Areas</label>
        <div className="flex space-x-2">
          <Select
            value={newNearBy?.id?.toString() || ''}
            onValueChange={(value: string) => {
              const selectedArea = availableAreas.find(area => area.id === Number(value));
              setNewNearBy(selectedArea || null);
            }}
          >
            <SelectTrigger disabled={availableAreas.length == 0}>
              <SelectValue placeholder={(availableAreas.length !== 0) ? "Select Area" : "No Area Available"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Area</SelectLabel>
                {availableAreas?.map(area => (
                  <SelectItem key={area.id} value={area.id.toString()}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={addNearbyArea}>Add</Button>
        </div>

        <div className="mt-2">
          {nearBy?.map((area) => (
            <Card key={area.id} className="mr-2 mb-2">
              {`Area: ${area.name}`}
              <button onClick={() => removeNearbyArea(area.id)} className="ml-2 text-red-500">
                x
              </button>
            </Card>
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit} className='w-full'>Submit</Button>
    </Card>
  );
};

export default EditAreaForm;
