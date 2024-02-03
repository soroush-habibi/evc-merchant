import express from 'express';
import 'dotenv/config';

const app = express();

app.listen(process.env.APP_PORT || 3000, () => {
    console.log(`App is running on port ${process.env.APP_PORT || 3000}`)
});