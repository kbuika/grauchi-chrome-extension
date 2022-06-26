const params = new URLSearchParams(window.location.search);
let videoID = params.get("v");

var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length) {
      if (mutation.type == "childList") {
        console.log(mutation.target.innerText);
      }
    }
  });
});

async function checkNode() {
  // get the node that has the youtube video title
  var targetNode = document.querySelector(
    "h1.title.style-scope.ytd-video-primary-info-renderer"
  );
  if (!targetNode) {
    window.setTimeout(checkNode, 500); // delay the execution so all content loads.
    return;
  }
  // fetch request to get video comments
  let title = await getNewTitleFromComment(videoID); // get the title from the comments (Takes the comment from Steve Kibuika and sets that as title)
  if(title){
    // if title is not empty, set the title to the new title
    targetNode.innerText = title;
  } else {
    targetNode.innerText = "Comment below in order to change title"; // replace the title with the new title ( from Steve's comment )
  }
  var config = {
    childList: true,
    subtree: true,
  };
  observer.observe(targetNode, config);
}

let channelName = params.get("ab_channel");
// TODO: get channel name from html elements instead of url
if (channelName === "TheGoodCompanyKE") {
  checkNode();
}

const getNewTitleFromComment = async (url) => {
  let title;
  try{
    async function getData() {
      const response = await fetch(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${url}&key=${process.env.YOUTUBE_API_KEY}`);
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      const comments = await response.json();
      return comments.items;
    }
    await getData().then((comments) => {
      console.log(comments);
    const myComment = comments.filter(comment => {
      return comment?.snippet?.topLevelComment?.snippet?.authorDisplayName === "Steve Kibuika"
    })
    console.log(myComment)
    title = myComment[0]?.snippet?.topLevelComment?.snippet?.textDisplay;
    return title;
  });
  }catch(e){
    console.log(e)
  }
  return title;
};
