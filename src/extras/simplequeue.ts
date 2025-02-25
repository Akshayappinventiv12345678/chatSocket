const EventEmitter = require('events');

class SimpleQueue extends EventEmitter {
    constructor() {
        super();
        this.queue = [];
    }

    enqueue(item) {
        this.queue.push(item);
        this.emit('data', item); // Notify subscribers
    }

    dequeue() {
        return this.queue.shift();
    }

    subscribe(callback) {
        this.on('data', callback);
    }
}

module.exports = new SimpleQueue();
