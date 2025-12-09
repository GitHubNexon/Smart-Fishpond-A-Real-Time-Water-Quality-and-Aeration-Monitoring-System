//src/components/customs/image-modal-viewer.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { X, ZoomIn, ZoomOut, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageModalViewerProps {
  imageViewerOpen: boolean;
  imageViewerClose: () => void;
  images: (string | Blob)[]; // Array of URLs, base64 strings, or Blobs
  isMulti?: boolean;
  title?: string;
  currentIndex?: number; // Optional: Start at specific image
  downloadFileName?: string | ((index: number) => string); // Custom file name or function
}

interface DraggableImageProps {
  src: string;
  alt: string;
  zoom: number;
  id: string;
  position: { x: number; y: number };
}

function DraggableImage({ src, alt, zoom, id, position }: DraggableImageProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      disabled: zoom <= 100,
    });

  const style = {
    cursor: zoom > 100 ? (isDragging ? 'grabbing' : 'grab') : 'default',
    touchAction: zoom > 100 ? 'none' : 'auto',
  };

  // Calculate final position
  const finalX = position.x + (transform?.x || 0);
  const finalY = position.y + (transform?.y || 0);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(zoom > 100 ? { ...listeners, ...attributes } : {})}
      className="inline-block"
    >
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-[70vh] object-contain transition-transform duration-200 select-none pointer-events-none"
        style={{
          transform: `translate(${finalX}px, ${finalY}px) scale(${zoom / 100})`,
          transition: isDragging ? 'none' : 'transform 200ms',
        }}
        draggable={false}
      />
    </div>
  );
}

export default function ImageModalViewer({
  imageViewerOpen,
  imageViewerClose,
  images,
  isMulti = false,
  title = 'Image Viewer',
  currentIndex = 0,
  downloadFileName,
}: ImageModalViewerProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [zoom, setZoom] = useState(100);
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [positions, setPositions] = useState<{
    [key: number]: { x: number; y: number };
  }>({});

  // Convert Blobs to URLs if necessary
  useEffect(() => {
    const urls = images.map((img) => {
      if (img instanceof Blob) {
        return URL.createObjectURL(img);
      }
      return img as string;
    });
    setImageUrls(urls);

    // Cleanup blob URLs on unmount
    return () => {
      urls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [images]);

  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  // Listen to carousel selection changes
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      const index = carouselApi.selectedScrollSnap();
      setActiveIndex(index);
      resetZoom();
    };

    carouselApi.on('select', onSelect);

    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleDownload = () => {
    const currentImage = imageUrls[activeIndex];
    if (!currentImage) return;

    // Generate filename
    let filename: string;
    if (downloadFileName) {
      if (typeof downloadFileName === 'function') {
        filename = downloadFileName(activeIndex);
      } else {
        filename = isMulti
          ? `${downloadFileName}-${activeIndex + 1}`
          : downloadFileName;
      }
    } else {
      filename = `image-${activeIndex + 1}`;
    }

    // Add extension if not present
    if (!filename.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
      filename += '.png';
    }

    const link = document.createElement('a');
    link.href = currentImage;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetZoom = () => {
    setZoom(100);
    setPositions({});
  };

  const handleReset = () => {
    resetZoom();
  };

  const handleClose = () => {
    resetZoom();
    setActiveIndex(0);
    imageViewerClose();
  };

  const handleDragEnd = (event: any) => {
    const { delta } = event;
    if (!delta) return;

    setPositions((prev) => {
      const currentPos = prev[activeIndex] || { x: 0, y: 0 };
      return {
        ...prev,
        [activeIndex]: {
          x: currentPos.x + delta.x,
          y: currentPos.y + delta.y,
        },
      };
    });
  };

  if (imageUrls.length === 0) return null;

  return (
    <Dialog open={imageViewerOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] p-0 gap-0"
        showCloseButton={false}
      >
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                title="Reset zoom and position"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {isMulti && imageUrls.length > 1 && (
            <p className="text-sm text-muted-foreground mt-2">
              Image {activeIndex + 1} of {imageUrls.length}
            </p>
          )}
        </DialogHeader>

        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex-1 overflow-hidden bg-muted/30 flex items-center justify-center p-6">
            {isMulti && imageUrls.length > 1 ? (
              <Carousel
                setApi={setCarouselApi}
                className="w-full max-w-4xl"
                opts={{
                  align: 'center',
                  loop: true,
                }}
              >
                <CarouselContent>
                  {imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="flex items-center justify-center min-h-[60vh]">
                        <DraggableImage
                          src={url}
                          alt={`Image ${index + 1}`}
                          zoom={zoom}
                          id={`image-${index}`}
                          position={positions[index] || { x: 0, y: 0 }}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            ) : (
              <div className="flex items-center justify-center min-h-[60vh]">
                <DraggableImage
                  src={imageUrls[0]}
                  alt="Image"
                  zoom={zoom}
                  id="image-0"
                  position={positions[0] || { x: 0, y: 0 }}
                />
              </div>
            )}
          </div>
        </DndContext>
      </DialogContent>
    </Dialog>
  );
}

/** USAGE */

// Single image (URL)
{
  /* <ImageModalViewer
  imageViewerOpen={open}
  imageViewerClose={() => setOpen(false)}
  images={['https://example.com/qr-code.png']}
  isMulti={false}
/>

// Multiple images with base name
<ImageModalViewer
  images={multipleImages}
  isMulti={true}
  downloadFileName="inventory-item"  // Downloads as: inventory-item-1.png, inventory-item-2.png
/>


// Single image (base64)
<ImageModalViewer
  imageViewerOpen={open}
  imageViewerClose={() => setOpen(false)}
  images={['data:image/png;base64,iVBORw0KGgo...']}
  isMulti={false}
  downloadFileName="asset-qr-code.png"
/>

// Multiple images with carousel
<ImageModalViewer
  imageViewerOpen={open}
  imageViewerClose={() => setOpen(false)}
  images={[
    'https://example.com/image1.png',
    'data:image/png;base64,iVBORw0KGgo...',
    blobObject,
  ]}
  isMulti={true}
  currentIndex={0}
  title="Gallery"
/> */
}
