import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import '@babel/polyfill';
import { corsOptions } from './middlewares';
import helmet from 'helmet';
import './config';
import { rateLimiterMiddleware } from './middlewares/rateLimiterRedis';

// Initialization
const app = express();

// Settings of Port
app.set('port', process.env.PORT || 3000);

// Setting proxy
app.set('trust proxy', true);

// Defining middlewares
app.use(morgan('dev'));
app.use(json());
app.use(compression());
app.use(helmet());
// app.use(cors(corsOptions));
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
	app.use(rateLimiterMiddleware);
}

// Static folder
app.use(express.static(__dirname + '/public'));

// Routes
import routes from './routes';
app.use('/api', routes);

export default app;
