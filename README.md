This is my first time using websockets in a personal project and there may be code decisions I made that may not be the best.

Check out my tutorials - [Joe B Programming Tutorials](https://www.youtube.com/channel/UCE9Nw2BQlSEM9Cz5ybO1CiQ?view_as=subscriber)

[Play the game!!!](http://trivia-client-jdb.herokuapp.com/)

# questionsgame
A trivia game that uses websockets to handle the game.  

## Game Rules!
 * Get a point for each correct question!
 * Get bonus if first to answer question correctly
   * (number Of Players) - 1 = bonus points | e.g. 5 number of players will equal to 4 bonus points for the first person to answer the question correctly!
   * note - if you are the only player - you will never receive any bonus points b/c (number Of players) - 1 equals 0.
 * Lose a point if answered incorrectly
 * Lose 2 points if not answered at all
 
## Game Actions
  * Create a game 
    * Name is Required
  * Join A game
 
## Why did I build this?
 * ok, I will try and keep this as short as possible.  I pretty much wanted to learn web sockets and figured a game would be great at forcing me learn the skills. I still want to add more features, mainly, b/c this is fun to me.  That is why this app is a work in progress.  Feel free to use the code, change at will and make it your own.

## The TriviaDb Api ##
 * Use of this free API to get the questions.  If this API is down, will use the local questions.ts file to load from
   * [OpentDB API To get the Trivia Questions](https://opentdb.com/api_config.php)


This projects is split into two sections. It is also a work in progres.
There are some things I know I will change in the near future and will try to update the readme files as I do.
## Server Side
 * The server side documentation is pretty much done but some changes may eventually come.
 * [Documentation](https://github.com/joedbenjamin/questionsgame/blob/master/questionsgameserver/readme.md)

## Client Side
 * Still need to write up some documentation on this part.
 * Some of the code still needs to be cleaned up as well... Switching to Material UI but have not finished that part yet.
 
 
