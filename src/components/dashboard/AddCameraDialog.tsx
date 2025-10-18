import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useCameras } from "@/hooks/useCameras";

export const AddCameraDialog = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rtspUrl, setRtspUrl] = useState("");
  const { addCamera } = useCameras();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCamera(
      {
        name,
        location,
        rtsp_url: rtspUrl,
        status: "offline",
        detection_config: {
          motion_threshold: 0.5,
          confidence_threshold: 0.8,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
          setName("");
          setLocation("");
          setRtspUrl("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary shadow-glow">
          <Plus className="mr-2 h-4 w-4" />
          Add Camera
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Camera</DialogTitle>
            <DialogDescription>
              Configure a new RTSP camera stream for monitoring.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Camera Name</Label>
              <Input
                id="name"
                placeholder="Front Entrance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Building A"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rtsp">RTSP URL</Label>
              <Input
                id="rtsp"
                placeholder="rtsp://192.168.1.100:554/stream"
                value={rtspUrl}
                onChange={(e) => setRtspUrl(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Format: rtsp://[username:password@]host:port/path
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              Add Camera
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
