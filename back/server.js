import { createServer } from 'http';
import app, { set } from './app';

set('port', 3000)
const server = createServer(app);

server.listen(3000);