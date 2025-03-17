// components/forms/CreateUserForm.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const CreateUserForm = ({ onSubmit }: { onSubmit: (userData: { uni_id: string; name: string; email: string; phone: string; token: number }) => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [uni_id, setUniId] = useState('');
  const [token, setToken] = useState(0);

  const handleSubmit = () => {
    const userData = { uni_id, name, email, phone, token };
    onSubmit(userData); // Call the onSubmit function passed via props
  };

  return (
    <div>
      <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Input type="text" placeholder="University ID" value={uni_id} onChange={(e) => setUniId(e.target.value)} />

      <Button onClick={handleSubmit}>Create User</Button>
    </div>
  );
};

export default CreateUserForm;
