export interface IFormattedError {
  errorMessage: string;
  error: any;
}
export function FormattedError(args: IFormattedError) {
  return args;
}