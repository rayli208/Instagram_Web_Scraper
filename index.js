const ig = require('./instagram');

(async () => {

  await ig.initialize();

  await ig.login('smokey_shmoe', '0201123rR$');

  await ig.retrieveAllFollowers('smokey_shmoe');

  await ig.populateFollowerArray();

  await ig.loadUpEachFollower();

  // await ig.likeTagsProcess(['marijuana', 'smoke']);

  debugger;

})()