# Build a Triva Game using WebSockets with Typescript

## the Server Code

### package.json
  * You could clone all the files and just run yarn or npm i to install all the packages or you could install them by running the following commands, using either yarn or npm ;-)  -- Also, keep in my, this is a work in progress and I will try to keep the documentation in sync but at times it could not match... ;-)

  * Dependecies
```
yarn add axios, express, uuid, ws
```
```
npm i axios, express, uuid, ws -S
```
  * Dev Dependecies
```
yarn add @types/axios, @types/node, @types/express, @types/uuid, @types/ws, nodemon, ts-node, typescript -D
```
```
npm i @types/axios, @types/node, @types/express, @types/uuid, @types/ws, nodemon, ts-node, typescript -D
```

To start the server run...

```
yarn start:dev
```
```
npm run start:dev
```

To build the code and transpile down to js run below but if you are on a windows machine, I think the build script will fail b/c of the _rm -rf build_ command, replace that with the windows command to remove the build folder or you could just remove it completely but that means you could have outdated files in your build folder 

```
yarn build
```
```
npm run build
```
Now that we have that out the way - let's get to the fun stuff (the code) - we will start with the types

<hr/>

 * **IGame** - this is the main interface where other types will branch from

```typescript
  export interface IGame {
    id: string;
    currentQuestionId: string;
    done?: boolean;
    hasStarted: boolean;
    timer: number;
    clients: IClient[];
    questions: IQuestion[];
    settings: ISettings;
  }
```

   * **id** - a distinct identifier to represent each game
   * **currentQuestionId** - keeps track of the current question
   * **done** - boolean value to know if the game is finished
   * **hasStarted** - boolean value to know if the game has started
   * **timer** - how long a person has to answer each question
   * **clients** - the person playing the game w/ other related info
   * **questions** - all the questions for the game with other related info
   * **settings** - settings related to the game

<hr/>

 * **IClient** - each person (computer, phone, etc) at the url of the game


```typescript
  export interface IClient {
    id: string;
    name: string;
    questionsAnswered?: eQuestionAnswered[];
    score: number;
    ws?: WebSocket;
  }
```

   * **id** - a distinct identifier to represent the client 
   * **name** - the display name of the client
   * **questionsAnswered** - keeps track of all answered questions where
     * 1 - answered correctly
     * 0 - answered incorrectly
     * -1 - not answered
   * **score** - the current score 
   * **ws** - the websocket for each client, which allows us to send data to the correct client

<hr/>

 * **IQuestion** - each question

```typescript
  export interface IQuestion {
    id: string;
    seq: number;
    text: string;
    answers: IAnswer[];
    done: boolean;
    hasFirstCorrectAnswer: boolean;
    clientIdsWhoAnswered: string[];
  }
```

   * **id** - a distinct identifier to represent the question
   * **seq** - helps to keep the order of the questions
   * **text** - display text
   * **answers** - answers for each question and related info
   * **done** - boolean value to know if the question is done
   * **hasFirstCorrectAnswer** - boolean value to know if the question has been answered correctly at least once
   * **clientIdsWhoAnswered** - list of clients who answered the question

<hr/>

 * **IAnswer** - each answer per question

```typescript
  export interface IAnswer {
    id: string;
    text: string;
    isCorrect: boolean;
  }
```

   * **id** - a distinct identifier to represent the answer
   * **text** - display text
   * **isCorrect** - boolean value to know if answer is correct

<hr/>

 * **ISettings** - settings for the game

```typescript
  export interface ISettings {
    questionsCount: number;
    timePerQuestion: number;
    timeBreakPerQuestion: number;
  }
```

   * **questionsCount** - how many questions per game
   * **timePerQuestion** - the amount of time to answer each question
   * **timeBreakPerQuestion** - the amount of time to break before the next question loads

<hr/>

## server.ts - entry point for websocket
  * has a games variable that is used to store all games data - this could be stored in a database or some sort but doing everything here for now
  * once a connection is established, get a unique key for the client and set it as it's id 

```typescript
  const clientId = req.headers['sec-websocket-key'];
  ws.id = clientId;
```

  * listen for all messages and send to the handleRoute method in the router.ts file 

```typescript
  ws.on('message', async (message: string) => {
    await handleRoute(message, games, clientId, ws);
  });
```
<hr/>

