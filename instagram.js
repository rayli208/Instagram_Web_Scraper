const puppeteer = require('puppeteer');

const BASE_URL = 'https://instagram.com/';

const TOTAL_FOLLOWERS_ARRAY = [];

const TAG_URL = (tag) => `https://www.instagram.com/explore/tags/${tag}/`;

//TEST COMMENT

const instagram = {
  browser: null,
  page: null,

  initialize: async () => {
    instagram.browser = await puppeteer.launch({
      headless: false
    });

    instagram.page = await instagram.browser.newPage();
  },

  //this function logs you in to your account
  login: async (username, password) => {
    //Load up page
    await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });

    await instagram.page.waitFor(1000);

    //Write username and password
    await instagram.page.type('input[name="username"]', username, { delay: 50 });
    await instagram.page.type('input[name="password"]', password, { delay: 50 });

    //Click Login Button
    await instagram.page.click('button[type="submit"]');

    await instagram.page.waitFor(2000);

    //Click save info if it exists
    await instagram.page.waitFor('main > div > div > div > section > div> button');
    await instagram.page.click('main > div > div > div > section > div> button');

    await instagram.page.waitFor(2000);

    await instagram.page.goto((BASE_URL + username), { waitUntil: 'networkidle2' });
  },

  //This function retrireves all the followers within your account
  retrieveAllFollowers: async (username) => {
    //go to the users followers
    await instagram.page.waitFor(`a[href='/${username}/following/']`);
    await instagram.page.click(`a[href='/${username}/following/']`);

    const followersDialog = 'div[role="dialog"] > div > div:nth-child(3)';
    await instagram.page.waitForSelector('div[role="dialog"] > div > div:nth-child(3) > ul');

    //scroll through all the followers
    scrollDown(followersDialog, instagram.page);

    await instagram.page.waitFor(5000);
  },

  //This function populates all the followers into an array
  populateFollowerArray: async () => {
    const allUserNames = await instagram.page.$$('li > div > div > div:nth-child(2) > div > span > a');

    for (let i = 0; i < allUserNames.length; i++) {
      const user = await (await allUserNames[i].getProperty('innerText')).jsonValue();
      
      TOTAL_FOLLOWERS_ARRAY.push(user);
    }
  },

  //This function goes through each of the followers in the array, and loads up their profile on a new instance of a page
  loadUpEachFollower: async () => {
    var totalFollowersLength = TOTAL_FOLLOWERS_ARRAY.length;

    for (var i = 0; i < totalFollowersLength; i++) {
        await instagram.page.goto(`https://www.instagram.com/${TOTAL_FOLLOWERS_ARRAY[i]}/`, { waitUntil: 'networkidle2'});
    }

    await instagram.page.waitFor(5000);
  }






  // likeTagsProcess : async (tags = []) => {
  //   for(let tag of tags){
  //     //Go to the tag page
  //     await instagram.page.goto(TAG_URL(tag), { waitUntil: 'networkidle2'});
  //     await instagram.page.waitFor(1000);

  //     let posts = await instagram.page.$$('img[decoding="auto"');

  //     for(let i = 0; i < 3; i++){
  //       let post = posts[i];

  //       //Click on the post
  //       await post.click();

  //       //wait for modal to appear
  //       await instagram.page.waitFor('div[role="dialog"]');
  //       await instagram.page.waitFor(1000);

  //       // let isLikeAble = await post.waitFor('svg[aria-label="Like"]');

  //       await instagram.page.waitFor('svg[aria-label="Like"]');
  //       await instagram.page.click('svg[aria-label="Like"]');

  //       // if(isLikeAble){
  //       //   await post.click('svg[aria-label="Like"]');
  //       // }

  //       await instagram.page.waitFor(3000);

  //       //Close the modal
  //       await instagram.page.click('svg[aria-label="Close"]');


  //       await instagram.page.waitFor(1000);
  //     }


  //     await instagram.page.waitFor(1000);
  //   }
  // }
}

//This scrolling function takes a page and a selector. It scrolls through the selector and gets all the followers on it
async function scrollDown(selector, page) {
  await page.evaluate(async selector => {
      const section = document.querySelector(selector);
      await new Promise((resolve, reject) => {
          let totalHeight = 0;
          let distance = 100;
          const timer = setInterval(() => {
              var scrollHeight = section.scrollHeight;
              section.scrollTop = 100000000;
              totalHeight += distance;

              if (totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 100);
      });
  }, selector);
} 

module.exports = instagram;