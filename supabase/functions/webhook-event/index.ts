import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WebhookEvent {
  camera_id: string;
  user_id: string;
  event_type: "motion" | "face_detected" | "face_matched" | "face_unknown" | "object_detected";
  confidence: number;
  details?: any;
  image_url?: string;
  video_url?: string;
  face_id?: string;
  bbox?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const event: WebhookEvent = await req.json();
    console.log("Received webhook event:", event);

    // Validate camera exists and belongs to user
    const { data: camera, error: cameraError } = await supabase
      .from("cameras")
      .select("id, user_id")
      .eq("id", event.camera_id)
      .eq("user_id", event.user_id)
      .single();

    if (cameraError || !camera) {
      console.error("Camera not found:", cameraError);
      return new Response(
        JSON.stringify({ error: "Camera not found or unauthorized" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update camera last_seen timestamp
    await supabase
      .from("cameras")
      .update({ 
        last_seen: new Date().toISOString(),
        status: "recording"
      })
      .eq("id", event.camera_id);

    // Insert event
    const { data: newEvent, error: eventError } = await supabase
      .from("events")
      .insert({
        camera_id: event.camera_id,
        user_id: event.user_id,
        event_type: event.event_type,
        confidence: event.confidence,
        details: event.details || {},
        image_url: event.image_url,
        video_url: event.video_url,
        face_id: event.face_id || null,
        bbox: event.bbox || null,
      })
      .select()
      .single();

    if (eventError) {
      console.error("Error inserting event:", eventError);
      throw eventError;
    }

    console.log("Event created successfully:", newEvent.id);

    // TODO: Send alerts based on alert_configs
    // This could trigger email, webhook, Line, or MQTT notifications

    return new Response(
      JSON.stringify({ 
        success: true, 
        event_id: newEvent.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
