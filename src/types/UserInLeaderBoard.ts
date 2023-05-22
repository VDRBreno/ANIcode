export interface IUserInLeaderBoard {
  id: string;
  username: string;
  avatarURL: string;
  lastSend: Date | boolean;
  score: number;
  tries: number;
  code: string;
}