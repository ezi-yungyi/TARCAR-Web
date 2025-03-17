// components/forms/EditVehiclePassForm.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const EditVehiclePassForm = ({ vehiclePass, onSubmit }: { vehiclePass: any; onSubmit: Function }) => {
  const [parkingUserId, setParkingUserId] = useState(vehiclePass.parking_user_id);
  const [vehicleId, setVehicleId] = useState(vehiclePass.vehicle_id);
  const [verifiedAt, setVerifiedAt] = useState(vehiclePass.verified_at);
  const [duration, setDuration] = useState(vehiclePass.duration);
  const [status, setStatus] = useState(vehiclePass.status);

  const handleSubmit = () => {
    const updatedVehiclePass = {
      id: vehiclePass.id,
      parking_user_id: parkingUserId,
      vehicle_id: vehicleId,
      verified_at: verifiedAt,
      duration: parseFloat(duration),
      status,
    };
    onSubmit(updatedVehiclePass); // Call the onSubmit function passed via props
  };

  return (
    <div>
      <Input value={parkingUserId} onChange={(e) => setParkingUserId(e.target.value)} placeholder="Parking User ID" />
      <Input value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} placeholder="Vehicle ID" />
      <Input value={verifiedAt} onChange={(e) => setVerifiedAt(e.target.value)} placeholder="Verified At" />
      <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration" />
      <Input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />

      <Button onClick={handleSubmit}>Update Vehicle Pass</Button>
    </div>
  );
};

export default EditVehiclePassForm;
