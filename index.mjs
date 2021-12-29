import fs from 'fs';

import { parse } from 'csv-parse';

const STELLAR_FLUX_LOWER_LIMIT = .36;
const STELLAR_FLUX_UPPER_LIMIT = 1.11;

const habitablePlanets = [];

function isHabitable(planet) {
    return (
        planet['koi_disposition'] === 'CONFIRMED'
        && (
            planet['koi_insol'] > STELLAR_FLUX_LOWER_LIMIT && 
            planet['koi_insol'] < STELLAR_FLUX_UPPER_LIMIT
        )
        && 
        planet['koi_prad'] < 1.6
    );
}

const mainStream = 
    fs.createReadStream('./data/kepler_data.csv')
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', planet => {
            if (isHabitable(planet)) {
                habitablePlanets.push(planet);
            }
        })
        .on('error', err => {
            console.error(err);
        })
        .on('end', () => {
            console.log(habitablePlanets.map((planet) => {
                return planet['kepler_name'];
            }));
            console.log(`${habitablePlanets.length} habitable planets found`);
        });

