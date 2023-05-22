export default function serializeSubmissionFunction(stringSubmission: string): string {

  return stringSubmission
    .split('console.log').join('this.addToOutput')
    .split('readline()').join('this.readline()');

}