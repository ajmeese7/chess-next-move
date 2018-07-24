(function() {
  // Running on page
  function save() {
    // TODO: Add option to name games
    var board = document.getElementsByClassName("board-b72b1")[0];
    var boardData = Create2DArray(8);
    var data;

    // Iterate over rows
    for (var i = 0; i < 8; i++) {
      // Iterate over columns (squares)
      for (var j = 0; j < 8; j++) {
        var square = board.children[i].children[j];
        var piece = square.children[0];
        if (typeof piece != 'undefined') { // If the square has a child
          if (piece.classList.contains("piece-417db")) { // IDEA: Make less specific?
            data = piece.getAttribute("data-piece");
          } else {
            // Tries again in case the square has notation on it
            piece = square.children[1];
            if (typeof piece != 'undefined' && piece.classList.contains("piece-417db")) {
              data = piece.getAttribute("data-piece");
            } else {
              piece = square.children[2];
              // In case the square has double notation (bottom left)
              if (typeof piece != 'undefined' && piece.classList.contains("piece-417db")) {
                data = piece.getAttribute("data-piece");
              } else {
                // If there is no piece on the square
                data = "";
              }
            }
          }
        } else {
          // If the square has no children
          data = "";
        }

        // Populate boardData with actual information
        boardData[i][j] = data;
      }
    }

    // Credits: https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
    function Create2DArray(rows) {
      var arr = [];
      for (var i = 0; i < rows; i++) {
         arr[i] = [];
      }

      return arr;
    }

    var storageItem = browser.storage.sync.get('savedGames');
    storageItem.then((res) => {
      var games = res.savedGames;
      // TODO: Push current game to array (add remove functionality!)

      /*browser.storage.sync.set({
        savedGames: games
      });*/
    });
  }

  function load() {
    var board = document.getElementsByClassName("board-b72b1")[0];
    // Iterate over rows
    for (var i = 0; i < 8; i++) {
      // Iterate over squares
      for (var j = 0; j < 8; j++) {
        var square = board.children[i].children[j];
        // TODO: Finish command!
      }
    }
  }

  // Listens for messages from the background script.
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "save") {
      save();
    } else if (message.command === "load") {
      load();
    } else {
      console.error("Message not defined!");
    }
  });

})();
