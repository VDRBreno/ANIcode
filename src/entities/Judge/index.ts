export class Judge {

  private output = '';
  private solutionOutput = '';
  private userSolution: Function;
  private problemSolution: Function;
  private input: string;
  private currentLine = 0;

  constructor(input: string, userSolution: Function, problemSolution: Function) {
    this.input = input;

    this.problemSolution = problemSolution;
    try {
      this.problemSolution();
    } catch {
      throw JudgeError({
        errorMessage: 'Ocorreu um problema ao executar a solução do problema',
        error: 'Unable to Judge, an error ocurred in problemSolution'
      });
    }
    this.solutionOutput = this.output;

    this.resetEnvironment();

    this.userSolution = userSolution;
    try {
      this.userSolution();
    } catch(error: any) {
      throw error;
    }
  }

  private resetEnvironment() {
    this.currentLine = 0;
    this.output = '';
  }

  private readline() {
    if(this.input.split('\n').length-1<this.currentLine) return undefined;
    this.currentLine++;
    return this.input.split('\n')[this.currentLine-1];
  }

  private addToOutput(output: string) {
    if(this.output!=='')
      this.output += `\n${output}`;
    else
      this.output = `${output}`;
  }

  public getOutput() {
    return this.output;
  }

  public getSolutionOutput() {
    return this.solutionOutput;
  }

}

interface IJudgeError {
  errorMessage: string;
  error: any;
}
function JudgeError(args: IJudgeError) {
  return args;
}