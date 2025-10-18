import { Card } from "@/components/ui/card";
import { Video, AlertTriangle, CheckCircle2, Users } from "lucide-react";
import { useCameras } from "@/hooks/useCameras";
import { useEvents } from "@/hooks/useEvents";

const StatsOverview = () => {
  const { cameras } = useCameras();
  const { events } = useEvents();

  const activeCameras = cameras.filter(c => c.status === "online" || c.status === "recording").length;
  const recordingCameras = cameras.filter(c => c.status === "recording").length;
  const todayEvents = events.length;
  const verifiedFaces = events.filter(e => e.event_type === "face_matched").length;
  const unknownAlerts = events.filter(e => e.event_type === "face_unknown").length;

  const stats = [
    {
      label: "Active Cameras",
      value: activeCameras.toString(),
      subtext: `${recordingCameras} recording`,
      icon: <Video className="h-6 w-6 text-primary" />,
      color: "from-primary/20 to-primary/5",
    },
    {
      label: "Detections Today",
      value: todayEvents.toString(),
      subtext: "Real-time monitoring",
      icon: <AlertTriangle className="h-6 w-6 text-accent" />,
      color: "from-accent/20 to-accent/5",
    },
    {
      label: "Verified Faces",
      value: verifiedFaces.toString(),
      subtext: "Successful matches",
      icon: <CheckCircle2 className="h-6 w-6 text-success" />,
      color: "from-success/20 to-success/5",
    },
    {
      label: "Unknown Alerts",
      value: unknownAlerts.toString(),
      subtext: unknownAlerts > 0 ? "Requires attention" : "All clear",
      icon: <Users className="h-6 w-6 text-destructive" />,
      color: "from-destructive/20 to-destructive/5",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card 
          key={index}
          className="border-border/50 bg-gradient-to-br p-6 transition-all hover:border-primary/50 hover:shadow-glow"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.subtext}</p>
            </div>
            <div className={`rounded-lg bg-gradient-to-br p-3 ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
