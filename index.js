require('dotenv').config();
const axios = require('axios');
const yargs = require('yargs');
const chalk = require('chalk');

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3/movie';

const argv = yargs
    .option('type', {
        alias: 't',
        description: 'Movie type: playing, popular, top, upcoming',
        type: 'string',
        demandOption: true
    })
    .help()
    .argv;

const typeMap = {
    playing: 'now_playing',
    popular: 'popular',
    top: 'top_rated',
    upcoming: 'upcoming'
};

async function fetchMovies(type) {
    const endpoint = typeMap[type];
    if (!endpoint) {
        console.log(chalk.red(`Geçersiz tür: ${type}.`));
        process.exit(1);
    }

    try {
        const response = await axios.get(`${BASE_URL}/${endpoint}`, {
            params: {
                api_key: API_KEY,
                language: 'en-US',
                page: 1
            }
        });

        const movies = response.data.results;
        console.log(chalk.yellow(`\n=== ${type.toUpperCase()} MOVIES ===`));
        movies.forEach((movie, index) => {
            console.log(
                chalk.green(`${index + 1}. ${movie.title}`) +
                chalk.gray(` (Release: ${movie.release_date})`) +
                ` - ⭐ ${movie.vote_average}`
            );
        });
        console.log();
    } catch (error) {
        console.error(chalk.red('API isteği başarısız oldu:'), error.message);
    }
}

fetchMovies(argv.type);

