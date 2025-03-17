import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';

interface Area {
  id: number;
  area_id: number;
  name: string;
}

interface Props extends PageProps {
  areas: {
    data: Area[]
  };
}

export default function Index({ areas }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    area_id: '',
    name: '',
  });

  const [isEditing, setIsEditing] = useState(false);  // To toggle edit mode
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);  // Store the area to edit

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    post(route('parking.area.store'));
  }

  // Handle Edit
  const handleEditClick = (area: Area) => {
    setSelectedArea(area);  // Set the area to be edited
    setIsEditing(true);
    setData('area_id', area.area_id.toString());
    setData('name', area.name);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Make a PUT request to update the area
    router.put(route('parking.area.update', selectedArea?.id), data);
  };

  // Handle Delete
  const handleDeleteClick = (id: number) => {
    if (confirm('Are you sure you want to delete this area?')) {
      // Send DELETE request
      router.delete(route('parking.area.destroy', id));
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Parking Areas
        </h2>
      }
      items={[{ label: "Areas", url: "/areas" }]}
    >
      <Head title="Parking Areas" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Create or Edit Area Form */}
          {isEditing ? (
            <div className="bg-white shadow-md sm:rounded-lg p-6 dark:bg-gray-800">
              <h3 className="text-lg font-semibold">Edit Area</h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                  <label className="block text-gray-700 dark:text-gray-200">Area Id</label>
                  <input
                    type="text"
                    value={data.area_id}
                    onChange={(e) => setData('area_id', e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                  {errors.area_id && <p className="text-red-500">{errors.area_id}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-200">Area Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                  {errors.name && <p className="text-red-500">{errors.name}</p>}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {processing ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white shadow-md sm:rounded-lg p-6 dark:bg-gray-800">
              <h3 className="text-lg font-semibold">Create Area</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-200">Area Id</label>
                  <input
                    type="text"
                    value={data.area_id}
                    onChange={(e) => setData('area_id', e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                  {errors.area_id && <p className="text-red-500">{errors.area_id}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-200">Area Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                  {errors.name && <p className="text-red-500">{errors.name}</p>}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {processing ? 'Saving...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8">
            {areas.data.length > 0 ? (
              areas.data.map((area) => (
                <Card key={area.id} className="shadow-lg dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {area.name}
                    </CardTitle>
                  </CardHeader>
                  <div className="flex justify-end p-2">
                    <Button onClick={() => handleEditClick(area)} className="mr-2">
                      Edit
                    </Button>
                    <Button onClick={() => handleDeleteClick(area.id)} className="ml-2" color="red">
                      Delete
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                No parking areas available.
              </p>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
