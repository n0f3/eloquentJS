
//Retry
function MultiplicatorUnitFailure(message) {
	this.message = message;
	this.stack = (new Error()).stack;
}

MultiplicatorUnitFailure.prototype = new Error();

function primitiveMultiply(a,b) {
	if(Math.random() < 0.5) {
		return a*b;
	} else {
		throw new MultiplicatorUnitFailure("Multiplication failed");
	}
}

function reliableMultiply(a,b) {
	for(;;) {
		try {
			return primitiveMultiply(a,b);
		} catch(e) {
			if(!(e instanceof MultiplicatorUnitFailure)) {
				throw e;
			}
		}
	}
}

console.log(reliableMultiply(8,8));


//The locked box
var box = {
	locked: true,
	unlock: function() { this.locked = false; },
	lock: function() { this.locked = true; },
	_content: [],
	get content() {
		if(this.locked) {
			throw new Error("Locked!");
		}
		return this._content;
	}
};

function withBoxUnlocked(body) {
	if(!box.locked) {
		// No reason to unlock, can just return.
		return body();
	}
	box.unlock();
	try {
		return body();
	} catch(e) {
		console.log("Error raise: ", e);
	} finally {
		box.lock();
	}
}

withBoxUnlocked(function() {
	box.content.push("gold piece");
});

try {
	withBoxUnlocked(function() {
		throw new Error("Pirates on the horizon! Abort!");
	});
} catch(e) {
	console.log("Error raise:", e);
}
console.log(box.locked);