## router.ts - routes the work to be done to the correct methods

  * First we parse the message into json with 
      ```typescript
      const obj = JSON.parse(message);
      ```
  * check the message property for the following
    * create - creates the game to be played
      * only create game if client is not already in a game
    * join - allows a client to join a created game
      * only join game is client is not already in a game
    * start - starts the game
    * guess - checks the answered question in a game
    * reconnect - the clients is reconnecting to the server

<hr/>

## games/index.ts - routes are sent here to do the all the work - Let's go down the rabbit hole and discuss - might need a coffee break after this...

### methods

* **CreateGame**

  * Creates all the data needed for a game, add that game to the list of games array and sends back the game object to the client who created it

```typescript
export const createGame = async (
  clientId: string,
  settings: ISettings,
  ws: WebSocket,
  name: string,
  games: IGame[],
) => {
  const questions = await getQuestions(settings.questionsCount, ws);
  const game = {
    settings: settings,
    id: uuidv4(),
    timer: settings.timePerQuestion,
    clients: [
      {
        id: clientId,
        name,
        score: 0,
        ws,
        questionsAnswered: new Array(settings.questionsCount).fill(
          eQuestionAnswered.notAnswered,
        ),
      },
    ],
    questions,
    currentQuestionId: questions[0].id,
    hasStarted: false,
  };
  games.push(game);
  sendSocket(
    {
      method: eRouteMethods.create,
      gameId: game.id,
      clients: game.clients,
      clientId,
      isInGame: true,
    },
    ws,
  );
};
```

 * First, we wait for the async **getQuestions** method
   * send isLoading to client to let client know to display loading gif
   * call the opentdb endpoint to get the questions
   * if by some chance opentdb is down, will use some questions from the json file
   * id - use uuidv4 to get a unique identifier
   * seq - iterates the seq, starting at 1
   * answers - calls the getAnswers to build the data for all the answers
   * text - sets the display text of the question
   * clientIdsWhoAnswered - use to store all clients who answered the question - This is used in the score calcualtion which we will discuss later
   * once result comes back, send isLoading as false to client


