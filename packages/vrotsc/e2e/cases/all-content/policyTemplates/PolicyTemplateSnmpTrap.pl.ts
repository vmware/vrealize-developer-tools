import { PolicyTemplate } from "vrotsc-annotations";

@PolicyTemplate({
	name: "Policy Template SNMP Trap",
	path: "MyOrg/MyProject",
	type: "SNMP:SnmpDevice"
})
export class PolicyTemplateSnmpTrap {
	onTrap(self: SNMPSnmpDevice, event: any) {
		System.log("onTrap");
	}
}
