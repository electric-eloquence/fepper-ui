global.history = {
  _stateStack: [],
  state: {},
  pushState: (stateObj) => {
    global.history._stateStack.push(stateObj);
    global.history.state = stateObj;
  },
  replaceState: (stateObj) => {
    global.history._stateStack.pop();
    global.history._stateStack.push(stateObj);
    global.history.state = stateObj;
  }
};
