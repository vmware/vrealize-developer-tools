import { PolicyTemplate } from "vrotsc-annotations";

@PolicyTemplate({
	name: "Policy Template SNMP Trap All",
	path: "MyOrg/MyProject",
	type: "SNMP:TrapHost"
})
export class PolicyTemplateSnmpTrapAll {
	onTrapAll(self: SNMPTrapHost, event: any) {
		System.log("onTrapAll");
	}
}
