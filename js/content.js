console.log("hey youtube");

const params = new URLSearchParams(window.location.search);
let videoID = params.get("v");
let userName;

setTimeout(() => {
  document.querySelector("ytd-popup-container").style['display'] = "none"; // hides the popup
  document.getElementById("avatar-btn")?.click() // clicks the avatar to open the pop up, this way it will be added to the DOM without being visible
  document.getElementById("avatar-btn")?.click()
  userName = document.querySelector("#account-name")?.innerText
  document.querySelector("ytd-popup-container").style['display'] = "block";
},1000)


// crude data stores
const videoIDs = [];
let previousChildNodes = 0; // keeps track of previous child nodes count

const InnerPageObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      if (mutation.type == "childList") {
        console.log(mutation.target.innerText);
      }
    }
  });
});

// This helps us with observing changes to the DOM
const MainPageObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      if (mutation.type == "childList") {
        if (targetNode.children.length !== previousChildNodes) {
          Array.from(targetNode.children).map(async (node) => {
            let list = node.querySelectorAll(
              '[aria-label*="The Good Company KE"]'
            );
            if (list.length > 0) {
              let watchParam = list?.[0]?.getAttribute("href");
              if (watchParam) {
                let videoIDArr = watchParam.split("=");
                let videoID;
                {
                  videoIDArr.length > 2
                    ? (videoID = videoIDArr[videoIDArr.length - 2])
                    : (videoID = videoIDArr[videoIDArr.length - 1]);
                }
                if (!videoIDs.includes(videoID)) {
                  let title = await getNewTitleFromComment(videoID);
                  let previousTitle = list[1].innerText
                  if(title){list[1].innerText = title}else{list[1].innerText = `${previousTitle} (comment to change title)`}
                  videoIDs.push(videoID);
                }
              }
            }
          });
          previousChildNodes = targetNode.children.length;
        }
      }
    }
  });
});

checkMainNode = async () => {  
  if (videoID) {
    // get the node that has the youtube video title
    targetNode = document.querySelector(
      "h1.title.style-scope.ytd-video-primary-info-renderer"
    );
    if (!targetNode) {
      window.setTimeout(checkMainNode, 1000); // delay the execution so all content loads.
      return;
    }
    // get channel name from HTML elements
    const channelTitle = document
      .querySelector("yt-formatted-string.style-scope.ytd-channel-name")
      .getElementsByTagName("a")?.[0]?.innerHTML;
    if (channelTitle === "The Good Company KE") {
      // fetch request to get video comments
      let title = await getNewTitleFromComment(videoID); // get the title from the comments (Takes the comment from Steve Kibuika and sets that as title)
      // set the title to the new title
      if(title){targetNode.innerText = title || "Add comment to change title"}
      let config = {
        childList: true,
        subtree: true,
      };
      InnerPageObserver.observe(targetNode, config); // invokes the observer to observe changes in the DOM
    }
  } else {
    targetNode = document.querySelector(
      "div.style-scope.ytd-rich-grid-renderer#contents"
    );
    if (!targetNode) {
      setTimeout(checkMainNode, 1000);
    }

    let config = {
      attributes: false,
      childList: true,
      subtree: true,
    };
    MainPageObserver.observe(targetNode, config); // invokes the observer to observe changes in the DOM
  }
};

setTimeout(checkMainNode, 0); // delay the execution so all content loads.
// checkMainNode();

const getNewTitleFromComment = async (url) => {
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
    if(!userName){
      document.querySelector("ytd-popup-container").style['display'] = "none"; // hides the popup
      document.getElementById("avatar-btn")?.click() // clicks the avatar to open the pop up, this way it will be added to the DOM without being visible
      document.getElementById("avatar-btn")?.click()
      userName = document.querySelector("#account-name")?.innerText
      document.querySelector("ytd-popup-container").style['display'] = "block";
    }
    await getData().then((comments) => {
      const myComment = comments.filter((comment) => {
        return (
          comment?.snippet?.topLevelComment?.snippet?.authorDisplayName === userName
        );
      });
      title = myComment[0]?.snippet?.topLevelComment?.snippet?.textDisplay || null;
      return title;
    });
  } catch (e) {
    console.log(e);
  }
  return title;
};
