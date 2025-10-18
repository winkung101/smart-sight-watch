import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Camera {
  id: string;
  user_id: string;
  name: string;
  location: string | null;
  rtsp_url: string;
  status: "online" | "offline" | "recording" | "error";
  last_seen: string | null;
  detection_config: any;
  created_at: string;
  updated_at: string;
}

export const useCameras = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cameras, isLoading } = useQuery({
    queryKey: ["cameras"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cameras")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Camera[];
    },
  });

  const addCameraMutation = useMutation({
    mutationFn: async (camera: Omit<Camera, "id" | "user_id" | "created_at" | "updated_at" | "last_seen">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("cameras")
        .insert({
          ...camera,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
      toast({
        title: "Camera added",
        description: "Successfully added new camera.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCameraMutation = useMutation({
    mutationFn: async (cameraId: string) => {
      const { error } = await supabase
        .from("cameras")
        .delete()
        .eq("id", cameraId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
      toast({
        title: "Camera deleted",
        description: "Successfully deleted camera.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    cameras: cameras || [],
    isLoading,
    addCamera: addCameraMutation.mutate,
    deleteCamera: deleteCameraMutation.mutate,
  };
};
