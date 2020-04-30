import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { IGame } from './types';
import { handleRoute } from './router';
//https://opentdb.com/api_config.php
//https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4
const app = express();

//initialize a simple http server
const server: any = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const games: IGame[] = [];

wss.on('connection', (ws: WebSocket & { id: number }, req: any) => {
  const clientId = req.headers['sec-websocket-key'];
  ws.id = clientId;

  //connection is up, let's add a simple simple event
  ws.on('message', async (message: string) => {
    await handleRoute(message, games, clientId, ws);
    console.log(games);
    ws.send(`# of games created ${games.length}`);
  });

  //send immediatly a feedback to the incoming connection
  ws.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