```typescript
const getQuestions = async (
  count: number,
  ws: WebSocket,
): Promise<IQuestion[]> => {
  sendSocket({ method: eRouteMethods.processing, isLoading: true }, ws);
  const questions = await axios
    .get(`https://opentdb.com/api.php?type=multiple&amount=${100}`, {
      timeout: 2000,
    })
    .then(function (response: any) {
      return shuffle(response.data.results, 2).slice(0, count);
    })
    .catch(() => {
      return shuffle(questionsJson(), 2).slice(0, count);
    });
  const result: any = questions.map((resp: any, index: number) => ({
    id: uuidv4(),
    seq: ++index,
    answers: getAnswers({
      correctAnswer: resp.correct_answer,
      incorrectAnswers: resp.incorrect_answers,
    }),
    text: resp.question,
    clientIdsWhoAnswered: [],
  }));
  sendSocket({ method: eRouteMethods.processing, isLoading: false }, ws);
  return result;
};
```

 * The **getAnswers** method is called from the getQuestions method
   * sets the correct answer object and incorrect answers list of objects and returns a shuffled list of answers for randomness in position
     * id - unique identifier for each answer
     * text - display text of the answer
     * isCorrect - boolean value to know if answer is correct or not

```typescript
const getAnswers = (answers: IGetAnswers): IAnswer[] => {
  const correctAnswer: IAnswer = {
    id: uuidv4(),
    text: answers.correctAnswer,
    isCorrect: true,
  };
  const incorrectAnswers: IAnswer[] = answers.incorrectAnswers.map(
    (answer: any) => ({
      id: uuidv4(),
      text: answer,
      isCorrect: false,
    }),
  );
  return shuffle([correctAnswer, ...incorrectAnswers]);
};
```

 * The **shuffle** method is used to randomize the answers position
 * creates a loop to shuffle the list as many times as set, this may be overkill but this seems to keep the answers in random spots
   * goes through the array
   * sets j to Math.floor of the random number at each index of interation
   * sets the temp to be the value at the current index
   * then, replaces the index with the new random one
   * then, sets the index of j to what temp was
   * randomly reverse the list of answers

```typescript
const shuffle = (array: any[], times: number = 3): any[] => {
  new Array(times).fill(1).forEach(() => {
    array.forEach((el: any, index: number) => {
      const j = Math.floor(Math.random() * index);
      const temp = el;
      array[index] = array[j];
      array[j] = temp;
    });
    if (Math.ceil(Math.random() * 100) % 2 > 0) {
      array = array.reverse();
    }
  });
  return array;
};
```
<hr/>

* **JoinGame**

  * put a client in a game that has already been created but not yet started
    * gets the game by id
    * adds the client to the game
    * timer - time per question
    * send response back to client with the clientid as well as the isInGame flag and gameId
    * send response to all clients in the game with list of clients in the game

```typescript
export const joinGame = (
  games: IGame[],
  gameId: string,
  clientId: string,
  name: string,
  ws: WebSocket,
) => {
  const game = gameById(gameId, games);
  if (game && !game.hasStarted) {
    game?.clients.push({
      id: clientId,
      name,
      score: 0,
      ws,
      questionsAnswered: new Array(game.settings.questionsCount).fill(
        eQuestionAnswered.notAnswered,
      ),
    });
    sendSocket(
      { method: 'setClient', clientId, isInGame: true, gameId: game?.id },
      ws,
    );
    game?.clients.forEach((client) => {
      sendSocket(
        {
          method: 'updateclients',
          clients: game?.clients,
        },
        client?.ws,
      );
    });
  }
};
```

<hr/>

* **Start Game**

  * this is where the fun will start - key word **start** - ok, not really funny but this is where a lot of the logic is - let's get to it!!!
    * if game has not started, then set hasStarted to true
    * send data to all clients to let them know the game has started as well as the questionsAnswered array
    * calls startInterval which is really where the fun starts (i'm serious this time!!!) 

```typescript
export const startGame = (games: IGame[], gameId: string) => {
  const game = gameById(gameId, games);
  if (game && !game.hasStarted) {
    game.hasStarted = true;
    game?.clients.forEach((client) => {
      sendSocket(
        {
          questionsAnswered: new Array(game.settings.questionsCount).fill(
            eQuestionAnswered.notAnswered,
          ),
          isGameRunning: true
        },
        client?.ws,
      );
    });
    startInterval(game, games);
  }
};
```

* **Start Interval**

  * sends the first question to the clients
  * creates an interval that runs every 500ms
  * What happens in each cycle???
    * set the time varialbe which allows us to keep track of the timer 
    ```typescript
      let time = Date.now() - start;
    ```
    * send the remaining time for the question to each client
    * if time has ran out do the following
      * set the question to done
      * if any clients did not answer - take away 2 points (this could be a value in the settings)
      * if there are no more questions, end the game
      * if there are more questions, send the next question
      * update start variable which allows the time variable to go off the right start time when the cycle starts again
    ```typescript
      start = Date.now();
    ```

```typescript
const startInterval = (game: IGame, games: IGame[]) => {
  let start = Date.now();
  let index = 0;
  sendQuestion(game);
  const { timePerQuestion, timeBreakPerQuestion } = game.settings;

  const interval = setInterval(() => {
    let time = Date.now() - start;

    sendTimeRemaining(time, timePerQuestion, game);

    if (time >= timePerQuestion + timeBreakPerQuestion) {
      game.questions[index].done = true;
      index += 1;

      game?.clients.forEach((client) => {
        if (
          !!!game.questions[index - 1].clientIdsWhoAnswered.find(
            (id) => id == client.id,
          )
        ) {
          client.score -= 2;
        }
      });
      if (!!!game.questions[index]) {
        endGame(interval, game, games);
      } else {
        updateQuestion(game, index);
      }
      start = Date.now();
    }
  }, 500);
};
```

* **Send Question**

  * get the current question id
  * get the question by the question id
  * send all the clients in the game the following
    * method - sendQuestion
    * question - the display text of the question
    * questionId
    * answers - the answers for the questions with the id and text props

```typescript
const sendQuestion = (game: IGame) => {
  const questionId = game.currentQuestionId;
  const question = questionById(questionId, game.questions);

  game.clients.forEach((client) => {
    client.ws?.send(
      JSON.stringify({
        method: 'sendQuestion',
        question: question?.text,
        questionId,
        answers: question?.answers.map((answer) => ({
          id: answer.id,
          text: answer.text,
        })),
      }),
    );
  });
};
```

* **Send Time Remaining**

  * sends each client the time remaining for the question
    * this allows the front end code to display the timer
    * taking the timerPerQuestion - time will give us how much time is remaining in milliseconds
    * we then take that and divide by 1000 to get the time in seconds
    * Math.ceil is used to make sure we get the rounded up number
    * toFixed() with no params is added to get rid of the decimals

```typescript
const sendTimeRemaining = (
  time: number,
  timePerQuestion: number,
  game: IGame,
) => {
  game.clients.forEach((client) =>
    sendSocket(
      { timeRemaining: Math.ceil((timePerQuestion - time) / 1000).toFixed() },
      client.ws,
    ),
  );
};
```

* **End Game**

  * clear the interval to stop the timer from running
  * set the game to done
  * send all clients the following
    * method - endGame
    * endGame - send as true to let client know the game is over
    * isInGame - set to false
    * isGameRunning - set to false
  * send all clients the updated game, basically making sure they have the correct final score

```typescript
const endGame = (interval: NodeJS.Timeout, game: IGame, games: IGame[]) => {
  clearInterval(interval);
  game.done = true;

  game.clients.forEach((client) =>
    sendSocket(
      {
        method: 'endGame',
        endGame: true,
        isInGame: false,
        isGameRunning: false,
      },
      client.ws,
    ),
  );
  sendClients(game);
  //using this to clear the game out, so it doesn't take up memory
  games = games.filter(g => g.id !== game.id)
};
```

* **Update Question**

  * set current question id
  * send question to clients
  * send all clients the updated game

```typescript
const updateQuestion = (game: IGame, index: number) => {
  game.currentQuestionId = game.questions[index]?.id;
  sendQuestion(game);
  sendClients(game);
};
```

<hr/>

* **Check Guess**

  * get the game by id
  * get the question by id
  * get the client by id
  * get the correct answer's id
  * if client has not already answered the question do the following
    * add the clientId to the clientIdsWhoAnswered array so we will know the client has answered if they try and answer again
    * if the answer is correct do the following
      * give the client an extra point for answering question correctly
      * set the questionsAnswered index to 1 - meaning answered correctly
      * if no client has answered the question correctly yet do the following
        * set the hasFirstCorrectAnswer to true, so we will know someone has answered the question correctly
        * give the client a bonus for being the first to answer the question correctly
    * if the answer is incorrect do the following
      * take away a point from the client for getting the wrong answer
      * set the questionsAnswered index to 0 - meaning answered incorrectly
      * send back the correctAnswerId and questionsAnswered array to the client

```typescript
const checkGuess = (
  games: IGame[],
  gameId: string,
  clientId: string,
  answerId: string,
  questionId: string,
) => {
  const game = gameById(gameId, games);
  const question = questionById(questionId, game?.questions);
  const client = clientById(clientId, game?.clients);
  const correctAnswerId = getCorrectAnswerId(question?.answers);

  if (client && question && !hasClientAnsweredQuestion(clientId, question)) {
    question.clientIdsWhoAnswered.push(clientId);
    if (answerId === correctAnswerId) {
      client.score += 1;
      client.questionsAnswered[question.seq - 1] = 1;
      if (!question.hasFirstCorrectAnswer) {
        question.hasFirstCorrectAnswer = true;
        //if first to get right, gets bonus of # of players excluding self
        client.score += (game?.clients.length || 1) - 1;
      }
    } else {
      client.score -= 1;
      client.questionsAnswered[question.seq - 1] = 0;
    }
    client?.ws?.send(
      JSON.stringify({
        method: 'checkGuess',
        correctAnswerId,
        questionsAnswered: client?.questionsAnswered,
      }),
    );
  }
};
```

<hr/>

* **Reconnect**

  * this happens when the client tries to reconnect to the server
    * the client will send in the oldClientId and a newClientId 
  * get the game by the oldClientId
  * if the client is found and the game is not done
    * replace the oldClientId with the new ClientId
    * send the updateQuestion to the client
    * send some reconnect info the client
  * else end the game

```typescript
const reconnect = (
  games: IGame[],
  gameId: string,
  oldClientId: string,
  newClientId: string,
  ws: any,
) => {
  sendSocket({ method: 'reconnect' }, ws);
  const game = gameById(gameId, games);
  const client = clientById(oldClientId, game?.clients);
  if (client && game && !game.done) {
    client.id = newClientId;
    client.ws = ws;
    sendQuestion(game);
    sendClients(game);
    sendSocket(
      {
        method: 'reconnect',
        isLoading: false,
        oldClientId,
        newClientId,
        gameId,
        clientId: newClientId,
        isGameRunning: game.hasStarted,
        isInGame: true,
        questionsAnswered: client.questionsAnswered
      },
      ws,
    );
  } else {
    sendSocket({ method: 'endGame', isLoading: false, endGame: true, isInGame: false, isGameRunning: false }, ws);
  }
};
```
