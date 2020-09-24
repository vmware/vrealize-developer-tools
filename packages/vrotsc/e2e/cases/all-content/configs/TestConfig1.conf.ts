import { Configuration } from "vrotsc-annotations";

@Configuration({
	name: "Test Config 1",
	path: "MyOrg/MyProject",
})
export class TestConfig1 {
	strField: string = "test";
	strField2 = "test";
	numField = 5;
	boolField = true;
}
