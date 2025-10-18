import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, Settings, Maximize2, AlertCircle } from "lucide-react";
import { useState } from "react";

interface Camera {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "recording";
  rtspUrl: string;
  detections: number;
}

const mockCameras: Camera[] = [
  { id: "1", name: "Front Entrance", location: "Building A", status: "online", rtspUrl: "rtsp://...", detections: 12 },
  { id: "2", name: "Parking Lot", location: "Outdoor", status: "recording", rtspUrl: "rtsp://...", detections: 5 },
  { id: "3", name: "Lobby", location: "Building A", status: "online", rtspUrl: "rtsp://...", detections: 8 },
  { id: "4", name: "Server Room", location: "Building B", status: "online", rtspUrl: "rtsp://...", detections: 2 },
  { id: "5", name: "Loading Dock", location: "Outdoor", status: "offline", rtspUrl: "rtsp://...", detections: 0 },
  { id: "6", name: "Office Floor 2", location: "Building A", status: "online", rtspUrl: "rtsp://...", detections: 15 },
];

const CameraGrid = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {mockCameras.map((camera) => (
        <CameraCard key={camera.id} camera={camera} />
      ))}
    </div>
  );
};

const CameraCard = ({ camera }: { camera: Camera }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  const statusColors = {
    online: "bg-success",
    offline: "bg-destructive",
    recording: "bg-accent",
  };

  const statusLabels = {
    online: "Online",
    offline: "Offline",
    recording: "Recording",
  };

  return (
    <Card className="group overflow-hidden border-border/50 bg-card transition-all hover:border-primary/50 hover:shadow-glow">
      {/* Video Preview */}
      <div className="relative aspect-video bg-muted">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
          <Video className="h-12 w-12 text-muted-foreground/30" />
        </div>
        
        {/* Status Indicator */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${statusColors[camera.status]} animate-pulse`} />
          <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
            {statusLabels[camera.status]}
          </Badge>
        </div>

        {/* Detection Count */}
        {camera.detections > 0 && (
          <div className="absolute right-3 top-3">
            <Badge variant="destructive" className="bg-accent/90 text-accent-foreground backdrop-blur-sm">
              {camera.detections} detections
            </Badge>
          </div>
        )}

        {/* Controls Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <Button 
            size="icon" 
            variant="secondary"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button size="icon" variant="secondary">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Offline Warning */}
        {camera.status === "offline" && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/20 backdrop-blur-sm">
            <div className="text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
              <p className="mt-2 text-sm font-medium text-destructive">Camera Offline</p>
            </div>
          </div>
        )}
      </div>

      {/* Camera Info */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground">{camera.name}</h3>
        <p className="text-sm text-muted-foreground">{camera.location}</p>
        <div className="mt-2 text-xs text-muted-foreground">
          RTSP: {camera.rtspUrl}
        </div>
      </div>
    </Card>
  );
};

const Video = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="14" x="3" y="5" rx="2" />
    <path d="m16 10 5-3v10l-5-3" />
  </svg>
);

export default CameraGrid;
