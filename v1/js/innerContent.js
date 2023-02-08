console.log("hey youtube inner page");

const [currentUser, setCurrentUser] = useState("Steve Kibuika");

const urlParams = new URLSearchParams(window.location.search);
let videoId = urlParams.get("v");
console.log("hey youtube inner page", currentUser());
let currentUserName;

setTimeout(() => {
  document.querySelector("ytd-popup-container").style["display"] = "none"; // hides the popup
  document.getElementById("avatar-btn")?.click(); // clicks the avatar to open the pop up, this way it will be added to the DOM without being visible
  document.getElementById("avatar-btn")?.click();
  currentUserName = document.querySelector("#account-name")?.innerText;
  document.querySelector("ytd-popup-container").style["display"] = "block";
}, 1000);
console.log(currentUserName);

// This helps us with observing changes to the DOM
var observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      if (mutation.type == "childList") {
        console.log(mutation.target.innerText);
      }
    }
  });
});

const checkNode = async () => {
  // get the node that has the youtube video title
  var targetNode = document.querySelector(
    "h1.title.style-scope.ytd-video-primary-info-renderer"
  );
  if (!targetNode) {
    window.setTimeout(checkNode, 500); // delay the execution so all content loads.
    return;
  }
  // get channel name from HTML elements
  const channelTitle = document
    .querySelector("yt-formatted-string.style-scope.ytd-channel-name")
    .getElementsByTagName("a")[0].innerHTML;
  if (channelTitle === "The Good Company KE") {
    // fetch request to get video comments
    let title = await getNewVideoTitleFromComment(videoId); // get the title from the comments (Takes the comment from Steve Kibuika and sets that as title)
    console.log(title);
    // set the title to the new title
    {
      title
        ? (targetNode.innerText = title)
        : (targetNode.innerText = `${targetNode.innerText} (comment to change title)`);
    }
    var config = {
      childList: true,
      subtree: true,
    };
    observer.observe(targetNode, config); // invokes the observer to observe changes in the DOM
  }
};
checkNode();

const getNewVideoTitleFromComment = async (url) => {
  let title;
  try {
    async function getData() {
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${url}&key=YOUR_API_KEY`
      );
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      const comments = await response.json();
      return comments.items;
    }
    // if (!currentUserName) {
    document.querySelector("ytd-popup-container").style["display"] = "none"; // hides the popup
    document.getElementById("avatar-btn")?.click(); // clicks the avatar to open the pop up, this way it will be added to the DOM without being visible
    document.getElementById("avatar-btn")?.click();
    currentUserName = document.querySelector("#account-name")?.innerText;
    document.querySelector("ytd-popup-container").style["display"] = "block";
    // }
    console.log(currentUserName);
    await getData().then((comments) => {
      const myComment = comments.filter((comment) => {
        return (
          comment?.snippet?.topLevelComment?.snippet?.authorDisplayName ===
          currentUser()
        );
      });
      title =
        myComment[0]?.snippet?.topLevelComment?.snippet?.textDisplay || null;
      return title;
    });
  } catch (e) {
    console.log(e);
  }
  return title;
};

function useState(initialState) {
  let _val = initialState;
  const state = () => _val;
  const setState = (newVal) => {
    _val = newVal;
  };
  return [state, setState];
}
