// components/pages/UserIndex.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EditUserForm from './Edit';
import CreateUserForm from './Create';
import { router } from '@inertiajs/react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  token: number;
  uni_id: string;
}

interface UserIndexProps {
  users: User[];
  onCreate: (userData: { uni_id: string; name: string; email: string; phone: string; token: number }) => void;
  onEdit: (userData: { id: number; uni_id: string; name: string; email: string; phone: string; token: number }) => void;
  onDelete: (userId: number) => void;
}

const UserIndex: React.FC<UserIndexProps> = ({ users, onCreate, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Store selected user for editing

  const handleEditClick = (user: User) => {
    setIsEditing(true);
    setSelectedUser(user); // Set the selected user to edit
  };

  const handleEdit = (userData: { id: number; uni_id: string; name: string; email: string; phone: string; token: number }) => {
    // Navigate to the store route using Inertia
    router.put(route('user.update', userData.id), userData);
  };

  const handleCreateClick = () => {
    setIsEditing(false);
    setSelectedUser(null); // Clear selected user for creating a new user
  };

  const handleCreate = (userData: { uni_id: string; name: string; email: string; phone: string; token: number }) => {
    // Navigate to the store route using Inertia
    router.post(route('user.store'), userData);
  };

  const handleDelete = (userId: number) => {
    // Navigate to the store route using Inertia
    router.delete(route('user.destroy', userId));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Users</h2>

      <Button onClick={handleCreateClick} className="mb-4">Create New User</Button>

      {/* Display Create User Form or Edit User Form */}
      {isEditing && selectedUser ? (
        <EditUserForm
          user={selectedUser}
          onSubmit={handleEdit} // Pass the onSubmit prop as onEdit function
        />
      ) : (
        <CreateUserForm
          onSubmit={handleCreate} // Pass the onSubmit prop as onCreate function
        />
      )}

      {/* List all users */}
      <div className="mt-4">
        {users?.map((user) => (
          <Card key={user.id} className="mb-4 p-4">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>{user.phone}</p>
            <p>Token: {user.token}</p>
            <div className="mt-2">
              <Button onClick={() => handleEditClick(user)}>Edit</Button>
              <Button className="ml-2" onClick={() => handleDelete(user.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserIndex;
