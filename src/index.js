import app from './app';
import config from './config';

// Listening to port
app.listen(config.PORT,  () =>{
  console.log(`Server on port: ${config.PORT}`);
});
