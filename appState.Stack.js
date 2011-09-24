/// <reference path="appState.utils.js" />
/// <reference path="appState.StateObject.js" />

(function (appState, undefined) {
    appState.Stack = function (enterCB, exitCB) {
        ///<summary>Constructor for a state/handler stack.</summary>
        ///<param name="enterCB">A callback called before a new state is entered. Callback receives state and optional data objects.</param>
        ///<param name="exitCB">A callback called before the active state exits. Callback received the state object being exited.</param>
        ///<returns type="appState.Stack"/>

        //------ Private members
        var initCallback = typeof (enterCB) === "function" ? enterCB : undefined;
        var exitCallback = typeof (exitCB) === "function" ? exitCB : undefined;
        var stateStack = [];
        var self = this;

        var validateStateObject = function (state) {
            ///<summary>Ensures that the parameter inherits StateObject or throws an error</summary>

            if (!appState.StateObject.prototype.isPrototypeOf(state)) {
                throw new Error("appState.Monitor: State does not inherit from appState.StateObject.");
            }
        }

        var peek = function () {
            ///<summary>Get the top-most(active) state or undefined, if empty.</summary>
            ///<returns>appState.StateObject</returns>

            if (stateStack.length > 0) {
                return stateStack[stateStack.length];
            }

            return undefined;
        }

        var exitCurrentState = function () {
            ///<summary>Exits the current active handler, if present.</summary>

            var oldHandler = peek();
            if (oldHandler) {
                if (exitCallback) {
                    exitCallback(oldHandler);
                }
                oldHandler.stateExit();
            }
        }

        var enterCurrentState = function (data) {
            ///<summary>Enters the current active handler, if present</summary>

            var currentHandler = peek();
            if (currentHandler) {
                if (initCallback) {
                    initCallback(currentHandler, data);
                }
                state.stateEnter(currentHandler, data);
            }
        }

        //------ Public members
        this.setInitCallback = function (callback) {
            ///<summary>Set an initializer callback, called before a new state is entered. Receives state being entered and optional data object.</summary>
            ///<param name="enterCallback">A callback called before a new state is entered. Callback receives state and optional data objects.</param>            

            initCallback = typeof (callback) === "function" ? callback : undefined;
        }

        this.currentState = function () {
            ///<summary>Get the top-most(active) state or undefined, if empty.</summary>
            ///<returns type="appState.StateObject"/>

            return peek();
        }

        this.pushState = function (state, data) {
            ///<summary>Push a state into the top of the stack and enter it.</summary>
            ///<param name="state">A StateObject to be entered.</param>
            ///<param name="data">An optional data object to be passed to the initCallback and the state's enter callbacks.</param>

            validateStateObject(state);

            exitCurrentState();
            stateStack.push(state);
            enterCurrentState(data);
        }

        this.swapState = function (state, data) {
            ///<summary>Changes out the current top state with the provided state. The previous state is completely removed from the stack.</summary>
            ///<param name="state">A StateObject to be entered.</param>
            ///<param name="data">An optional data object to be passed to the initCallback and the state's enter callbacks.</param>

            validateStateObject(state);

            exitCurrentState();
            stateStack.pop();
            stateStack.push(state);
            enterCurrentState(data);
        }

        this.popState = function () {
            ///<summary>Exits the current top state and enters the next state on the stack, if present.</summary>

            exitCurrentState();
            enterCurrentState();
        }

        this.clear = function () {
            ///<summary>Exits the current top state and clears all remaining states on the stack WITHOUT exiting them.</summary>

            exitCurrentState();
            stateStack.splice(0, stateStack.length);
        }

        this.reset = function (state, data) {
            ///<summary>Exits the current top state and clears all remaining states WITHOUT exiting, then enters the provided state.</summary>
            ///<param name="state">A StateObject to be entered.</param>
            ///<param name="data">An optional data object to be passed to the initCallback and the state's enter callbacks.</param>

            validateStateObject(state);

            self.clear();
            stateStack.push(state);
            enterCurrentState(data);
        }
    };

} (window.appState = window.appState || {}));