export type IGameRoomSubmissionResponse = 
  IGameRoomSubmissionResponseTestFail | 
  IGameRoomSubmissionResponseError | 
  IGameRoomSubmissionResponseNotMaxScore |
  IGameRoomSubmissionResponseMaxScore;

interface IGameRoomSubmissionResponseTestFail {
  type: 'testFail';
  testCase: number;
  expected: string;
  received: string;
}

interface IGameRoomSubmissionResponseError {
  type: 'error';
  testCase: number;
  message: string;
}

interface IGameRoomSubmissionResponseNotMaxScore {
  type: 'notMaxScore';
  message: string;
}

interface IGameRoomSubmissionResponseMaxScore {
  type: 'maxScore';
  message: string;
}