<h2 align="center">DJ Grauchi Chrome Extension</h2>

### The Problem

All mixes under `The Good Company` youtube channel are not well named. There is no way to tell whether a video is a HipHop/Afrobeats/Reggae/Pop mix. All you can do is start listening and cross your fingers and hope you'll like it.

### The Solution

A chrome extension that renames all of the mixes appropriately. This way, if you are in the mood for some Amapiano, you don't have to go through 7 videos just to find the perfect one.

### How the solution works

Simple, sort of. I know you must be wondering, "Who is renaming the titles?", good question. I am the one renaming the titles (as of the first solution). The way it works is, When you click on a video, I make sure it is a video under "The Good Company", then I get the video-ID(watch id) that uniquely identifies a YT video. I then use this ID to get all the comments for that video, find my comment from the list and then set my comment as the video title.

[log 1] Getting my (Steve Kibuika's) comment was easy and it worked very well. But I needed a solution that could be easily adopted by other users.

    Solution: Fetch the current user's username then use that username to get the user's comment and use that as the title.
    This sounds good and it made sense. But it came with a new problem. I could not access the cuurent user's username since the username exists in a popup.
    The issue was that, popups do not exist in the DOM unless they are clicked (opened). So I had to hack a solution that would add the popup to the DOM by clicking it to open and then clicking it to close.


    document.querySelector("ytd-popup-container").style['display'] = "none"; // hides the popup
    document.getElementById("avatar-btn")?.click() // clicks the avatar to open the pop up, this way it will be added to the DOM without being visible
    document.getElementById("avatar-btn")?.click()
    userName = document.querySelector("#account-name")?.innerText
    document.querySelector("ytd-popup-container").style['display'] = "block";


    This block of code helped me achieve this effect.

    - Clicks the popup twice to show and hide and then from there I can access the username.

    It worked!!

### Bottlenecks

- The main idea is to rename Grauchi's mixes so you don't have to click a video. This means, I need to design a script that will run on the main youtube page and not just when a video is clicked. I have not put much thought into this, I am hoping to get one of those `eureka` moments.

[update] - I learn't of Mutation Observer that would listen to DOM mutations and run a script that would find The Good Company KE's videos, fetch comments, look for the user's comment and update it to the title

The Mutation Observer keeps track of changes in the DOM. In this case, the change we want to keep track of is the list of "child nodes" (video items) that are in the DOM. Ideally, when you are scrolling down, the number of child nodes is increasing and it is important to keep track of that. This way, when new nodes (video items) are added to the DOM, we can check for `The Good Company KE`'s videos and find the title we want to replace the title with.

This was the most fascinating thing in this project. It was a very spot-on solution that put everything together and allowed things to work in a way I would not have anticipated.

I even wrote about it in my blog - [MutationObserver saved my weekend build](https://kibuika.com/posts/Mutation-Observer)

### The atomics of Chrome extensions

Chrome extensions rely on the `manifest.json` file. This is essentially what tells the extension which pages to work on and which scripts to run.

```js
{
  "manifest_version": 3,
  "name": "DJ Grauchi",
  "version": "1.0.0",
  "description": "An extension that renames The Good Company KE's mixes according to the comments you add to the videos.",
  "content_scripts": [
    {
      "matches": ["https://www.youtube.com/*"],
      "js": ["js/content.js"],
      "all_frames": true,
      "run_at": "document_idle"
    },
    {
      "matches": ["https://www.youtube.com/watch*"],
      "js": ["js/innerContent.js"],
      "all_frames": true,
      "run_at": "document_end"
    }
  ],
  "icons": {
    "16": "icon16.png",
    "32": "icon32.png",
    "48": "icon48.png",
    "128": "icon128.png"
  }
}
```

`content_scripts` is where everything lies. `matches` defines the urls in which the extension will run on, in this case, it only works on Youtube. `js` points to the script to be executed. `manifest_version` has to be `3` if you are working with the latest chrome versions.

`js/content.js` is the main script. Here, the only thing you'll need is a `Google API` with `Youtube Data API` enabled.

`js/content.js` runs on the Youtube homepage while `js/innerContent.js` runs on the inner Youtube video page (this script is however not properly loading at the moment, if you can, please create a PR 😄)

The `run_at` property defines when the script is executed. Ideally, we want our scripts to be executed when the page document has loaded. However, since we are making use of [Mutation Observers](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver), it doesn't matter much when our script is executed.

You can learn more about `content_scripts` [here](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)

### Running the project

Once you've cloned the project, get a Google API with `Youtube Data API` enabled and replace it on the url requests. To run it on the browser, open `manage extensions` on chrome, make sure Developer mode is on, click on `Load Unpacked` and upload the whole project directory. Open Youtube and viola!!! It should work.

To learn more about developing Chrome Extensions, read their very good docs [here](https://developer.chrome.com/docs/extensions/mv3/)

#### Fancy optional things

I find it fun to add "cute" features to my code, simply because I want to enjoy reading the code.
For this project, the cute feature was `useState`.

This is a "hook" in React that provides a state value (state being a snapshot of data at a particular moment) and a setter function which is used to update the state.

Here, I decided to use this concept to store the username, this way, instead of having a variable that may need to be mutated in the course of the script execution, I can just access the username from the state value and update it using the setter function.

```js
function useState(initialState) {
  let _val = initialState;
  const state = () => _val;
  const setState = (newVal) => {
    _val = newVal;
  };
  return [state, setState];
}
```

This is how I wrote that useState function. It is not exactly how it is in React but this is a much simpler way to write it especially when you only want to keep track of a single state value. It uses the concept of `closures` to keep a reference to the value.

A couple of things to note:

    - The returned methods are a getter(state) and a setter(setState)
    - This will only work with a single state value, for multiple values, you need to make use of arrays and indexes
    - This problem could have been better solved by the Storage API in chrome (a possible PR)

In case you need me, dm me on [twitter](https://twitter.com/the_kibuika) or email me `kibuikacodes@gmail.com`
