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

    console.log(boardData);

    // NOTE: For now, only saving one game at a time to simplify the testing process
    var storageItem = browser.storage.sync.get('savedGames');
    storageItem.then((res) => {
      // IDEA: To remove, reorder then pop()? https://www.w3schools.com/js/js_array_methods.asp
      //var games = res.savedGames;
      //games.push(boardData);

      browser.storage.sync.set({
        savedGames: boardData
      });
    });
  }

  function load() {
    var board = document.getElementsByClassName("board-b72b1")[0];
    clearBoard(board);

    // TODO: Add some check to see if there is data yet
    var storageItem = browser.storage.sync.get('savedGames');
    storageItem.then((res) => {
      // Iterate over rows
      for (var i = 0; i < 8; i++) {
        // Iterate over columns (squares)
        for (var j = 0; j < 8; j++) {
          var piece = res.savedGames[i][j];
          if (piece != "") {
            var square = board.children[i].children[j];
            var data = "<div class='piece-417db' alt='' data-piece='" + piece + "' ";
            data += "style='width: 62px;height: 62px;background-image:url(img/chesspieces/wikipedia/" + piece + ".png);";
            data += "background-size: cover;background-repeat: no-repeat;background-position: center center;display: inline-block;touch-action: none'></div>";
            square.innerHTML += data;
          } // else: no piece on the square
        }
      }
    });
  }

  // Removes all pieces currently on the chessboard
  function clearBoard(board) {
    for (var i = 0; i < 8; i++) {
      // Iterate over columns (squares)
      for (var j = 0; j < 8; j++) {
        var squareToClear = board.children[i].children[j];
        if (typeof squareToClear.children[2] != 'undefined') {
          // Edge case (2 notations with a piece)
          squareToClear.children[2].remove();
        } else if (typeof squareToClear.children[1] != 'undefined') {
          if (squareToClear.children[1].classList.contains("piece-417db")) {
            // One notation and a piece
            squareToClear.children[1].remove();
          } // else: two notations and no piece
        } else if (typeof squareToClear.children[0] != 'undefined') { // only one child
          if (squareToClear.children[0].classList.contains("piece-417db")) {
            squareToClear.children[0].remove();
          } // else: only child is notation
        }
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
