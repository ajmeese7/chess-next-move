// Used as the default error handler throughout the file
function error(err) {
  console.error("error: " + err);
}

//////////////////////////////////////////////////////////////

function logTabs(tabs) {
  let tab = tabs[0];
  var title = tab.title;
  // Not a perfect system; will run on any page with Chess Next Move in the title
  if (title.includes("Chess Next Move")) {
    document.querySelector("#not-chess").classList.add("hidden");
    document.querySelector("#popup-content").classList.remove("hidden");
  } else {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#not-chess").classList.remove("hidden");
  }
}

browser.tabs.query({currentWindow: true, active: true}).then(logTabs, error);

//////////////////////////////////////////////////////////////

// Called every time popup is opened
var storageItem = browser.storage.sync.get('savedGames');
storageItem.then((res) => {
  var games = res.savedGames;
  games.forEach(function(game) {
    createBoard();
    populateBoard(game);
  });
});

function createBoard() {
  // TODO: Use same styling (smaller) as site
}

function populateBoard(game) {
  // TODO: Find a good way to identify latest chess board to populate
  // IDEA: chessboard class, getElementsByClassName length, final element?
}

//////////////////////////////////////////////////////////////

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {
    // Running in popup
    try {
      if (e.target.classList.contains("load")) {
        // TODO: Is there anything to do on the popup side? YES!

        browser.tabs.query({active: true, currentWindow: true})
         .then(load)
         .catch(error);
      } else if (e.target.classList.contains("save")) {
        // TODO: Is there anything to do on the popup side? YES!
        // IDEA: Get current game data here and wait until it changes below?

        browser.tabs.query({active: true, currentWindow: true})
         .then(save)
         .catch(error);

         // IDEA: Add data to popup here after it is saved to sync!
      }
    } catch(err) { /* Shove it up yer butt */ }

    // Sends a "save" message to the content script in the active tab.
    // TODO: Find a more efficient way of doing this
    function save(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "save",
      });
    }

    function load(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "load",
      });
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#not-chess").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");

  var message = `Failed to execute content script: ${error.message}`;
  document.querySelector("#error-content").innerHTML = "<p>" + message + "</p>";
  console.error(message);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "contentScript.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);
