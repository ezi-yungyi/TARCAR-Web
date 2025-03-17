import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

interface ParkingSpot {
  id: number;
  index: string;
  position: string;
  occupied: boolean;
}

interface Camera {
  id: number;
  index: string;
  image_path: string;
  status: string;
  type: string;
}

interface AreaData {
  id: number;
  name: string;
  location: string;
  total_spots: number;
  spots: ParkingSpot[];
  cameras: Camera[];
}

interface Props extends PageProps {
  area: { data: AreaData };
}

export default function Area({ area }: Props) {
  const [spots, setSpots] = useState<ParkingSpot[]>(area.data.spots);

  useEffect(() => {
    // 监听 WebSocket 事件
    const channel = window.Echo.channel('parking-spot-status');

    channel.listen('ParkingSpotUpdate', (e: { spot_id: string; occupied: string }) => {
      const number_SpotId = Number(e.spot_id);
      const boolean_Occupied = e.occupied == 'true';

      setSpots((prevSpots) =>
        prevSpots.map((spot) =>
          spot.id === number_SpotId ? { ...spot, occupied: boolean_Occupied } : spot
        )
      );
      // console.log(`🚗 Spot ${e.spot_id} updated: ${boolean_Occupied ? 'Occupied' : 'Available'}`);
    });

    return () => {
      channel.stopListening('ParkingSpotUpdate');
    };
  }, []);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          {area.data.name}
        </h2>
      }
      items={[{label: "Areas", url: "/areas"}, {label: area.data.name, url: `/areas/${area.data.id}`}]}
    >
      <Head title={area.data.name} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
            <p className="text-gray-600 dark:text-gray-300">📍 Location: {area.data.location}</p>
            <p className="text-gray-600 dark:text-gray-300">🚗 Total Spots: {area.data.total_spots}</p>

            {/* Parking Spots */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Parking Spots</h3>
              {spots.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {spots.map((spot) => (
                    <li key={spot.id} className={`p-2 border rounded-md dark:border-gray-600 ${spot.occupied ? 'bg-red-200 dark:bg-red-700' : 'bg-green-200 dark:bg-green-700'}`}>
                      🅿️ Spot {spot.id} - Status: {spot.occupied ? "Occupied" : "Available"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No parking spots available.</p>
              )}
            </div>

            {/* Cameras */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cameras</h3>
              {area.data.cameras.length > 0 ? (
                <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {area.data.cameras.map((camera) => (
                    <li key={camera.id} className="p-4 border rounded-lg dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-200">🎥 Camera {camera.id}</p>
                      <img
                        src={camera.image_path}
                        alt={`Camera ${camera.id}`}
                        className="mt-2 w-full h-40 object-cover rounded-md shadow-md"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Status: {camera.status}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No cameras available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
