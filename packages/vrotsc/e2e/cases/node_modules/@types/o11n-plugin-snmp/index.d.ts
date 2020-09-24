/**
 * SNMP Device
 */
declare interface SNMPSnmpDevice {
	credentials: string;
	queries: SNMPSnmpQuery[];
	address: string;
	name: string;
	port: number;
	readonly displayName: string;
	version: string;
	/**
	 * @param oid 
	 * @param number 
	 */
	getBulk(oid: string, number: number): SNMPSnmpResult;
	/**
	 * @param port 
	 */
	validateAnsSetPort(port: number): void;
	/**
	 * @param address 
	 */
	validateAndSetAddress(address: string): void;
	/**
	 * @param name 
	 */
	validateAndSetName(name: string): void;
	/**
	 * @param oid 
	 */
	get(oid: string): SNMPSnmpResult;
	/**
	 * @param oid 
	 */
	getNext(oid: string): SNMPSnmpResult;
}

/**
 * SNMP Query
 */
declare interface SNMPSnmpQuery {
	oid: string;
	name: string;
	type: string;
	displayName: string;
	/**
	 * @param type 
	 */
	validateAndSetType(type: string): void;
	/**
	 * @param oid 
	 */
	validateAndSetOid(oid: string): void;
	/**
	 * @param name 
	 */
	validateAndSetName(name: string): void;
}

/**
 * SNMP Query Result
 */
declare interface SNMPSnmpResult {
	type: string;
	oid: string;
	enterprise: string;
	stringValue: string;
	numberValue: any;
	arrayValue: any[];
	snmpType: string;
}

/**
 * SNMP Trap Host
 */
declare class SNMPTrapHost {
	static port: number;
	static readonly displayName: string;
	/**
	 * @param port 
	 */
	static changePort(port: number): void;
	static start(): void;
	static stop(): void;
}

/**
 * SNMP Service
 */
declare class SnmpService {
	/**
	 * @param query 
	 */
	static removeQuery(query: SNMPSnmpQuery): SNMPSnmpDevice;
	/**
	 * @param device 
	 * @param oid 
	 */
	static snmpGet(device: SNMPSnmpDevice, oid: string): SNMPSnmpResult;
	/**
	 * @param device 
	 * @param oid 
	 */
	static snmpGetNext(device: SNMPSnmpDevice, oid: string): SNMPSnmpResult;
	/**
	 * @param device 
	 * @param oid 
	 * @param number 
	 */
	static snmpGetBulk(device: SNMPSnmpDevice, oid: string, number: number): SNMPSnmpResult;
	/**
	 * @param device 
	 * @param query 
	 */
	static addQuery(device: SNMPSnmpDevice, query: SNMPSnmpQuery): SNMPSnmpQuery;
	/**
	 * @param query 
	 * @param type 
	 * @param oid 
	 * @param name 
	 */
	static updateQuery(query: SNMPSnmpQuery, type: string, oid: string, name: string): SNMPSnmpQuery;
	/**
	 * @param query 
	 */
	static runQuery(query: SNMPSnmpQuery): SNMPSnmpResult;
	/**
	 * @param address 
	 * @param port 
	 * @param enterprise 
	 * @param type 
	 * @param oid 
	 * @param value 
	 */
	static sendTrap(address: string, port: number, enterprise: string, type: string, oid: string, value: string): void;
	/**
	 * @param address 
	 * @param name 
	 * @param port 
	 * @param community 
	 * @param version 
	 */
	static createSnmpDeviceV1V2c(address: string, name: string, port: number, community: string, version: string): SNMPSnmpDevice;
	/**
	 * @param address 
	 * @param name 
	 * @param port 
	 * @param user 
	 * @param password 
	 */
	static createSnmpDeviceV3(address: string, name: string, port: number, user: string, password: string): SNMPSnmpDevice;
	/**
	 * @param device 
	 * @param address 
	 * @param name 
	 * @param port 
	 * @param community 
	 * @param user 
	 * @param password 
	 * @param version 
	 */
	static editSnmpDevice(device: SNMPSnmpDevice, address: string, name: string, port: number, community: string, user: string, password: string, version: string): SNMPSnmpDevice;
	/**
	 * @param device 
	 */
	static removeSnmpDevice(device: SNMPSnmpDevice): SNMPSnmpDevice;
	/**
	 * @param oid 
	 */
	static createTriggerForAllDevices(oid: string): any;
	/**
	 * @param device 
	 * @param oid 
	 */
	static createTrigger(device: SNMPSnmpDevice, oid: string): any;
	/**
	 * @param trigger 
	 */
	static retrieveTriggerData(trigger: any): SNMPSnmpResult;
	/**
	 * @param key 
	 */
	static retrievePolicyData(key: string): SNMPSnmpResult;
}
