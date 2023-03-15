export class EnvironmentError extends Error {
  public errorType = 'EnvironmentError';

  constructor(envVar: string) {
    super(`Invalid/Missing environment variable: "${envVar}"`);
  }
}
