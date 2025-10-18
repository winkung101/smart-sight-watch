import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, User, Car, Clock, Eye } from "lucide-react";

interface Event {
  id: string;
  type: "unknown_face" | "motion" | "object" | "face_match";
  camera: string;
  timestamp: string;
  confidence: number;
  details: string;
  imageUrl?: string;
}

const mockEvents: Event[] = [
  {
    id: "1",
    type: "unknown_face",
    camera: "Front Entrance",
    timestamp: "2 minutes ago",
    confidence: 0.95,
    details: "Unknown person detected at entrance",
  },
  {
    id: "2",
    type: "motion",
    camera: "Parking Lot",
    timestamp: "5 minutes ago",
    confidence: 0.88,
    details: "Significant motion detected in zone A",
  },
  {
    id: "3",
    type: "object",
    camera: "Loading Dock",
    timestamp: "12 minutes ago",
    confidence: 0.92,
    details: "Vehicle detected: Delivery truck",
  },
  {
    id: "4",
    type: "face_match",
    camera: "Lobby",
    timestamp: "15 minutes ago",
    confidence: 0.97,
    details: "Employee: John Doe verified",
  },
  {
    id: "5",
    type: "unknown_face",
    camera: "Office Floor 2",
    timestamp: "22 minutes ago",
    confidence: 0.91,
    details: "Unknown person detected",
  },
];

const EventFeed = () => {
  return (
    <div className="space-y-4">
      {mockEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

const EventCard = ({ event }: { event: Event }) => {
  const eventIcons = {
    unknown_face: <AlertTriangle className="h-5 w-5 text-destructive" />,
    motion: <Eye className="h-5 w-5 text-accent" />,
    object: <Car className="h-5 w-5 text-primary" />,
    face_match: <User className="h-5 w-5 text-success" />,
  };

  const eventColors = {
    unknown_face: "border-destructive/50 bg-destructive/5",
    motion: "border-accent/50 bg-accent/5",
    object: "border-primary/50 bg-primary/5",
    face_match: "border-success/50 bg-success/5",
  };

  const confidenceColor = event.confidence > 0.9 ? "text-success" : event.confidence > 0.8 ? "text-accent" : "text-destructive";

  return (
    <Card className={`border p-4 transition-all hover:shadow-lg ${eventColors[event.type]}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="rounded-lg bg-card p-3">
          {eventIcons[event.type]}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-1 flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{event.details}</h3>
              <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {event.timestamp}
                </span>
                <span>•</span>
                <span>{event.camera}</span>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${confidenceColor} border-current`}
            >
              {Math.round(event.confidence * 100)}% confidence
            </Badge>
          </div>

          {/* Thumbnail */}
          {event.imageUrl && (
            <div className="mt-3 h-32 w-full rounded-lg bg-muted" />
          )}

          {/* Actions */}
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline">View Details</Button>
            <Button size="sm" variant="outline">Download</Button>
            {event.type === "unknown_face" && (
              <Button size="sm" variant="default" className="bg-gradient-primary">
                Enroll Face
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventFeed;
