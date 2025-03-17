// components/forms/EditUserForm.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const EditUserForm = ({ user, onSubmit }: { user: any; onSubmit: (userData: { id: number; uni_id: string; name: string; email: string; phone: string; token: number }) => void }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [uni_id, setUniId] = useState(user.uni_id);
  const [token, setToken] = useState(user.token || 0);

  const handleSubmit = () => {
    const updatedUser = { id: user.id, uni_id, name, email, phone, token };
    console.log(updatedUser)
    onSubmit(updatedUser); // Call the onSubmit function passed via props
  };

  return (
    <div>
      <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Input type="text" value={uni_id} onChange={(e) => setUniId(e.target.value)} />

      <Button onClick={handleSubmit}>Update User</Button>
    </div>
  );
};

export default EditUserForm;
