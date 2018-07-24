getGame();

function getGame() {
  var chessboard = document.getElementById("chessboard-63f37");
  if (typeof chessboard != 'undefined') {
    // TODO: Is this file even necessary for this project?

    //setTimeout(getGame, 5000);
  } else {
    // Calls until the content is loaded
    setTimeout(getGame, 100);
  }
}
