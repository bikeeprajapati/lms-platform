require('dotenv').config();
import express, {NextFunction,Request, Response} from 'express';
export const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ErrorHandler from './middleware/error';

//body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
//cookie parser middleware
app.use(cookieParser());
app.use(cors({
    origin: process.env.origin?.split(','),
    credentials: true,
}));

//testing api
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

//unknown route middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: 'Route not found' });
});

//error middleware
app.use(ErrorHandler);
