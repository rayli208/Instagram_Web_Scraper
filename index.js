const ig = require('./instagram');

(async () => {

  await ig.initialize();

  await ig.login('***', '***$');

  await ig.retrieveAllFollowers('smokey_shmoe');

  await ig.populateFollowerArray();

  await ig.loadUpEachFollower();

  // await ig.likeTagsProcess(['marijuana', 'smoke']);

  debugger;

})()