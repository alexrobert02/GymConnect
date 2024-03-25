import axios from 'axios';


const exerciseDb = axios.create({
    baseURL: 'https://exercisedb.p.rapidapi.com',
    headers: {
        'X-RapidAPI-Key': '13bd31c4e7msh37b38bf58fde695p14e818jsn92c51b03dfba',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        'Content-Type': 'application/json',
    },
})

export default exerciseDb;
