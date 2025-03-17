import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormEvent } from 'react';

interface Area {
  id: number;
  name: string;
  location: string;
  total_spots: number;
}

interface Props extends PageProps {
  areas: {
    data: Area[]
  };
}

export default function Areas({ areas }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    location: '',
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    post(route('parking.areas.store'));
  }


  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Parking Areas
        </h2>
      }
      items={[{label: "Areas", url: "/areas"}]}
    >
      <Head title="Parking Areas" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

          <div className="pb-10">
            <div className="bg-white shadow-md sm:rounded-lg p-6 dark:bg-gray-800">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-200">Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                  {errors.name && <p className="text-red-500">{errors.name}</p>}
                </div>

                {/* Location Input */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-200">Location</label>
                  <input
                    type="text"
                    value={data.location}
                    onChange={(e) => setData('location', e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                  {errors.location && <p className="text-red-500">{errors.location}</p>}
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
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {areas.data.length > 0 ? (
              areas.data.map((area) => (
                <Card key={area.id} className="shadow-lg dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {area.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      📍 Location: {area.location}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      🚗 Total Spots: {area.total_spots}
                    </p>
                  </CardContent>
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
