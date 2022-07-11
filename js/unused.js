

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
    let title = await getNewTitleFromComment(videoID); // get the title from the comments (Takes the comment from Steve Kibuika and sets that as title)
    console.log(title);
    // set the title to the new title
    targetNode.innerText = title;
    var config = {
      childList: true,
      subtree: true,
    };
    observer.observe(targetNode, config); // invokes the observer to observe changes in the DOM
  }
};
checkNode();

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
    await getData().then((comments) => {
      const myComment = comments.filter((comment) => {
        return (
          comment?.snippet?.topLevelComment?.snippet?.authorDisplayName === "Steve Kibuika"
        );
      });
      title = myComment[0]?.snippet?.topLevelComment?.snippet?.textDisplay || "Comment below to change the title";
      return title;
    });
  } catch (e) {
    console.log(e);
  }
  return title;
};
