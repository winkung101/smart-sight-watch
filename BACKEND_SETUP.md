# RTSP Analytics Platform - Backend Setup Guide

## 📋 Overview

This document provides instructions for setting up the **Python Backend** for RTSP video analytics. The frontend is already functional and connected to Lovable Cloud (Supabase).

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     RTSP Analytics Stack                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend (React + Lovable Cloud)                           │
│  ├─ User authentication ✅                                   │
│  ├─ Camera management UI ✅                                  │
│  ├─ Real-time event feed ✅                                  │
│  ├─ Face database ✅                                         │
│  └─ Analytics dashboard ✅                                   │
│                                                               │
│  Database (PostgreSQL via Lovable Cloud) ✅                  │
│  ├─ cameras, events, enrolled_faces tables                   │
│  ├─ Real-time subscriptions                                  │
│  └─ Row-level security policies                              │
│                                                               │
│  Backend Edge Functions ✅                                    │
│  └─ /webhook-event (receives AI detections)                  │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Python Backend (TO BE IMPLEMENTED) ⚠️                       │
│  ├─ RTSP Stream Ingestion                                    │
│  ├─ Motion Detection (OpenCV)                                │
│  ├─ Object Detection (YOLO/ultralytics)                      │
│  ├─ Face Detection & Recognition (insightface/FaceNet)       │
│  ├─ Worker Queue (Celery + Redis)                            │
│  └─ Storage (S3/MinIO for images/videos)                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Python Backend Implementation

### Required Components

1. **RTSP Stream Processor**
   - Use `opencv-python` for RTSP ingestion
   - Multi-threaded frame capture
   - Frame buffer management

2. **AI Models**
   ```python
   # Object Detection (YOLO)
   from ultralytics import YOLO
   model = YOLO('yolov8n.pt')
   
   # Face Detection & Recognition
   import insightface
   from insightface.app import FaceAnalysis
   app = FaceAnalysis()
   ```

3. **Worker Architecture**
   ```python
   # Use Celery for async task processing
   @celery.task
   def process_frame(camera_id, frame_data):
       # Motion detection
       # Object detection
       # Face recognition
       # Send webhook to Lovable Cloud
   ```

### Webhook Integration

Send detection events to Lovable Cloud:

```python
import requests

def send_event(camera_id, user_id, event_data):
    webhook_url = "https://gvhpwgjcnajiweweccfh.supabase.co/functions/v1/webhook-event"
    
    payload = {
        "camera_id": camera_id,
        "user_id": user_id,
        "event_type": "face_unknown",  # or motion, object_detected, face_matched
        "confidence": 0.95,
        "details": {"class": "person", "bbox": [x1, y1, x2, y2]},
        "image_url": "https://storage.url/snapshot.jpg",
        "bbox": {"x": x1, "y": y1, "w": w, "h": h}
    }
    
    response = requests.post(webhook_url, json=payload)
    return response.json()
```

### Configuration File Structure

```yaml
# config.yaml
rtsp_sources:
  - camera_id: "uuid-from-database"
    user_id: "user-uuid"
    rtsp_url: "rtsp://192.168.1.100:554/stream"
    detection_config:
      motion_threshold: 0.5
      confidence_threshold: 0.8
      face_recognition: true
      object_detection: true

models:
  yolo_model: "yolov8n.pt"
  face_model: "buffalo_l"

storage:
  type: "s3"  # or "local"
  bucket: "rtsp-evidence"
  region: "us-east-1"

webhook:
  url: "https://gvhpwgjcnajiweweccfh.supabase.co/functions/v1/webhook-event"
```

## 📊 Database Schema

### Cameras Table
```sql
CREATE TABLE cameras (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  location TEXT,
  rtsp_url TEXT NOT NULL,
  status camera_status,
  detection_config JSONB
);
```

### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY,
  camera_id UUID REFERENCES cameras,
  event_type event_type NOT NULL,
  confidence DECIMAL,
  image_url TEXT,
  bbox JSONB,
  created_at TIMESTAMPTZ
);
```

### Enrolled Faces Table
```sql
CREATE TABLE enrolled_faces (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  embedding JSONB NOT NULL,  -- Face embedding vector
  image_url TEXT
);
```

## 🚀 Implementation Steps

1. **Set up Python environment**
   ```bash
   pip install opencv-python ultralytics insightface celery redis requests
   ```

2. **Implement RTSP ingestion**
   - Create frame capture threads
   - Handle reconnection logic
   - Implement frame queuing

3. **Add AI models**
   - Load YOLO for object detection
   - Initialize insightface for face recognition
   - Implement motion detection

4. **Configure worker queue**
   - Set up Redis
   - Create Celery tasks
   - Implement parallel processing

5. **Integrate webhook**
   - Send events to Lovable Cloud endpoint
   - Handle response errors
   - Implement retry logic

6. **Add storage**
   - Configure S3/MinIO
   - Implement snapshot saving
   - Create video clip recording

## 🔐 Security Considerations

- Store RTSP credentials securely (use environment variables)
- Encrypt face embeddings at rest
- Implement SSL/TLS for webhook calls
- Use access control for storage buckets
- Add audit logging for all detections

## 📝 Example Python Service

```python
# main.py
import cv2
import asyncio
from ultralytics import YOLO
import requests

class RTSPProcessor:
    def __init__(self, camera_id, user_id, rtsp_url):
        self.camera_id = camera_id
        self.user_id = user_id
        self.rtsp_url = rtsp_url
        self.model = YOLO('yolov8n.pt')
        
    async def process_stream(self):
        cap = cv2.VideoCapture(self.rtsp_url)
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            # Run detection
            results = self.model(frame)
            
            # Process detections
            for r in results:
                if r.boxes:
                    await self.send_detection(r.boxes)
                    
            await asyncio.sleep(1)  # Process 1 FPS
            
    async def send_detection(self, boxes):
        webhook_url = "https://your-project.supabase.co/functions/v1/webhook-event"
        
        payload = {
            "camera_id": self.camera_id,
            "user_id": self.user_id,
            "event_type": "object_detected",
            "confidence": float(boxes[0].conf[0]),
            "details": {"class": "person"}
        }
        
        requests.post(webhook_url, json=payload)

if __name__ == "__main__":
    processor = RTSPProcessor(
        camera_id="your-camera-uuid",
        user_id="your-user-uuid",
        rtsp_url="rtsp://..."
    )
    asyncio.run(processor.process_stream())
```

## 🧪 Testing

1. Add a camera via the web UI
2. Start Python backend with test RTSP stream
3. Verify events appear in dashboard
4. Check database for stored events
5. Test face enrollment and matching

## 📞 Support

For questions about:
- **Frontend/Database**: Check Lovable Cloud dashboard
- **Python Backend**: Refer to OpenCV, YOLO, and insightface docs
- **Deployment**: Use Docker for containerization

---

**Next Steps:**
1. Implement Python RTSP processor
2. Add AI model integration
3. Test end-to-end detection flow
4. Deploy to production
