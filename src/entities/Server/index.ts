import { problems } from '../../data/problems.json';
import { Judge } from '../Judge';
import serializeSubmissionFunction from '../Judge/utils/serializeSubmissionFunction';
import { FormattedError } from '../../types/FormattedError';
import { IGameRoom, IGameRoomModes, IRoom, IUser } from '../../types/Room';
import { CreateRoomProps, FinishGameRoomResponse, UpdateGameRoomLeaderBoardProps, UserJoinRoomProps } from './types/MethodProps';
import { IGameRoomSubmissionResponse } from './types/GameRoomSubmissionResponse';
import { IUserInLeaderBoard } from '../../types/UserInLeaderBoard';
import getRandomProblems from '../../utils/getRandomProblem';
import getDifferenceSubmissionTime from '../../utils/getDifferenceSubmissionTime';
import sortGameRoomLeaderBoard from '../../utils/sortGameRoomLeaderBoard';
import { EmbedBuilder } from 'discord.js';
import sortRoomUserWins from '../../utils/sortRoomUserWins';
import { IProblem } from '../../types/Problem';

export class Server {

  private rooms: IRoom[] = [];

  constructor() {}

  getRoomInfo(guildId: string) {
    const room = this.findRoom(guildId);
    return room;
  }
  createRoom({
    guildId,
    channelId,
    user
  }: CreateRoomProps) {

    const roomAlreadyExists = this.rooms.find(r => r.guildId===guildId);
    if(roomAlreadyExists)
      throw FormattedError({
        errorMessage: 'Já existe uma sala nesse servidor',
        error: 'Unable to createRoom, room already exists'
      });

    const userSerialized: IUser = {
      ...user,
      wins: 0
    }

    const room: IRoom = {
      guildId,
      channelId,
      allowOtherUsers: false,
      hostId: userSerialized.id,
      users: [userSerialized],
      gameRoom: false
    }

    this.addRoom(room);

    return room;

  }
  userJoinRoom({
    guildId,
    user
  }: UserJoinRoomProps) {

    const room = this.findRoom(guildId);

    if(room.users.find(u => u.id===user.id))
      throw FormattedError({
        errorMessage: 'Usuário já está registrado',
        error: 'Unable to userJoinRoom, user already in room'
      });

    if(room.gameRoom)
      throw FormattedError({
        errorMessage: 'Não é possível entrar na sala enquanto uma partida está em andamento',
        error: 'Unable to userJoinRoom, game is running'
      });

    const userSerialized: IUser = {
      ...user,
      wins: 0
    }

    const roomUpdated: IRoom = {
      ...room,
      users: [...room.users, userSerialized]
    }

    this.updateRoom(roomUpdated);

    return roomUpdated;

  }
  setHostPermission(guildId: string, userId: string, allowOtherUsers: boolean) {
    const room = this.findRoom(guildId);

    if(room.hostId!==userId)
      throw FormattedError({
        errorMessage: 'Apenas o host pode alterar as permissões',
        error: 'Unable to setHostPermission, an user that is not host try to set'
      });

    if(room.allowOtherUsers===allowOtherUsers) return;

    this.updateRoom({ ...room, allowOtherUsers });
  }
  closeRoom(guildId: string, userId: string) {
    const room = this.findRoom(guildId);
    
    if(!room.allowOtherUsers && room.hostId!==userId)
      throw FormattedError({
        errorMessage: 'Apenas quem abriu a sala pode fechar!',
        error: 'Unable to closeRoom, an user that is not host try to close'
      });

    this.removeRoom(guildId);
  }
  startGame(guildId: string, userId: string, mode: IGameRoomModes): IProblem {
    const room = this.findRoom(guildId)

    if(!room.allowOtherUsers && room.hostId!==userId)
      throw FormattedError({
        errorMessage: 'Apenas quem abriu a sala pode iniciar a partida',
        error: 'Unable to startGame, an user that is not host try to start'
      });

    if(room.gameRoom)
      throw FormattedError({
        errorMessage: 'Já existe uma partida iniciada nesse servidor',
        error: 'Unable to startGame, already have a gameRoom started'
      });

    const problem = getRandomProblems(1)[0];

    const gameRoom: IGameRoom = {
      problemId: problem.id,
      leaderBoard: room.users.map(user => ({
        id: user.id,
        username: user.username,
        avatarURL: user.avatarURL,
        score: 0,
        lastSend: false,
        code: '',
        tries: 0
      })),
      mode,
      startedAt: new Date()
    }

    this.updateRoom({ ...room, gameRoom });

    return {
      ...problem,
      title: mode==='reverse' ?'?' :problem.title,
      question: mode==='reverse' ?'?' :problem.question
    };
  }
  getProblemGameRoom(guildId: string): IProblem {
    const room = this.findRoom(guildId);

    if(typeof room.gameRoom==='boolean')
      throw FormattedError({
        errorMessage: 'Nenhuma partida encontrada',
        error: 'Unable to getProblemGameRoom, gameRoom not exists'
      });

    const problem = this.findProblem(room.gameRoom.problemId);

    return {
      ...problem,
      title: room.gameRoom.mode==='reverse' ?'?' :problem.title,
      question: room.gameRoom.mode==='reverse' ?'?' :problem.question
    };
  }
  verifyIfUserIsValidForSubmission(guildId: string, userId: string) {
    const room = this.findRoom(guildId);
    const user = this.findUser(room, userId);
    
    if(typeof room.gameRoom==='boolean')
      throw FormattedError({
        errorMessage: 'Nenhuma partida encontrada',
        error: 'Unable to verifyIfUserIsValidForSubmission, gameRoom not exists'
      });

    const userAlreadyFinished = room.gameRoom.leaderBoard.find(u => u.id===userId);
    if(userAlreadyFinished && userAlreadyFinished.score===100)
      throw FormattedError({
        errorMessage: 'Usuário já está com pontuação máxima',
        error: 'verifyIfUserIsValidForSubmission, user already completed the problem'
      });
  }
  gameRoomSubmission(guildId: string, userId: string, code: string) {
    const room = this.findRoom(guildId);
    const user = this.findUser(room, userId);

    if(typeof room.gameRoom==='boolean')
      throw FormattedError({
        errorMessage: 'Partida não encontrada',
        error: 'Unable to gameRoomSubmission, gameRoom not exists'
      });

    const userSolution = new Function(serializeSubmissionFunction(code));
    const problem = this.getProblemGameRoom(guildId);
    const problemSolution = new Function(serializeSubmissionFunction(problem.solution));

    let response: IGameRoomSubmissionResponse[] = [];

    let score = 0;
    let maxScore = problem.testCases.length;
    for(let i=0;i<maxScore;i++) {
      try {
        
        const judge = new Judge(problem.testCases[i].input, userSolution, problemSolution);

        if(judge.getOutput()===judge.getSolutionOutput()) {
          score++;
        } else {

          response[0] = {
            type: 'testFail',
            testCase: i+1,
            expected: problem.testCases[i].output,
            received: judge.getOutput()
          }

          break;

        }

      } catch(error: any) {

        if(typeof error==='object' && 'errorMessage' in error)
          response[0] = {
            type: 'error',
            testCase: i+1,
            message: error.errorMessage
          }
        else if(typeof error==='object' && 'message' in error)
          response[0] = {
            type: 'error',
            testCase: i+1,
            message: error.message
          }
        else
          response[0] = {
            type: 'error',
            testCase: i+1,
            message: error
          }

        break;

      }
    }

    const lastSend = new Date();

    if(score<maxScore) {

      const percentScore = Math.floor((score*100)/maxScore);

      response[1] = {
        type: 'notMaxScore',
        message: `O último envio de ${user.username} conseguiu ${percentScore}%`
      }

      this.updateGameRoomLeaderBoard({ guildId, userId, score: percentScore, code });

    } else {

      const differenceTime = getDifferenceSubmissionTime(lastSend, room.gameRoom.startedAt);
      response[0] = {
        type: 'maxScore',
        message: `${user.username} passou em todos os testes! em ${differenceTime}`
      }

      this.updateGameRoomLeaderBoard({ guildId, userId, score: 100, code });

    }

    return response;
  }
  updateGameRoomLeaderBoard({
    guildId,
    userId,
    score,
    code
  }: UpdateGameRoomLeaderBoardProps) {

    const room = this.findRoom(guildId);
    const user = this.findUser(room, userId);
    let gameRoom = room.gameRoom;

    if(typeof gameRoom==='boolean')
      throw FormattedError({
        errorMessage: 'Nenhuma partida encontrada',
        error: 'Unable to updateGameRoomLeaderBoard, gameRoom not exists'
      });

    const userInLeaderBoard = gameRoom.leaderBoard.find(u => u.id===userId);

    const leaderBoardUpdated: IUserInLeaderBoard[] = userInLeaderBoard
      ? gameRoom.leaderBoard.map(u =>u.id!==userId ?u :{
        ...u,
        tries: userInLeaderBoard.tries+1,
        lastSend: new Date(),
        score,
        code
      })
      : [...gameRoom.leaderBoard, {
        id: userId,
        username: user.username,
        avatarURL: user.avatarURL,
        score,
        lastSend: new Date(),
        code,
        tries: 1
      }];

    const gameRoomUpdated: IGameRoom = {
      ...gameRoom,
      leaderBoard: leaderBoardUpdated
    }

    this.updateRoom({ ...room, gameRoom: gameRoomUpdated });

  }
  getGameRoomLeaderBoard(guildId: string) {

    const room = this.findRoom(guildId);
    const gameRoom = room.gameRoom;
    if(typeof gameRoom==='boolean')
      throw FormattedError({
        errorMessage: 'Nenhuma partida encontrada',
        error: 'Unable to getGameRoomLeaderBoard, gameRoom not exists'
      });

    let embedDescription = '';
    const sortMode = ['fastest', 'reverse'].includes(gameRoom.mode) ?'default' :'char';

    const leaderBoardSorted = gameRoom.leaderBoard.sort((a,b) => sortGameRoomLeaderBoard(a,b, sortMode));

    leaderBoardSorted.map((u, i) => {
      const differenceTime = typeof u.lastSend!=='boolean'
        ?getDifferenceSubmissionTime(u.lastSend, gameRoom.startedAt)
        :'Não enviou';
      
      const userDetails = `${u.score}% - ${differenceTime} - ${u.tries} envio(s)`;

      embedDescription += `**${i+1}** ${u.username} - ${userDetails}`;
    });

    return embedDescription;

  }
  finishGameRoom(guildId: string): FinishGameRoomResponse {
    
    const room = this.findRoom(guildId);
    const gameRoom = room.gameRoom;
    if(typeof gameRoom==='boolean')
      throw FormattedError({
        errorMessage: 'Partida não encontrada',
        error: 'Unable to finishGameRoom, gameRoom not exists'
      });
      
    const sortMode = ['fastest', 'reverse'].includes(gameRoom.mode) ?'default' :'char';
    const leaderBoardSorted = gameRoom.leaderBoard.sort((a,b) => sortGameRoomLeaderBoard(a,b,sortMode));

    const userWinner = room.users.find(u => u.id===leaderBoardSorted[0].id);
    if(!userWinner)
      throw FormattedError({
        errorMessage: 'O vencedor da partida não foi encontrado na sala',
        error: 'Unable to finishGameRoom, winner is not registered in room'
      });

    const roomUpdated: IRoom = {
      ...room,
      users: room.users.map(u => u.id!==userWinner.id ?u :({
        ...userWinner,
        wins: userWinner.wins+1
      }))
    }

    const embeds: EmbedBuilder[] = [];

    leaderBoardSorted.reverse().map((u,i) => {
      const differenceTime = typeof u.lastSend!=='boolean'
        ?getDifferenceSubmissionTime(u.lastSend, gameRoom.startedAt)
        :'Não enviou';

      const userDetails = `${u.score}% - ${differenceTime} - ${u.tries} envio(s) - ${u.code.length} chars`;
      const embedDescription = `**${leaderBoardSorted.length-i}°** - ${userDetails}`;

      if(u.code) {
        const embed = new EmbedBuilder()
          .setDescription(`${embedDescription}\n\n\`\`\`js\n${u.code}\`\`\``)
          .setColor('Aqua')
          .setAuthor({
            name: u.username,
            iconURL: u.avatarURL
          });

        embeds.push(embed);
      }
    });

    const getEmbedRoomLeaderBoard = () => {
      let embedDescription = ``;

      roomUpdated.users.sort((a,b) => sortRoomUserWins(a,b)).map(u => {
        embedDescription += `\n${u.username} | ${u.wins}`;
      });

      const embed = new EmbedBuilder()
        .setTitle('Usuário / Vitórias')
        .setDescription(embedDescription)
        .setColor('DarkGreen')
        .setFooter({
          text: 'Use o comando de ajuda para dicas úteis'
        });

      return embed;
    }

    const embedRoomLeaderBoard = getEmbedRoomLeaderBoard();

    this.updateRoom({ ...roomUpdated, gameRoom: false });

    return {
      embedRoomLeaderBoard,
      embedsGameRoomUsersCode: embeds
    };

  }

  private findRoom(roomId: string) {
    const room = this.rooms.find(r => r.guildId===roomId);
    if(!room)
      throw FormattedError({
        errorMessage: 'Sala não encontrada',
        error: 'Unable to findRoom, room not exists'
      });
    return room;
  }
  private addRoom(room: IRoom) {
    this.rooms.push(room);
  }
  private updateRoom(room: IRoom) {
    this.rooms = this.rooms.map(r => r.guildId===room.guildId ?room :r);
  }
  private removeRoom(roomId: string) {
    this.rooms = this.rooms.filter(r => r.guildId!==roomId);
  }

  private findProblem(problemId: string) {
    const problem = problems.find(p => p.id===problemId);
    if(!problem)
      throw FormattedError({
        errorMessage: 'Problema não encontrado',
        error: 'Unable to findProblem, problem not exists'
      });
    return problem;
  }

  private findUser(room: IRoom, userId: string) {
    const user = room.users.find(u => u.id===userId);
    if(!user)
      throw FormattedError({
        errorMessage: 'Usuário não registrado',
        error: 'Unable to findUser, user not exists'
      });
    return user;
  }

}