import app from './app';
import config from './config';

// Listening to port
app.listen(config.PORT, config.HOST,  () =>{
  console.log(`App listening on http://${config.HOST}:${config.PORT}`);
});
