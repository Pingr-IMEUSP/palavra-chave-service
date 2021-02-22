// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import * as logger from 'koa-logger';

import { app } from './app';
import { stan } from './nats-streaming/stan';

const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGO_URL || 'mongo://localhost:27017';
const mongoDB = process.env.MONGO_DB || 'docspace';

async function bootstrap() {
  stan.on('connect', () => {
    console.log('- Broker connected');
    app.use(logger());

    app.context.broker = stan;

    app.listen(port, () => console.log('\n\n=== Server Running! ===\n\n'));
  });
}

bootstrap().catch(console.dir);
