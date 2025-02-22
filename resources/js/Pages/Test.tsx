import { useEffect, useRef, useState } from "react";
import { Head } from "@inertiajs/react";

export default function Test() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [parkingSpots, setParkingSpots] = useState<number[][][]>([]);
  const [currentSpot, setCurrentSpot] = useState<number[][]>([]);

  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const labels = ["BL", "BR", "FR", "FL"];

  // * init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    const image = new Image();
    image.src = "/storage/carpark.jpeg";
    image.onload = () => {
      imageRef.current = image;
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
    };
  }, []);

  // * drawing
  useEffect(() => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;

    const image = imageRef.current;
    if (image) {
      ctx.drawImage(image, 0, 0, image.width, image.height);
    }

    // * exist
    parkingSpots.forEach((spot) => {
      ctx.beginPath();
      ctx.moveTo(spot[0][0], spot[0][1]);
      for (let i = 1; i < spot.length; i++) {
        ctx.lineTo(spot[i][0], spot[i][1]);
      }
      ctx.closePath();
      ctx.strokeStyle = "green";
      ctx.lineWidth = 5;
      ctx.stroke();
    });

    // * current
    if (currentSpot.length > 0) {
      ctx.beginPath();
      ctx.moveTo(currentSpot[0][0], currentSpot[0][1]);
      for (let i = 1; i < currentSpot.length; i++) {
        ctx.lineTo(currentSpot[i][0], currentSpot[i][1]);
      }
      if (currentSpot.length === 4) ctx.closePath();
      ctx.strokeStyle = "orange";
      ctx.lineWidth = 5;
      ctx.stroke();

      currentSpot.forEach((point, index) => {
        // **Draw Point**
        ctx.beginPath();
        ctx.arc(point[0], point[1], 6, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();

        // **Show Text**
        ctx.fillStyle = "red";
        ctx.font = "bold 16px Arial";
        ctx.fillText(labels[index], point[0] + 10, point[1] - 10);
      });

    }

    // **Follow Mouse and Show Text**
    if (mousePos && currentSpot.length < 4) {
      ctx.fillStyle = "black";
      ctx.font = "bold 16px Arial";
      ctx.fillText(labels[currentSpot.length], mousePos.x + 10, mousePos.y);
    }
  }, [parkingSpots, currentSpot, mousePos]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    if (isDragging) return;
    if (currentSpot.length >= 4) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    setCurrentSpot((prev) => [...prev, [x, y]]);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    setMousePos({ x, y });

    if (isDragging && dragIndex !== null) {
      setCurrentSpot((prev) => {
        const updatedSpots = [...prev];
        updatedSpots[dragIndex] = [x, y];
        return updatedSpots;
      });
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    for (let i = 0; i < currentSpot.length; i++) {
      const [px, py] = currentSpot[i];
      const distance = Math.sqrt((px - x) ** 2 + (py - y) ** 2);
      if (distance < 10) {
        setIsDragging(true);
        setDragIndex(i);
        return;
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragIndex(null);
  };

  const handleConfirmParkingSpot = () => {
    if (currentSpot.length === 4) {
      setParkingSpots((prev) => [...prev, currentSpot]);
      setCurrentSpot([]);
    }
  };

  return (
    <>
      <Head title="Parking Spot Drawer" />
      <div className="h-screen p-12 bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
        <canvas
          ref={canvasRef}
          className="size-full rounded-2xl cursor-crosshair"
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        ></canvas>

        <button
          onClick={handleConfirmParkingSpot}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Confirm Parking Slot
        </button>
      </div>
    </>
  );
}
