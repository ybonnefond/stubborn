export class InvalidRemoveAfterMatchingTimesParameterError extends Error {
  constructor() {
    super('"times" parameter must be a positive integer greater that 0');
  }
}
