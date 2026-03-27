# Pothole Detection System - Backend Roadmap
### Industrial IoT & AI Integration Strategy

This document outlines the technical requirements and implementation steps for the Django backend to bridge the Raspberry Pi Zero 2 W with the React Dashboard.

---

## 🛠️ Technology Stack
- **Framework**: Python 3.10+ & [Django 5.0+](https://www.djangoproject.com/)
- **API**: [Django REST Framework (DRF)](https://www.django-rest-framework.org/)
- **AI Inference**: [Ultralytics YOLOv8](https://docs.ultralytics.com/)
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **CORS**: `django-cors-headers` (Crucial for React communication)

---

## 📡 API Contract (The "Bridge")

The frontend polls these endpoints frequently. Ensure consistent JSON keys as defined in `src/types/iot.ts`.

### 1. Detections API
- **Endpoint**: `GET /api/potholes/`
- **Output**: Array of pothole objects.
- **Keys**: `id`, `lat`, `lng`, `severity`, `confidence`, `image_url`, `RoadName`, `address`, `deviceId`, `timestamp`.

### 2. Edge Ingestion API
- **Endpoint**: `POST /api/potholes/`
- **Payload**: `multipart/form-data` from Raspberry Pi.
- **Fields**: `image` (file), `lat`, `lng`, `device_id`.
- **Logic**: Upon receipt, run YOLOv8 inference → Calculate severity → Save to database → Upload image to S3/Storage.

### 3. Device Health API
- **Endpoint**: `GET /api/devices/`
- **Output**: Hardware status for registered units.
- **Keys**: `device_id`, `status` (online/offline), `cpu_temp`, `gps_satellites`, `battery_level`, `last_ping`.

---

## 🛤️ Implementation Steps

### Phase 1: Environment Setup
1. [ ] Initialize Django project and app `pothole_core`.
2. [ ] Install dependencies: `django`, `djangorestframework`, `django-cors-headers`, `ultralytics`, `opencv-python`.
3. [ ] Configure `settings.py` with `CORS_ALLOWED_ORIGINS` to allow your React URL.

### Phase 2: AI Integration (YOLOv8)
1. [ ] Download the `yolov8n.pt` (Nano) or specialized pothole weight file.
2. [ ] Create a utility class `InferenceService` to handle `model.predict()`.
3. [ ] Define logic to map "Confidence Scores" to "Severity Levels":
   - > 80%: Critical
   - 60% - 80%: High
   - 40% - 60%: Medium
   - < 40%: Low

### Phase 3: Hardware Communication
1. [ ] Create one unique `device_id` entry in DB for the Raspberry Pi.
2. [ ] Implement a "Heartbeat" mechanism: Pi sends a small POST every 30s to update `last_ping` and `cpu_temp`.
3. [ ] Ensure the GPS coordinates from the NEO-6M are saved with 6+ decimal places for high map accuracy.

### Phase 4: Image Management
1. [ ] Use Django's `FileSystemStorage` for local dev or `django-storages` with AWS S3 for production.
2. [ ] Ensure `image_url` returned in GET requests is an absolute URL that the React frontend can fetch.

---

## 💡 Pro Tips for your friend:
- **CORS is King**: If the frontend says "Blocked by CORS", check `django-cors-headers` settings first.
- **Performance**: YOLOv8 inference can be slow on a weak CPU. If the backend lags, process detections in a background task using **Celery** or **Redis**.
- **Mocking**: Tell them to check the `api.ts` file in the frontend for exact example data structures!
