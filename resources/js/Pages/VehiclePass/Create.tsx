// components/forms/CreateVehiclePassForm.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const CreateVehiclePassForm = ({ onSubmit }: { onSubmit: Function }) => {
  const [parkingUserId, setParkingUserId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [verifiedAt, setVerifiedAt] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = () => {
    const vehiclePassData = {
      parking_user_id: parkingUserId,
      vehicle_id: vehicleId,
      verified_at: verifiedAt,
      duration: parseFloat(duration),
      status,
    };
    onSubmit(vehiclePassData); // Call the onSubmit function passed via props
  };

  return (
    <div>
      <Input value={parkingUserId} onChange={(e) => setParkingUserId(e.target.value)} placeholder="Parking User ID" />
      <Input value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} placeholder="Vehicle ID" />
      <Input value={verifiedAt} onChange={(e) => setVerifiedAt(e.target.value)} placeholder="Verified At" />
      <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration" />
      <Input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />

      <Button onClick={handleSubmit}>Create Vehicle Pass</Button>
    </div>
  );
};

export default CreateVehiclePassForm;
