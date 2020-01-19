/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const easyvk = require("easyvk");
const { intersection } = require("lodash");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const USER_AGENT = "KateMobileAndroid/45 lite-421 (Android 5.0; SDK 21; armeabi-v7a; LENOVO Lenovo A1000; ru)";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

easyvk({
  access_token: process.env.ACCESS_TOKEN,
  userAgent: USER_AGENT,
}).then(async (vk) => {
  const me = await vk.call("users.get").then(({ vkr }) => vkr[0]);
  const myAudios = await vk.call("audio.get").then(({ vkr }) => vkr.items.map((el) => el.id));
  const myFriends = await vk.call("friends.get").then(({ vkr }) => vkr.items);
  const data = {
    user: `${me.first_name} ${me.last_name} (${me.id})`,
    audios: myAudios.length,
    friends: myFriends.length,
    similarity: [],
  };
  console.log(data);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < myFriends.length; i++) {
    const owner_id = myFriends[i];
    const friend = await vk.call("users.get", { user_ids: owner_id }).then(({ vkr }) => vkr[0]);
    await sleep(1000);
    try {
      const friendAudios = await vk.call("audio.get", { owner_id })
        .then(({ vkr }) => vkr.items.map((el) => el.id));
      if (friendAudios.length > 0) {
        const inters = intersection(myAudios, friendAudios).length;
        const similarity = {
          ...friend,
          intersection: inters,
          count: friendAudios.length,
          percent: inters / friendAudios.length,
          allAudiosCount: myAudios.length + friendAudios.length - inters,
          similarity: inters / (myAudios.length + friendAudios.length - inters),
        };
        data.similarity.push(similarity);
        console.log(similarity);
      } else {
        const errData = { ...friend, err: "no_audios" };
        data.similarity.push(errData);
        console.log(errData);
      }
    } catch (e) {
      const errData = { ...friend, err: e.message };
      data.similarity.push(errData);
      console.log(errData);
    }
  }
  fs.writeFileSync("data.json", JSON.stringify(data));
});
