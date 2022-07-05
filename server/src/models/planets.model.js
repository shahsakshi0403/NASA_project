const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');
//const isHabitableData=[]''

function isHabitablePlanets(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', async (data) => {
                if (isHabitablePlanets(data)) {
                    savePlanet(data);
                    //isHabitableData.push(Data);
                } 
            })
            .on('error', (err) => {   // If error occures
                console.log(err);
                reject(err);
            })
            .on('end', async () => {
                // console.log((isHabitableData.map((planet)=>{
                //     return planet['kepler_name'];
                // }));
                const countPlanetsFound = (await getAllPlanets()).length;
                console.log(`Found Total Habitable Planet : ${countPlanetsFound}`);
                //    console.log('Done!');
                resolve();
            });
    });
}

async function getAllPlanets() {
    //return isHabitableData;
    return await planets.find({}, {
        '_id': 0, '__v': 0,
    });
}

async function savePlanet(planet) {
    //insert + update = upsert
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name,
        }, {
            upsert: true,
        });
    } catch (err) {
        console.error(`Could not save planet ${err}`);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
};