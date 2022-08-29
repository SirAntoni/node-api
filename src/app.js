import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import TaskRoutes from './routes/task_routes'
const app = express();

app.set('port', 3000);

//midelware
const corsOptions = {};
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.json({ message: 'Wolcome to my application ' });
})

app.use('/api/tasks', TaskRoutes);

export default app;