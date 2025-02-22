import { useEffect, useRef, useState, useCallback } from "react";
import { Head } from "@inertiajs/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Hand, Pencil, Trash2 } from "lucide-react";
import axios from "axios";

export default function Welcome() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const resizeTimeout = useRef<NodeJS.Timeout | null>(null);

  const [parkingSpots, setParkingSpots] = useState<number[][][]>([]);
  const [currentSpot, setCurrentSpot] = useState<number[][]>([]);
  const labels = ["BL", "BR", "FR", "FL"];
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [imageScale, setImageScale] = useState<number>(0);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number } | null>(null);
  const [emptySpace, setEmptySpace] = useState({ x: 0, y: 0 })

  const [clicking, setClicking] = useState(false);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const [lastMousePosition, setLastMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [mouseActualPosition, setMouseActualPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [mode, setMode] = useState<'move' | 'edit' | 'delete'>();

  // ? Image Processing
  const processImage = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // * View Port Size
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    ctxRef.current = ctx;

    // * Load Image
    const image = new Image();
    image.src = "/storage/carpark.jpeg";
    image.onload = () => {
      const imageWidth = image.width;
      const imageHeight = image.height;
      setImageSize({ width: imageWidth, height: imageHeight })

      const widthScale = containerWidth / imageWidth;
      const heightScale = containerHeight / imageHeight;
      const usedScale = (imageHeight * widthScale <= containerHeight) ? widthScale : heightScale;
      setImageScale(usedScale);

      const calculatedWidth = imageWidth * usedScale;
      const calculatedHeight = imageHeight * usedScale;

      const presetCanvas = document.createElement("canvas");
      const presetCtx = presetCanvas.getContext("2d");
      if (!presetCtx) return;

      presetCanvas.width = containerWidth;
      presetCanvas.height = containerHeight;

      presetCtx.fillStyle = "black";
      presetCtx.fillRect(0, 0, presetCanvas.width, presetCanvas.height);

      const centerX = (presetCanvas.width - calculatedWidth) / 2;
      const centerY = (presetCanvas.height - calculatedHeight) / 2;
      setEmptySpace({ x: centerX, y: centerY });

      presetCtx.drawImage(image, centerX, centerY, calculatedWidth, calculatedHeight);

      const processedImage = new Image();
      processedImage.src = presetCanvas.toDataURL("image/png");
      imageRef.current = processedImage;
      processedImage.onload = () => {
        ctx.drawImage(processedImage, 0, 0, container.clientWidth, container.clientHeight);
      };
    };
  }, []);



  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left - translate.x) / zoomScale;
    const mouseY = (event.clientY - rect.top - translate.y) / zoomScale;
    setMousePosition({ x: mouseX, y: mouseY });

    if (mode === "move") {
      if (!lastMousePosition) return;

      const dx = event.clientX - lastMousePosition.x;
      const dy = event.clientY - lastMousePosition.y;

      let newTranslateX = translate.x + dx;
      let newTranslateY = translate.y + dy;

      const viewportWidth = canvas.clientWidth;
      const viewportHeight = canvas.clientHeight;
      const canvasWidth = canvas.width * zoomScale;
      const canvasHeight = canvas.height * zoomScale;

      if (newTranslateX < -(canvasWidth - viewportWidth)) newTranslateX = -(canvasWidth - viewportWidth);
      if (newTranslateY < -(canvasHeight - viewportHeight)) newTranslateY = -(canvasHeight - viewportHeight);
      if (newTranslateX > 0) newTranslateX = 0;
      if (newTranslateY > 0) newTranslateY = 0;

      setTranslate({ x: newTranslateX, y: newTranslateY });
      setLastMousePosition({ x: event.clientX, y: event.clientY });
    }
    else if (mode === "edit") {
      if (isDragging && dragIndex !== null) {
        setCurrentSpot((prev) => {
          const updatedSpots = [...prev];
          updatedSpots[dragIndex] = [Math.round(mouseActualPosition.x), Math.round(mouseActualPosition.y)];
          return updatedSpots;
        });
      }
    };

  };

  // ? 📌 Handle Zoom In & Out
  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    // event.preventDefault();
    if (mode === "move") {
      const zoomIntensity = 0.1;
      const newScale = event.deltaY > 0 ? zoomScale * (1 - zoomIntensity) : zoomScale * (1 + zoomIntensity);
      const clampedScale = Math.max(1, Math.min(newScale, 5));

      const canvas = canvasRef.current;
      if (!canvas) return;

      const viewportWidth = canvas.clientWidth;
      const viewportHeight = canvas.clientHeight;
      const canvasWidth = canvas.width * clampedScale;
      const canvasHeight = canvas.height * clampedScale;

      let newTranslateX = event.clientX - (event.clientX - translate.x) * clampedScale / zoomScale;
      let newTranslateY = event.clientY - (event.clientY - translate.y) * clampedScale / zoomScale;

      if (newTranslateX < -(canvasWidth - viewportWidth)) newTranslateX = -(canvasWidth - viewportWidth);
      if (newTranslateY < -(canvasHeight - viewportHeight)) newTranslateY = -(canvasHeight - viewportHeight);
      if (newTranslateX > 0) newTranslateX = 0;
      if (newTranslateY > 0) newTranslateY = 0;

      const centerX = (viewportWidth / 2 - translate.x) / zoomScale;
      const centerY = (viewportHeight / 2 - translate.y) / zoomScale;

      setZoomScale(clampedScale);
      setZoomPosition({ x: centerX, y: centerY });
      setTranslate({ x: newTranslateX, y: newTranslateY });
    };
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== "edit") return;
    if (!canvasRef.current) return;
    if (isDragging) return;
    if (currentSpot.length >= 4) return;

    setCurrentSpot((prev) => [...prev, [Math.round(mouseActualPosition.x), Math.round(mouseActualPosition.y)]]);
  };

  // ? Handle Mouse Click
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (event.button === 0) {
      if (mode === "move") {
        setClicking(true);
        setLastMousePosition({ x: event.clientX, y: event.clientY });
      }
      else if (mode === "edit") {
        for (let i = 0; i < currentSpot.length; i++) {
          const [px, py] = currentSpot[i];
          const distance = Math.sqrt((px - mouseActualPosition.x) ** 2 + (py - mouseActualPosition.y) ** 2);
          if (distance < 15) {
            setIsDragging(true);
            setDragIndex(i);
            return;
          }
        }
      } else if (mode === "delete") {
        setParkingSpots((prev) =>
          prev.filter((spot) => {
            const crossX = (spot[0][0] + spot[1][0] + spot[2][0] + spot[3][0]) / 4;
            const crossY = (spot[0][1] + spot[1][1] + spot[2][1] + spot[3][1]) / 4;
            const distance = Math.sqrt((crossX - mouseActualPosition.x) ** 2 + (crossY - mouseActualPosition.y) ** 2);
            return distance > 15;
          })
        );
      }
    }
  };

  const handleMouseUp = () => {
    if (mode === "move") {
      setClicking(false);
      setLastMousePosition(null);
    } else if (mode === "edit") {
      setIsDragging(false);
      setDragIndex(null);
    }
  };

  const getX = (x: number) => {
    return x - emptySpace.x / imageScale;
  }

  const getY = (y: number) => {
    return (y - emptySpace.y) / imageScale;
  }

  const findX = (x: number) => {
    return x * imageScale + emptySpace.x;
  }

  const findY = (y: number) => {
    return y * imageScale + emptySpace.y;
  }


  // ? 📌 Handle Mouse Moving & Zoom & Drag
  useEffect(() => {
    if (!imageRef.current) return;
    const image = imageRef.current;

    if (!ctxRef.current) return;
    const ctx = ctxRef.current;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(image, 0, 0, image.width, image.height);
    ctx.setTransform(zoomScale, 0, 0, zoomScale, translate.x, translate.y);


    if (mousePosition) {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(mousePosition.x, mousePosition.y, 5, 0, Math.PI * 2);
      ctx.fill();

      const actualPositionX = (mousePosition.x - emptySpace.x) / (imageScale);
      const actualPositionY = (mousePosition.y - emptySpace.y) / (imageScale);
      setMouseActualPosition({ x: (actualPositionX > 0) ? actualPositionX : 0, y: (actualPositionY > 0) ? actualPositionY : 0 })

      ctx.font = "16px Arial";
      ctx.fillText(`(${Math.round((mousePosition.x - emptySpace.x) / (imageScale))}, ${Math.round((mousePosition.y - emptySpace.y) / (imageScale))})`, mousePosition.x + 10, mousePosition.y + 15);
    }

    // * exist
    parkingSpots.forEach((spot) => {
      ctx.beginPath();
      ctx.moveTo(findX(spot[0][0]), findY(spot[0][1]));
      for (let i = 1; i < spot.length; i++) {
        ctx.lineTo(findX(spot[i][0]), findY(spot[i][1]));
      }
      ctx.closePath();
      ctx.strokeStyle = "green";
      ctx.lineWidth = 3;
      ctx.stroke();

      if (mode !== "delete") {
        ctx.beginPath();
        ctx.moveTo(findX(spot[0][0]), findY(spot[0][1]));
        ctx.lineTo(findX(spot[2][0]), findY(spot[2][1]));
        ctx.moveTo(findX(spot[1][0]), findY(spot[1][1]));
        ctx.lineTo(findX(spot[3][0]), findY(spot[3][1]));
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        const centerX = (findX(spot[0][0]) + findX(spot[1][0]) + findX(spot[2][0]) + findX(spot[3][0])) / 4;
        const centerY = (findY(spot[0][1]) + findY(spot[1][1]) + findY(spot[2][1]) + findY(spot[3][1])) / 4;

        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
      }
    });

    // * current
    if (currentSpot.length > 0) {
      ctx.beginPath();
      ctx.moveTo(currentSpot[0][0] * imageScale + emptySpace.x, currentSpot[0][1] * imageScale + emptySpace.y);
      for (let i = 1; i < currentSpot.length; i++) {
        ctx.lineTo(currentSpot[i][0] * imageScale + emptySpace.x, currentSpot[i][1] * imageScale + emptySpace.y);
      }
      if (currentSpot.length === 4) ctx.closePath();
      ctx.strokeStyle = "orange";
      ctx.lineWidth = 5;
      ctx.stroke();

      currentSpot.forEach((point, index) => {
        // **Draw Point**
        ctx.beginPath();
        ctx.arc((point[0] * imageScale + emptySpace.x), (point[1] * imageScale + emptySpace.y), 6, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();

        // **Show Text**
        ctx.fillStyle = "red";
        ctx.font = "bold 16px Arial";
        ctx.fillText(labels[index], (point[0] * imageScale + emptySpace.x) + 10, (point[1] * imageScale + emptySpace.y) - 10);
      });

    }

    // **Follow Mouse and Show Text**
    if (mode === "edit") {
      if (mousePosition && currentSpot.length < 4) {
        ctx.fillStyle = "black";
        ctx.font = "bold 16px Arial";
        ctx.fillText(labels[currentSpot.length], mousePosition.x + 10, mousePosition.y);
      }
    }

  }, [zoomScale, zoomPosition, translate, parkingSpots, currentSpot, mousePosition]);

  // ? 📌 Handle Resize Web View
  useEffect(() => {
    processImage();
    const handleResize = () => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
      resizeTimeout.current = setTimeout(() => {
        processImage();
      }, 300);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
    };
  }, [processImage]);

  // ✅ **1. 获取停车位列表**
  const fetchParkingSpots = useCallback(async () => {
    try {
      const response = await axios.get("https://tarcar.multixers.cloud/parking-spots");
      const spots = response.data.parkingSpots.map((spot: any) => JSON.parse(spot.position));
      setParkingSpots(spots);
    } catch (error) {
      console.error("Failed to fetch parking spots:", error);
    }
  }, []);

  // ✅ **2. 创建新的停车位**
  const handleConfirmParkingSpot = async () => {
    if (currentSpot.length === 4) {
      try {
        const response = await axios.post("https://tarcar.multixers.cloud/parking-spots", {
          code: `Spot-${Date.now()}`, // 生成唯一 code
          position: currentSpot,
          status: "available"
        });
        setParkingSpots([...parkingSpots, JSON.parse(response.data.parkingSpot.position)]);
        setCurrentSpot([]);
      } catch (error) {
        console.error("Failed to create parking spot:", error);
      }
    }
  };

  // ✅ **3. 删除停车位**
  const handleDeleteParkingSpot = async (spotIndex: number) => {
    try {
      // 先获取 parkingSpot ID
      const response = await axios.get("https://tarcar.multixers.cloud/parking-spots");
      const spots = response.data.parkingSpots;
      const spotId = spots[spotIndex]?.id;

      if (!spotId) return;

      await axios.delete(`https://tarcar.multixers.cloud/parking-spots/${spotId}`);

      // 删除本地状态
      setParkingSpots((prev) => prev.filter((_, index) => index !== spotIndex));
    } catch (error) {
      console.error("Failed to delete parking spot:", error);
    }
  };

  // ✅ **4. 组件加载时获取停车位**
  useEffect(() => {
    fetchParkingSpots();
  }, [fetchParkingSpots]);


  return (
    <div>
      <Head title="Canvas Mouse Position" />

      <div className="h-svh w-full p-12 flex flex-col gap-2">
        <div
          ref={containerRef}
          className="size-full"
        >
          <canvas
            ref={canvasRef}
            className=
            {`
              ${mode === 'move' && 'cursor-grab'} ${(mode === 'move' && clicking) && 'cursor-grabbing'}
              ${mode === 'edit' && 'cursor-crosshair'}
            `}
            onClick={handleCanvasClick}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
        <div className="bg-slate-600 flex gap-2 p-2 justify-center items-center">
          <ToggleGroup
            type="single"

            variant="outline"
            value={mode}
            onValueChange={(value) => {
              if (value) setMode(value as "move" | "edit" | "delete");
            }}
          >
            <ToggleGroupItem value="move" aria-label="Move">
              <Hand className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="edit" aria-label="Edit">
              <Pencil className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="delete" aria-label="Delete">
              <Trash2 className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <button
            onClick={handleConfirmParkingSpot}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Confirm Parking Slot
          </button>
        </div>
      </div>
    </div>
  );
}
