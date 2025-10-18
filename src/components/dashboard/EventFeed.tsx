import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, User, Car, Clock, Eye } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { formatDistanceToNow } from "date-fns";

const EventFeed = () => {
  const { events, isLoading } = useEvents();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-32 animate-pulse border-border/50 bg-muted" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="border-border/50 bg-card p-12 text-center">
        <p className="text-muted-foreground">No events detected yet. Events will appear here in real-time.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

const EventCard = ({ event }: { event: any }) => {
  const eventIcons = {
    face_unknown: <AlertTriangle className="h-5 w-5 text-destructive" />,
    motion: <Eye className="h-5 w-5 text-accent" />,
    object_detected: <Car className="h-5 w-5 text-primary" />,
    face_matched: <User className="h-5 w-5 text-success" />,
    face_detected: <User className="h-5 w-5 text-primary" />,
  };

  const eventColors = {
    face_unknown: "border-destructive/50 bg-destructive/5",
    motion: "border-accent/50 bg-accent/5",
    object_detected: "border-primary/50 bg-primary/5",
    face_matched: "border-success/50 bg-success/5",
    face_detected: "border-primary/50 bg-primary/5",
  };

  const confidenceColor = event.confidence > 0.9 ? "text-success" : event.confidence > 0.8 ? "text-accent" : "text-destructive";

  const timeAgo = formatDistanceToNow(new Date(event.created_at), { addSuffix: true });

  return (
    <Card className={`border p-4 transition-all hover:shadow-lg ${eventColors[event.event_type]}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="rounded-lg bg-card p-3">
          {eventIcons[event.event_type]}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-1 flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground capitalize">
                {event.event_type.replace(/_/g, " ")}
              </h3>
              <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeAgo}
                </span>
                <span>•</span>
                <span>{event.cameras.name}</span>
                {event.cameras.location && (
                  <>
                    <span>•</span>
                    <span>{event.cameras.location}</span>
                  </>
                )}
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
          {event.image_url && (
            <div className="mt-3 h-32 w-full rounded-lg bg-muted" />
          )}

          {/* Actions */}
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline">View Details</Button>
            {event.image_url && <Button size="sm" variant="outline">Download</Button>}
            {event.event_type === "face_unknown" && (
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
