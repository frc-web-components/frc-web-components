
// In the following line, you should include the prefixes of implementations you want to test.
const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
const IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
const IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)


const dbPromise = new Promise((resolve, reject) => {

  const dbReq = indexedDB.open('myDatabase', 1);
  dbReq.onupgradeneeded = function(event) {
    // Set the db variable to our database so we can use it!  
    const db = event.target.result;

    // Create an object store named notes. Object stores
    // in databases are where data are stored.
    let extensions = db.createObjectStore('extensions', { 
      keyPath: ['name', 'version'] 
    });

    resolve(db);
  }
  dbReq.onsuccess = function(event) {
    const db = event.target.result;
    resolve(db);
  }
  dbReq.onerror = function(event) {
    reject(new Error(event.target.errorCode));
  }

});


window.addExtension = async (name, version, extensionFn) => {
  try {
    const db = await dbPromise;

    return new Promise((resolve, reject) => {
      // Start a database transaction and get the notes object store
      let tx = db.transaction(['extensions'], 'readwrite');
      let store = tx.objectStore('extensions');
      // Put the sticky note into the object store
      let extension = { name, version, extensionFn };
      store.add(extension);
      // Wait for the database transaction to complete
      tx.oncomplete = function() { resolve() };
      tx.onerror = function(event) {
        reject(new Error(event.target.errorCode))
      }
    });
  } catch(e) {
    return new Promise.reject(new Error(e.message));
  }
};

export const getExtensions = async () => {
  try {
    const db = await dbPromise;

    return new Promise((resolve, reject) => {
      let tx = db.transaction(['extensions'], 'readonly');
      let store = tx.objectStore('extensions');
      // Create a cursor request to get all items in the store, which 
      // we collect in the allNotes array
      let req = store.openCursor();
      let extensions = [];

      req.onsuccess = function(event) {
        // The result of req.onsuccess is an IDBCursor
        let cursor = event.target.result;
        if (cursor != null) {
          // If the cursor isn't null, we got an IndexedDB item.
          // Add it to the note array and have the cursor continue!
          extensions.push(cursor.value);
          cursor.continue();
        } else {
          // If we have a null cursor, it means we've gotten
          // all the items in the store, so display the notes we got
          resolve(extensions);
        }
      }
      req.onerror = function(event) {
        reject(new Error(event.target.errorCode));
      }
    });

  } catch(e) {
    return new Promise.reject(new Error(e.message));
  }
};
