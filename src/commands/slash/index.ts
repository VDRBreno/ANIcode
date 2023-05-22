import { ISlashCommand } from '../../types/Command';
import closeRoom from './closeRoom';
import finishGameRoom from './finishGameRoom';
import help from './help';
import infoGameRoom from './infoGameRoom';
import infoRoom from './infoRoom';
import joinRoom from './joinRoom';
import openRoom from './openRoom';
import startGame from './startGame';
import submitGameRoom from './submitGameRoom';

const slashCommands: ISlashCommand[] = [
  openRoom,
  joinRoom,
  infoRoom,
  help,
  closeRoom,
  startGame,
  submitGameRoom,
  infoGameRoom,
  finishGameRoom
];

export default slashCommands;