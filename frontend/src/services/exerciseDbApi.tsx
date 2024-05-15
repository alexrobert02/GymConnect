import axios from 'axios';


const exerciseDb = axios.create({
    baseURL: 'https://exercisedb.p.rapidapi.com',
    headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        'Content-Type': 'application/json',
    },
})

export default exerciseDb;
