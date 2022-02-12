# Device Manager Service  
NodeJS REST-API app to manage IOT devices on airplanes.

## Instructions
In order to run the app, run the following commands:
1. "npm install" to install NodeJS packages and modules.
2. "npm run start" to run nodejs server on port 3000.

## Routes URL
- Returns an array of all non-deleted devices: (GET) http://localhost:3000/devices
- Creates a new device: (POST) http://localhost:3000/devices
- Returns a device that matches the id in the path.: (GET) http://localhost:3000/devices/{id}
- Update a single device: (PATCH) http://localhost:3000/devices/{id}
- Marks a single device as deleted: (DELETE) http://localhost:3000/devices/{id}