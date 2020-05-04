# Build a Triva Game using WebSockets with Typescript

## Build the Server Code

First, we will need to create some types but what will they be?

 * **IGame** - this is the main interface where other types will branch from
   * **id** - a distinct identifier to represent each game
   * **currentQuestionId** - keeps track of the current question
   * **done** - boolean value to know if the game is finished
   * **hasStarted** - boolean value to know if the game has started
   * **timer** - how long a person has to answer each question
   * **clients** - the person playing the game w/ other related info
   * **questions** - all the questions for the game with other related info
   * **settings** - settings related to the game

       ```
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
       &nbsp;

 * **Client** - each person (computer, phone, etc) at the url of the game
   * **id** - a distinct identifier to represent the client 
   * **name** - the display name of the client
   * **questionsAnswered** - keeps track of all answered questions where
     * 1 - answered correctly
     * 0 - answered incorrectly
     * -1 - not answered
   * **score** - the current score 
   * **ws** - the websocket for each client, which allows us to send data to the correct client

       ```
          export interface IClient {
            id: string;
            name: string;
            questionsAnswered?: eQuestionAnswered[];
            score: number;
            ws?: WebSocket;
          }

       ``` 

