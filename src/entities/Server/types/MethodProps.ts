import { EmbedBuilder } from 'discord.js';
import { IUser } from '../../../types/Room';

export interface CreateRoomProps {
  guildId: string;
  channelId: string;
  user: Omit<IUser, 'wins'>;
}
export interface UserJoinRoomProps {
  guildId: string;
  user: Omit<IUser, 'wins'>;
}
export interface UpdateGameRoomLeaderBoardProps {
  guildId: string;
  userId: string;
  score: number;
  code: string;
}
export interface FinishGameRoomResponse {
  embedRoomLeaderBoard: EmbedBuilder;
  embedsGameRoomUsersCode: EmbedBuilder[];
}