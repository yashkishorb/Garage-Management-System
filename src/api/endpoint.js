// Some backend routes are not confirmed yet (see BACKEND_REQUIREMENTS.md).
// Their constants are `null`; calling code goes through requireEndpoint() so
// the UI gets an honest, user-displayable error instead of a fake success or a
// request to a guessed URL.
export class EndpointNotConfiguredError extends Error {
  constructor(name) {
    super(`Endpoint not configured: ${name}`);
    this.name = "EndpointNotConfiguredError";
    this.code = "ENDPOINT_NOT_CONFIGURED";
    this.displayMessage =
      "This feature isn't available yet — the server endpoint hasn't been configured.";
  }
}

export const requireEndpoint = (path, name) => {
  if (!path) throw new EndpointNotConfiguredError(name);
  return path;
};
