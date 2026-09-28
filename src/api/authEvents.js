// Lets the Axios layer (which must not import the Redux store → circular
// dependency) tell the app that the session is no longer valid.
let unauthorizedHandler = null;

export const setUnauthorizedHandler = (fn) => {
  unauthorizedHandler = fn;
};

export const emitUnauthorized = () => {
  if (typeof unauthorizedHandler === "function") unauthorizedHandler();
};
