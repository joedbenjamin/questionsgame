# Build a Triva Game using WebSockets

## Build the Server Code

First, we will need to create some types but what will they be?

 * **Game** - this is the main type where others will branch from
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
   * **id** - a distinct identifier to represent client 
   * **name** - the display name of the person
   * **questionsAnswered** - boolean value to know if the game is finished
   * **score** - the current score 
   * **ws** - the websocket for each client, this allows to send data to the correct client

       ```
          export interface IClient {
            id: string;
            name: string;
            questionsAnswered: number[];
            score: number;
            ws?: WebSocket;
          }

       ``` 

