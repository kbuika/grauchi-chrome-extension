<h2 align="center">DJ Grauchi Chrome Extension</h2>

### The Problem
All mixes under ```The Good Company``` youtube channel are not well named. There is no way to tell whether a video is a HipHop/Afrobeats/Reggae/Pop mix. All you can do is start listening and cross your fingers and hope you'll like it.


### The Solution
A chrome extension that renames all of the mixes appropriately. This way, if you are in the mood for some Amapiano, you don't have to go through 7 videos just to find the perfect one.

### How the solution works
Simple, sort of. I know you must be wondering, "Who is renaming the titles?", good question. I am the one renaming the titles (as of the current solution). The way it works is, When you click on a video, I make sure it is a video under "The Good Company", then I get the video-ID(watch id) that uniquely identifies a YT video. I then use this ID to get all the comments for that video, find my comment from the list and then set my comment as the video title.

[log 1] Getting my (Steve Kibuika's) comment was easy and it worked very well. But I needed a solution that could be easily adopted by other users.
    Solution: Fetch the current user's username.
    This sounds good and it made sense. But it came with a new problem. I could not access the cuurent user's username since the username exists in a popup. The issue was that, popups do not exist in the DOM unless they are clicked (opened). So I had to hack a solution that would add the popup to the DOM by clicking it to open and then clicking it to close.

    It worked!!

### Bottlenecks

 - The main idea is to rename Grauchi's mixes so you don't have to click a video. This means, I need to design a script that will run on the main youtube page and not just when a video is clicked. I have not put much thought into this, I am hoping to get one of those ```eureka``` moments. [update] - I learn't of Mutation Observer that would listen to DOM mutations and run a script that would find The Good Company KE's videos, fetch comments, look for the user's comment and update it to the title


### In case the code doesn't make sense
Chrome extensions rely on the ```manifest.json``` file. This is essentially what tells the extension which pages to work on and which scripts to run.
```js
{
    "manifest_version": 3,
    "name": "DJ Grauchi",
    "version": "1.0.0",
    "content_scripts": [
        {
            "matches": ["https://www.youtube.com/*"],
            "js": ["js/content.js"]
        }
    ]
}
```
```content_scripts``` is where everything lies. ```matches``` defines the urls in which the extension will run on, in this case, it only works on Youtube. ```js``` points to the script to be executed. ```manifest_version``` has to be ```3``` if you are working with the latest chrome versions.


```js/content.js``` is the main script. Here, the only thing you'll need is a ```Google API``` with ```Youtube Data Insights``` enabled.

To test it, open ```manage extensions``` on chrome, make sure Developer mode is on, click on ```Load Unpacked``` and upload the whole project directory. Open Youtube and viola!!! It should work.

In case you need me, dm me on [twitter](https://twitter.com/the_kibuika) or email me ```kibuikacodes@gmail.com```