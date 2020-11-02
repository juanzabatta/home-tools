import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import '@babel/polyfill';
import { corsOptions } from './middlewares';
import helmet from 'helmet';
import config from './config';

// Initialization
const app = express();

// Settings of Port
app.set('port', process.env.PORT || 3000);

// Defining middlewares
app.use(morgan('dev'));
app.use(json());
app.use(cors(corsOptions));
app.use(compression());
app.use(helmet());

// Static folder
app.use(express.static(__dirname + '/public'));

// Routes
import routes from './routes';
app.use('/api', routes);

export default app;
