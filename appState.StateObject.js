/// <reference path="appState.utils.js" />


(function(appState, $, undefined) {
	appState.StateObject = function(stateName) {
		if(typeof(stateName) !== "string" || !stateName){
			throw new Error("StateObject could not be initialized because the stateName was not a string or was empty.");
		}
		
		//------ Private Members
		var self = this;
		var parentState = stateName;
		var initQueue = [];
		var exitQueue = [];										
		
		//------ Public Members
		this.getStateName = function() { 
			return parentState;
		};

        var invokeQueue = function (list, data) {
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (typeof (item) === 'function') {
                    item(self, data);
                }
            }
        };
		//Called by State Monitor when the state is first changed to.
        this.stateEnter = function (data) {
			invokeQueue(initQueue, data);
		};
		
		//Called by State Monitor when the state is exited.
		//This can be called whether the change was graceful or not!
		this.stateExit = function() {
		    appState.utils.invokeQueue(exitQueue);
		};
		
		this.registerInitCallback = function(callback) {
		    appState.utils.registerCallback(initQueue, callback);
		};
		
		this.registerExitCallback = function(callback) {
		    appState.utils.registerCallback(exitQueue, callback);
		};
		
		this.deregisterInitCallback = function(callback) {
		    appState.utils.deregisterCallback(initQueue, callback);
		};
		
		this.deregisterExitCallback = function(callback) {
		    appState.utils.deregisterCallback(exitQueue, callback);
		};
				
	};
}(window.appState = window.appState || {}));


/* Samples
var sampleState = new appState.StateObject("sample");
var hiCallback = function(state) { alert("hi from " + state.getStateName() + "!");};
var echoLine = function(message) {
  document.write(message + "<br/>");
};
    
sampleState.registerInitCallback(hiCallback);
sampleState.init();

echoLine("sampleState.getStateName():");
echoLine(sampleState.getStateName());

sampleState.deregisterInitCallback(hiCallback);
sampleState.init();

echoLine("sampleState.canChangeToState('bad!')");
if(sampleState.canChangeToState("bad!")){
  echoLine("Let's do it!");  
}
else {
  echoLine("No Way!");
}
   

(function(dude, undefined) {
  var baseState = new appState.StateObject("dudeState");
  
  var stateObj = function() {
      this.customProperty = "yo!";
    this.canChangeToState = function(state) {
      if(state !== "broState") {
        return false;
      }
       
      return true;
    };
  };
  stateObj.prototype = baseState;
  
  dude.dudeState = new stateObj();
  
}(window.dude = window.dude || {}));

dude.dudeState.registerInitCallback(hiCallback);
dude.dudeState.init();

echoLine("<strong>dude.dudeState.getStateName():</strong>");
echoLine(dude.dudeState.getStateName());

dude.dudeState.deregisterInitCallback(hiCallback);
dude.dudeState.init();

echoLine("<strong>dude.dudeState.canChangeToState('bad!')</strong>");
if(dude.dudeState.canChangeToState("bad!")){
  echoLine("Let's do it!");  
}
else {
  echoLine("No Way!");
}

echoLine("<strong>dude.dudeState.canChangeToState('broState')</strong>");
if(dude.dudeState.canChangeToState("broState")){
  echoLine("Let's do it!");  
}
else {
  echoLine("No Way!");
}
*/