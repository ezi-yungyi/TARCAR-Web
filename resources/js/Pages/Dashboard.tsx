import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

interface Props extends PageProps {
  total_areas: number;
  total_spots: number;
  total_camera: number;
}

export default function Dashboard({ total_areas, total_spots, total_camera }: Props) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Dashboard
        </h2>
      }
      items={[{label: "Dashboard", url: "/"}]}
    >
      <Head title="Dashboard" />

      <div className="py-12 h-full">
        <div className="h-full mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="h-full grid grid-rows-5 gap-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">

            <div className="row-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Areas */}
              <Card>
                <CardHeader>
                  <CardTitle>Total Parking Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{total_areas}</p>
                </CardContent>
              </Card>

              {/* Total Parking Spots */}
              <Card>
                <CardHeader>
                  <CardTitle>Total Parking Spots</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{total_spots}</p>
                </CardContent>
              </Card>

              {/* Total Cameras */}
              <Card>
                <CardHeader>
                  <CardTitle>Total Cameras</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{total_camera}</p>
                </CardContent>
              </Card>
            </div>

            <div className='row-span-4'>
              <Card className="h-full flex items-center justify-center">
                <CardTitle>Analysts Comming Soon</CardTitle>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
