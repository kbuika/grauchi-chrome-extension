console.log("content loaded");

const params = new URLSearchParams(window.location.search);
const videoID = params.get("v");
console.log(videoID);

/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */

console.log("hey youtube inner page");

setTimeout(() => {
  document.querySelector<HTMLElement>("ytd-popup-container").style["display"] =
    "none"; // hides the popup
  document.getElementById("avatar-btn")?.click(); // clicks the avatar to open the pop up, this way it will be added to the DOM without being visible
  document.getElementById("avatar-btn")?.click();
  document.querySelector<HTMLElement>("ytd-popup-container").style["display"] =
    "block";
}, 1000);

// This helps us with observing changes to the DOM
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      if (mutation.type == "childList") {
        console.log(mutation.target);
      }
    }
  });
});

const checkNode = () => {
  // get the node that has the youtube video title
  const targetNode = document.querySelector<HTMLElement>(
    "#title > h1 > yt-formatted-string"
  );
  if (!targetNode) {
    window.setTimeout(checkNode, 500); // delay the execution so all content loads.
    return;
  }
  // get channel name from HTML elements
  const channelTitle = document
    .querySelector("yt-formatted-string.style-scope.ytd-channel-name")
    .getElementsByTagName("a")[0].innerHTML;
  console.log(channelTitle);
  //   if (channelTitle === "The Good Company KE") {
  // fetch request to get video comments
  const title = "Test test"; // get the title from the comments (Takes the comment from Steve Kibuika and sets that as title)
  console.log(title);
  // set the title to the new title
  {
    title
      ? (targetNode.innerText = title)
      : (targetNode.innerText = `${targetNode.innerText}`);
  }
  const config = {
    childList: true,
    subtree: true,
  };
  observer.observe(targetNode, config); // invokes the observer to observe changes in the DOM
  //   }
};

checkNode();

// const getNewVideoTitleFromComment = async (url) => {
//   let title: string;
//   try {
//     // if (!currentUserName) {
//     document.querySelector<HTMLElement>("ytd-popup-container").style[
//       "display"
//     ] = "none"; // hides the popup
//     document.getElementById("avatar-btn")?.click(); // clicks the avatar to open the pop up, this way it will be added to the DOM without being visible
//     document.getElementById("avatar-btn")?.click();
//     document.querySelector<HTMLElement>("ytd-popup-container").style[
//       "display"
//     ] = "block";
//     // }
//     title = "my title" || null;
//   } catch (e) {
//     console.log(e);
//   }
//   return title;
// };
