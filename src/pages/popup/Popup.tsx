import React, { useEffect, useState } from "react";
import "@pages/popup/Popup.css";

const Popup = () => {
  const [currentUrl, setCurrentUrl] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>("");
  const [isYoutube, setIsYoutube] = useState<boolean>(true);
  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };

    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const url = tabs[0].url;
        console.log("current url", url);
        // console.log(new URL(currentUrl).hostname);
        // if (new URL(currentUrl).hostname !== "www.youtube.com") {
        //   setIsYoutube(false);
        //   return;
        // }
        setCurrentUrl(url);
      });
  }, []);

  const keys = {
    notifications: [
      {
        site: "",
        id: "uuid",
      },
    ],
  };
  let db!: IDBDatabase;
  const request = indexedDB.open("grauchiTitlesStore", 2);
  request.onerror = (err) =>
    console.error(`IndexedDB error: ${request.error}`, err);
  request.onsuccess = () => (db = request.result);
  request.onupgradeneeded = () => {
    const db = request.result;
    const notificationsStore = db.createObjectStore("grauchiStore", {
      keyPath: keys.notifications[0].id,
    });
    keys.notifications.forEach((key) =>
      notificationsStore.createIndex(key.id, key.id)
    );
  };

  const addElement = (store: string, payload: object) => {
    const open = indexedDB.open("grauchiTitlesStore");
    open.onsuccess = () => {
      db = open.result;
      if ([...db.objectStoreNames].find((name) => name === store)) {
        const transaction = db.transaction(store, "readwrite");
        transaction.onerror = () => console.error(transaction.error);
        const objectStore = transaction.objectStore(store);
        const serialized = JSON.parse(JSON.stringify(payload));
        const request = objectStore.add(serialized);
        request.onerror = () => console.error(request.error);
        transaction.oncomplete = () => db.close();
      } else {
        indexedDB.deleteDatabase("grauchiTitlesStore");
      }
    };
  };

  // save reminder to IndexedDB
  const saveReminder = () => {
    setError("");
    const id = Math.floor(Math.random() * 10000000) + 1000;
    if (!title) {
      setError("Please specify a title");
      return;
    }
    addElement("grauchiStore", {
      uuid: id,
      videoID: currentUrl,
      title: title,
      createdAt: new Date().toISOString(),
    });

    // send notification
    chrome.notifications.create(`${id}`, {
      type: "basic",
      iconUrl: "icon128.png",
      title: "BookMark Reminder",
      message: `New video title saved successfully`,
      priority: 2,
      requireInteraction: true,
    });
    // window.close(); // close the popup

    // create an alarm
    // chrome.runtime.sendMessage({ time: "1" }, (res) => {
    //   console.log(res);
    // });
  };

  if (currentUrl && !currentUrl.includes("youtube.com")) {
    return (
      <div className="App">
        <div>
          <h1>This extension only works on Youtube</h1>
          <p>You are currently at : {currentUrl?.slice(0, 20)}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div>
        <input
          placeholder="Desired Video Title"
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={saveReminder}>Save Title</button>
        {error && !title && (
          <p style={{ fontSize: ".9em", marginTop: ".5em", color: "red" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Popup;
