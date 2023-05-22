import { IUser } from '../types/Room';

export default function sortRoomUserWins(a: IUser, b: IUser) {
  if(b.wins>a.wins) return 1;
  else if(b.wins<a.wins) return  -1;

  return 0;
}