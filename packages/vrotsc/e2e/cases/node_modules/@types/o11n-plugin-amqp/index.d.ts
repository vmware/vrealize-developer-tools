/**
 * AMQP Broker
 */
declare interface AMQPBroker {
	readonly username: string;
	readonly virtualHost: string;
	readonly useSSL: boolean;
	readonly acceptAllCertificates: boolean;
	readonly name: string;
	readonly id: string;
	readonly host: string;
	readonly port: number;
	readonly displayName: string;
	/**
	 * Validate connection for this broker
	 */
	validate(): void;
	/**
	 * Subscribes to one or more queues.
	 * @param queues 
	 * @param props 
	 */
	subscribe(queues: string[], props: any): AMQPSubscription;
	/**
	 * Declares a new queue.
	 * @param name 
	 * @param props 
	 */
	declareQueue(name: string, props: any): void;
	/**
	 * Unbinds a queue from an exchange.
	 * @param queue 
	 * @param exchange 
	 * @param props 
	 */
	unbind(queue: string, exchange: string, props: any): void;
	/**
	 * Declares an exchange.
	 * @param exchange 
	 * @param props 
	 */
	declareExchange(exchange: string, props: any): void;
	/**
	 * Deletes a queue.
	 * @param queue 
	 */
	deleteQueue(queue: string): void;
	/**
	 * Receives a messages from a specified queue.
	 * @param queue 
	 */
	receive(queue: string): AMQPMessage;
	/**
	 * Sends a message to a specified destination and waits for the replay
	 * @param exchange 
	 * @param routingKey 
	 * @param requestMessage 
	 * @param timeoutSeconds 
	 */
	sendAndReceive(exchange: string, routingKey: string, requestMessage: AMQPMessage, timeoutSeconds: number): AMQPMessage;
	/**
	 * Receives a message asynchronously.
	 * @param queue 
	 * @param timeoutSeconds 
	 */
	receiveAsync(queue: string, timeoutSeconds: number): any;
	/**
	 * Receives a message asynchronously without interacting with the queue.
	 * @param exchange 
	 * @param routingKey 
	 * @param timeoutSeconds 
	 */
	declareQueueAndReceiveAsync(exchange: string, routingKey: string, timeoutSeconds: number): any;
	/**
	 * Sends a message.
	 * @param exchange 
	 * @param routingKey 
	 * @param message 
	 */
	send(exchange: string, routingKey: string, message: AMQPMessage): void;
	/**
	 * Deletes an exchange.
	 * @param exchange 
	 */
	deleteExchange(exchange: string): void;
	/**
	 * Retrieves a trigger properties
	 * @param trigger 
	 */
	retrieveMessage(trigger: any): AMQPMessage;
	/**
	 * Retrieves a trigger properties
	 * @param trigger 
	 */
	retrieveTriggerProperties(trigger: any): Properties;
	/**
	 * Removes this broker.
	 */
	remove(): void;
	/**
	 * Updates this broker properties.
	 * @param props 
	 */
	update(props: any): AMQPBroker;
	/**
	 * Bind a queue to an exchanges with specified properties.
	 * @param queue 
	 * @param exchange 
	 * @param props 
	 */
	bind(queue: string, exchange: string, props: any): void;
}

/**
 * AMQP Message
 */
declare class AMQPMessage {
	headers: Properties;
	body: any[];
	bodyAsText: string;
	properties: Properties;
	encoding: string;
	/**
	 * Constructs new message object
	 */
	constructor();
}

/**
 * AMQP Subscription
 */
declare interface AMQPSubscription {
	readonly queues: string[];
	readonly name: string;
	id: string;
	readonly displayName: string;
	/**
	 * Removes this subscription and deletes the associated queues.
	 */
	removeAndDeleteQueues(): void;
	/**
	 * Returns the last properties that triggered this subscription.
	 */
	retrieveLastOnMessageTrigger(): Properties;
	/**
	 * Constructs new message object from a policy trigger event.
	 * @param trigger 
	 */
	retrieveMessage(trigger: any): AMQPMessage;
	/**
	 * Removes this subscription
	 */
	remove(): void;
}

/**
 * Manager that enables AMQP broker creation and configuration reload.
 */
declare class AMQPBrokerManager {
	/**
	 * Creates a new broker.
	 * @param props 
	 */
	static addBroker(props: any): AMQPBroker;
}
