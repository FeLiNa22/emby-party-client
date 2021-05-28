export class SidebarController {
  member;

  constructor(member) {
    this.member = member;
  }

  isMe = (user) => {
    return this.member.getUser().id === user.id;
  };

  getPartyName = () => {
    return this.member.getParty().name;
  };

  getPartyMembers = () => {
    return this.member.getParty().members;
  }

  sendMessage = (message) => {
    var party = this.member.getParty();
    this.member.broadcastMessage(party.id, message);
  };

  whisperMessage = (message, memberId) => {
    var party = this.member.getParty();
    this.member.whisperMessage(party.id, message, memberId);
  };

  deleteMessage = (messageId) => {
    var party = this.member.getParty();
    this.member.deleteMessage(party.id, messageId);
  };

  leaveParty = () => {
    var party = this.member.getParty()
    this.member.leaveParty(party.id);
  }

  setOnBroadcast = (callback) => {
    // I ignore the party param for now as I have a stateless messaging service
    this.member.setOnBroadcastListener((party, user, message) => {
      callback(user, message);
    });
  };

  setOnWhisper = (callback) => {
    // I ignore the party param for now as I have a stateless messaging service
    this.member.setOnWhisperListener((party, user, message) => {
      callback(user, message);
    });
  };

  setOnAlert = (callback) => {
    // I ignore the party param for now as I have a stateless messaging service
    this.member.setOnAlertListener((party, message) => {
      callback(message);
    });
  };

  setOnDelete = (callback) => {
    // I ignore the party param for now as I have a stateless messaging service
    this.member.setOnDeleteListener((party, user, message) => {
      callback(user, message);
    });
  };

  setOnUserJoin = (callback) =>{
    // I ignore the party param for now as I have a stateless messaging service
    this.member.setOnUserJoinListener((party, user) =>{
      callback(user);
    })
  }
  
  setOnUserLeft = (callback) =>{
    // I ignore the party param for now as I have a stateless messaging service
    this.member.setOnUserLeftListener((party, user) =>{
      callback(user);
    })
  }
}
