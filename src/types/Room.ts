import { IUserInLeaderBoard } from './UserInLeaderBoard';

export interface IUser {
  id: string;
  username: string;
  avatarURL: string;
  wins: number;
}

export interface IRoom {
  guildId: string;
  channelId: string;
  allowOtherUsers: boolean;
  hostId: string;
  users: IUser[];
  gameRoom: IGameRoom | false;
}

export type IGameRoomModes = 'fastest' | 'shortest' | 'reverse';

export interface IGameRoom {
  problemId: string;
  mode: IGameRoomModes;
  startedAt: Date;
  leaderBoard: IUserInLeaderBoard[];
}