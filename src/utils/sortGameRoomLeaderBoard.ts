import { IUserInLeaderBoard } from '../types/UserInLeaderBoard';

export default function sortGameRoomLeaderBoard(a: IUserInLeaderBoard, b: IUserInLeaderBoard, pattern: 'default' | 'char') {
  if(b.score>a.score) return 1;
  else if(b.score<a.score) return -1;

  if(pattern==='default') {

    // SORT BY FIRST SUBMISSION THAT ACCEPTED, CHARACTERS IN CODE, TRIES SUBMISSION
    if(typeof b.lastSend!=='boolean'&&typeof a.lastSend==='boolean') return 1;
    else if(typeof b.lastSend==='boolean'&&typeof a.lastSend!=='boolean') return -1;
    else if(typeof b.lastSend==='boolean'&&typeof a.lastSend==='boolean') return 0;

    if(new Date(b.lastSend as Date).getTime()>new Date(a.lastSend as Date).getTime()) return 1;
    else if(new Date(b.lastSend as Date).getTime()<new Date(a.lastSend as Date).getTime()) return -1;

    if(b.code.length<a.code.length) return 1;
    else if(b.code.length>a.code.length) return -1;

  } else if(pattern==='char') {
    
    // SORT BY CHARACTERS IN CODE, TRIES SUBMISSION
    if(b.code.length<a.code.length) return 1;
    else if(b.code.length>a.code.length) return -1;

  }

  return 0;
}