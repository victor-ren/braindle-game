
// Function to add a puzzle
export function addPuzzle(puzzleType, puzzle) {
  console.log("Puzzle adding...");

  // Open the database connection
  const dbPromise = indexedDB.open('Braindle_Database', 1);

  dbPromise.onerror = function(event) {
      console.error("Database error: ", event.target.error);
  };

  dbPromise.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction([puzzleType], 'readwrite');
      const store = transaction.objectStore(puzzleType);

      // Use a cursor to iterate over all puzzles in the store
      let duplicateFound = false;
      store.openCursor().onsuccess = function(event) {
          const cursor = event.target.result;
          if (cursor) {
              // Check if the current puzzle matches the puzzle we're trying to add
              if (cursor.value.puzzle_string === puzzle.puzzle_string) {
                  console.log("Duplicate puzzle found, not adding.");
                  duplicateFound = true;
                  return; // Exit the cursor iteration and do not add puzzle
              }
              cursor.continue(); // Move to the next item in the store
          } else {
              // Only attempt to add the new puzzle if no duplicates were found
              if (!duplicateFound) {
                  const addRequest = store.put(puzzle);
                  addRequest.onsuccess = function() {
                      console.log("Puzzle added successfully");
                  };
                  addRequest.onerror = function(event) {
                      console.error("Error adding puzzle: ", event.target.error);
                  };
              }
          }
      };
  };
}

// Function to log all puzzles of a specific type
export function logAllPuzzles(puzzleType) {
  const dbPromise = indexedDB.open('Braindle_Database', 1);

  dbPromise.onsuccess = function() {
    const db = dbPromise.result;
    const transaction = db.transaction([puzzleType], 'readonly');
    const store = transaction.objectStore(puzzleType);
    const request = store.openCursor(); // Open a cursor to iterate over all items in the store
    
    request.onsuccess = function(event) {
      const cursor = event.target.result;
      if (cursor) {
        console.log(cursor.value); // Log the current item
        cursor.continue(); // Move to the next item
      } else {
        console.log(`All puzzles from ${puzzleType} have been displayed.`);
      }
    };
    
    request.onerror = function(event) {
      console.error("Error fetching puzzles: ", event.target.error);
    };
  };
}

