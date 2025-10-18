import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Event {
  id: string;
  camera_id: string;
  user_id: string;
  event_type: "motion" | "face_detected" | "face_matched" | "face_unknown" | "object_detected";
  confidence: number;
  details: any;
  image_url: string | null;
  video_url: string | null;
  face_id: string | null;
  bbox: any;
  created_at: string;
  cameras: {
    name: string;
    location: string;
  };
}

export const useEvents = () => {
  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          cameras (
            name,
            location
          )
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Event[];
    },
  });

  // Subscribe to realtime events
  useEffect(() => {
    const channel = supabase
      .channel("events")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "events",
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return {
    events: events || [],
    isLoading,
  };
};
