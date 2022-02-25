/**
 * Verify input airplane_id with the airplanes collection 
 */
const verifyAirplaneId = async (airplaneId, database) => {
    // Fetch the airplanes collection
    const airplanesCollection = database.collection("airplanes");
    const cursor = await airplanesCollection.find({}, {}); 
    const results = await cursor.toArray();
    let idExist = false;
    results.forEach(function(airplane){
        if (airplane.id === airplaneId) {
            idExist = true;
        }
    });
    return idExist;
};

module.exports = verifyAirplaneId;