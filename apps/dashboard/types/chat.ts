export interface chatTokenType {
  id: number;
  role: string;
}

export interface chatRoomMessageType {
  content: string;
  senderId: number;
  username: string;
  timestamp: Date;
  saved: boolean;
  distributed: boolean;
  seen: boolean;
  new: boolean;
  _id: number;
  id_chat_room: number;
}

export interface chatMessageType {
  roomId: number;
  messages: chatRoomMessageType[];
}

export interface chatRoomUserStatusType {
  state: string;
  lastChanged: string;
}

export interface chatRoomUserType {
  _id: number;
  username: string;
  avatar: string;
  role: string;
  status: chatRoomUserStatusType;
}

export interface chatRoomType {
  roomId: number;
  roomName: string;
  type: string;
  avatar: string;
  unreadCount: number;
  index: number;
  lastMessage: chatRoomMessageType | null;
  users: chatRoomUserType[];
  // typingUsers: [4322]
  typingUsers: chatRoomUserType[];
}

export interface userNameOptionType {
  minUsers: number;
  currentUser: boolean;
}

export interface chatMessageOptionType {
  name: string;
  title: string;
  onlyMe?: boolean;
}

export interface chantMessageFile {
  file: string | ArrayBuffer | null;
  extension: string;
  name: string;
  size: number;
  type: string;
}

export interface chatAutoScrollChildType {
  new: boolean;
  newAfterScrollUp: boolean;
}

export interface chatAutoScrollType {
  send: chatAutoScrollChildType;
  receive: chatAutoScrollChildType;
}

export interface messageActionHandlerInputType {
  roomId: number;
  action: {
    name: string;
  };
  message: string;
}

export interface fetchMessageInputType {
  room: chatRoomType;
  options: string;
}

export interface chatFileType {
  blob: Blob;
  extension: string;
  name: string;
  size: number;
  type: string;
}

export interface sendMessageInputType {
  roomId: number;
  content: string;
  files: chatFileType[];
  replyMessage: replyMessageType;
  usersTag?: string;
}

export interface roomActionInputType {
  roomId: number;
  action: {
    name: string;
  };
}

export interface replyMessageType {
  content: string;
  senderId: string;
  files?: [
    {
      name: string;
      size: number;
      type: string;
      audio: boolean;
      duration: number;
      url: string;
      preview: string;
    }
  ];
}
