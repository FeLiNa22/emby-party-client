export class UserDataController {
  getUser = () => chrome.storage.sync.get(["EmbyPartyUserName"]);

  changeName = (name) => chrome.storage.sync.set({ EmbyPartyUserName: name });

  changeAvatar = (avatar) =>
    chrome.storage.sync.set({ EmbyPartyUserAvatar: avatar });
}