export function initializePuzzles() {
  // Example of adding a puzzle
  addPuzzle('riddle_puzzles', {
    puzzle_string: "What has to be broken before you can use it?",
    hint1: "You eat this",
    hint2: "It's not a fruit",
    been_used: false,
    answer: "egg"
  });

  addPuzzle('riddle_puzzles', {
    puzzle_string: "What has keys but can't open locks?",
    hint1: "Musical item",
    hint2: "Has black and white keys",
    been_used: false,
    answer: "piano"
  });

  addPuzzle('riddle_puzzles', {
    puzzle_string: "What comes once in a minute, twice in a moment, but never in a thousand years?",
    hint1: "It's a letter",
    hint2: "Think about time",
    been_used: false,
    answer: "m"
  });

  addPuzzle('riddle_puzzles', {
    puzzle_string: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    hint1: "You cannot see me.",
    hint2: "I can be captured but never held.",
    been_used: false,
    answer: "echo"
  });

  addPuzzle('riddle_puzzles', {
    puzzle_string: "The more of this there is, the less you see. What is it?",
    hint1: "It's not a solid.",
    hint2: "It's often feared in large amounts.",
    been_used: false,
    answer: "darkness"
  });

  addPuzzle('riddle_puzzles', {
    puzzle_string: "What has a head, a tail, is brown, and has no legs?",
    hint1: "You use it to purchase things.",
    hint2: "It's not an animal.",
    been_used: false,
    answer: "penny"
  });

  addPuzzle('math_puzzles', {
    puzzle_string: 'What is the square root of 144?',
    hint1: 'It is a dozen',
    hint2: 'It is a perfect square',
    been_used: false,
    answer: '12'
  });

  addPuzzle('math_puzzles', {
    puzzle_string: 'What is 7 plus 6?',
    hint1: 'More than 10',
    hint2: 'Less than 15',
    been_used: false,
    answer: '13'
  });

  addPuzzle('math_puzzles', {
    puzzle_string: 'If you have a cube which is 5 units long, 5 units wide, and 5 units high, how many cubic units is its volume?',
    hint1: 'Multiply the dimensions',
    hint2: '5x5x5',
    been_used: false,
    answer: '125'
  });

  addPuzzle('math_puzzles', {
    puzzle_string: "If two’s company, and three’s a crowd, what are four and five?",
    hint1: "Think of numbers, not idioms.",
    hint2: "It's a single-digit number.",
    been_used: false,
    answer: '9'
  });

  addPuzzle('math_puzzles', {
    puzzle_string: "What three positive numbers give the same result when multiplied and added together?",
    hint1: "They are all the same number.",
    hint2: "The number is less than 3.",
    been_used: false,
    answer: '1'
  });

  addPuzzle('math_puzzles', {
    puzzle_string: "A grandfather, two fathers, and two sons went to the movie theater together and everyone bought one movie ticket each. How many tickets did they buy in total?",
    hint1: "Think about the relationships.",
    hint2: "The total is less than 5.",
    been_used: false,
    answer: '3'
  });

  addPuzzle('pattern_puzzles', {
    puzzle_string: "Complete the sequence: 2, 4, 8, 16, _",
    hint1: "Doubling each time",
    hint2: "2 to the power of something",
    been_used: false,
    answer: "32"
  });

  addPuzzle('pattern_puzzles', {
    puzzle_string: "Fill in the blank: 10, 13, 16, 19, _",
    hint1: "Increasing by 3",
    hint2: "Not a prime number",
    been_used: false,
    answer: "22"
  });

  addPuzzle('pattern_puzzles', {
    puzzle_string: "What comes next in the series: JFMAMJJASON_",
    hint1: "Think of a calendar.",
    hint2: "The answer is a single letter.",
    been_used: false,
    answer: "D"
});

  addPuzzle('pattern_puzzles', {
    puzzle_string: "Find the next number in the sequence: 1, 1, 2, 3, 5, 8, _",
    hint1: "It's a famous sequence.",
    hint2: "Each number is the sum of the two preceding ones.",
    been_used: false,
    answer: "13"
  });

  addPuzzle('pattern_puzzles', {
    puzzle_string: "What comes next: O, T, T, F, F, S, S, _",
    hint1: "Think of counting.",
    hint2: "The answer is the first letter of a number.",
    been_used: false,
    answer: "E"
  });


  logAllPuzzles("math_puzzles")
}

export function fetchAndUpdateRandomPuzzle(puzzleType) {
  return new Promise((resolve, reject) => {
      const dbPromise = indexedDB.open('Braindle_Database', 1);

      dbPromise.onerror = (event) => {
          console.error("Database error: ", event.target.error);
          reject(event.target.error);
      };

      dbPromise.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction([puzzleType], 'readwrite');
          const store = transaction.objectStore(puzzleType);
          let unusedPuzzles = [];

          store.openCursor().onsuccess = function(event) {
              var cursor = event.target.result;
              if (cursor) {
                  // Check if the puzzle has not been used
                  if (!cursor.value.been_used) {
                      // Collect all unused puzzles
                      unusedPuzzles.push({key: cursor.key, value: cursor.value});
                  }
                  cursor.continue();
              } else {
                  // No more entries, process the unused puzzles
                  if (unusedPuzzles.length > 0) {
                      // Select a random unused puzzle
                      const randomIndex = Math.floor(Math.random() * unusedPuzzles.length);
                      const {key, value} = unusedPuzzles[randomIndex];
                      // Update the puzzle's been_used status to true
                      value.been_used = true;
                      store.put(value, key);

                      // Resolve the promise with the selected puzzle details
                      resolve(value);
                  } else {
                      console.log("No unused puzzles found.");
                      reject("No unused puzzles found.");
                  }
              }
          };

          transaction.oncomplete = function() {
              console.log("Transaction completed: database modification finished.");
          };

          transaction.onerror = function(event) {
              console.error("Transaction failed: ", transaction.error);
              reject(event.target.error);
          };
      };
  });
}
