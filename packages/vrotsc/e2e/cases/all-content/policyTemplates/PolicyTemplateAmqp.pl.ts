import { PolicyTemplate } from "vrotsc-annotations";

@PolicyTemplate({
	name: "Policy Template Amqp",
	path: "MyOrg/MyProject",
	type: "AMQP:Subscription",
})
export class PolicyTemplateAmqp {
	onMessage(self: AMQPSubscription, event: any) {
		System.log("onMessage");
	}
}
