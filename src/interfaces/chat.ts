export default interface ChatState {
  publicChats: Chat[];
  privateChats: Map<any, any>;
  tab: string;
  my: User; 
  // Users: User[];
}

export interface Chat {
  senderName: string | Partial<Chat>[];
  receivername: string;
  message: string;
	status: Status;
}

export interface User {
	username: string;
  receivername: string;
  connected: boolean;
	message: string;
}

export enum Status {
  JOIN = "JOIN",
  MESSAGE = "MESSAGE",
  LEAVE = "LEAVE"
}