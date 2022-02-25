const express = require('express');
const router = express.Router();

module.exports = function(database) {

    /**
     * Returns an array of all non-deleted devices.
     */
    router.get('/', async function (req, res) {
        // Fetch the devices collection
        const collection = database.collection("devices");
        // Get all devices
        const cursor = await collection.find({}, {}); 
        const results = await cursor.toArray();
        const responseArray = [];
        results.forEach(function(device){
            if (!device.deleted)
                responseArray.push({
                    id: device.id,
                    airplane_id: device.airplane_id,
                    serial_number: device.serial_number,
                    description: device.description
                });
        });
        res.status(200).send(responseArray);
    });

    /**
     * Creates a new device
     */
    router.post('/', async function (req, res, next) {
        const requestParams = req.body;
        const mySet = new Set(['id','airplane_id','serial_number','description']);
        // Check if missing attributes and values
        if (Object.keys(requestParams).length != 4) {
            res.status(404).send("Missing attribute");
            return next();
        }
        for (const key in requestParams) {
            if (!mySet.has(key)){
                res.status(404).send("Wrong attribute");
                return next();
            }
            if (requestParams[key] === ''){
                res.status(404).send("Missing value attribute");
                return next();
            }
        }

        if (!await verifyAirplaneId(requestParams.airplane_id)) {
            res.status(404).send(`The airplane_id has to correlate with an ID that exists in the airplanes collection`);
            return next();
        }
        const { id, airplane_id, serial_number, description } = req.body;
        // Fetch the devices collection
        const devicesCollection = database.collection("devices");
        // Check for existing id and serial number
        const idResult = await devicesCollection.find({ id: id}).count() > 0;
        const serialNumberResult = await devicesCollection.find({ serial_number: serial_number}).count() > 0;

        if (idResult) {
            const message = `id ${id} already exist`;
            res.status(400).send(message);
            return next();
        } 
        if (serialNumberResult) {
            const message = `serial number ${serial_number} already exist`;
            res.status(400).send(message);
            return next();
        }
        const newDevice = {
            id,
            airplane_id,
            serial_number,
            description,
            deleted: false
        };

        const result = await devicesCollection.insertOne(newDevice);
        if (result.acknowledged) {
            // Remove deleted attribute from response
            delete newDevice.deleted; 
            res.status(200).json({
                message: `New device inserted`,
                result: newDevice,
            });
        }
    });

    /**
     * Returns a device that matches the id in the path.
     */
    router.get('/:id', async function(req, res) {
        const inputId = req.params.id;
        const responseDevice = {};
        // Fetch the devices collection
        const collection = database.collection("devices");
        // Check for existing id and serial number
        const result = await collection.findOne({ id: inputId});
        if (result === null) {
            res.status(404).send(`Device not exist`);
        } else if (result.deleted) {
            res.status(404).send(`Device has been deleted`);
        } else {
            responseDevice.id = result.id;
            responseDevice.airplane_id = result.airplane_id;
            responseDevice.serial_number = result.serial_number;
            responseDevice.description = result.description;
            res.status(200).send(responseDevice);
        }            
    });

    /**
     * Update a single device.
     */
    router.patch('/:id', async function (req, res, next) {
        const inputId = req.params.id;
        const { airplane_id, serial_number, description } = req.body;
        const collection = database.collection("devices");
        const findResult = await collection.findOne({ id: inputId});
        if (findResult === null) {
            res.status(404).send(`No device with id ${inputId}`);
        } else if (findResult.deleted) {
            res.status(404).send(`Device has been deleted`);
        } else {
            const setObject = {};
            // Update only input attributes
            if (airplane_id !== undefined) {
                if (!await verifyAirplaneId(airplane_id)) {
                    res.status(404).send(`The airplane_id has to correlate with an ID that exists in the airplanes collection`);
                    return next();
                }
                setObject.airplane_id = airplane_id
            }
            if (serial_number !== undefined) {
                setObject.serial_number = serial_number
            }
            if (description !== undefined) {
                setObject.description = description
            }
            
            const newvalues = { $set: setObject };
            const updateResult = await collection.updateOne({ id: inputId }, newvalues);
            if (updateResult.acknowledged) {
                res.json({
                    message: `Device with id ${inputId} updated`,
                    code: 200,
                    result: setObject,
                });
            }
        }
    });

    /**
     * Marks a single device as deleted.
     */
    router.delete('/:id', async function (req, res) {
        const inputId = req.params.id;
        const collection = database.collection("devices");
        const findResult = await collection.findOne({ id: inputId});

        if (findResult === null) {
            res.status(404).send(`No device with id ${inputId}`);
        } else if (findResult.deleted) {
            res.status(404).send(`Device already deleted`);
        } else {
            const updateResult = await collection.updateOne({ id: inputId }, { $set: { deleted: true } });
            if (updateResult.matchedCount === 1) {
                res.status(200).send(`Device with id ${inputId} deleted successfully`);
            }
        }
    });

    return router;
}

