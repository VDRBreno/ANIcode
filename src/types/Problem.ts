export interface IProblemTest {
  input: string;
  output: string;
}

export interface IProblem {
  id: string;
  title: string;
  question: string;
  examples: IProblemTest[];
  testCases: IProblemTest[];
  solution: string;
}