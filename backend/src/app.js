import express from 'express';
import cors from 'cors';
import notesRouter from './routes/notes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/notes', notesRouter);

export default app;
