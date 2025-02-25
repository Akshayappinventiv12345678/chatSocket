declare const EventEmitter: any;
declare class SimpleQueue extends EventEmitter {
    static [x: string]: any;
    constructor();
    enqueue(item: any): void;
    dequeue(): any;
    subscribe(callback: any): void;
}
//# sourceMappingURL=simplequeue.d.ts.map