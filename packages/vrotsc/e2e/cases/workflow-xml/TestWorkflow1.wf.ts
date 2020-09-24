import { Workflow, VroPolicyTemplateType } from "vrotsc-annotations";

let a: VroPolicyTemplateType;
interface UserLogin {
	id: number,
	name: string,
	password: SecureString,
}

@Workflow({
  name: "Test Workflow 1",
  path: "MyOrg/MyProject"
})
export class TestWorkflow1 {
  test1(foo: string, bar: string, logins: UserLogin[]): void {
    System.log(`foo=${foo}, bar=${bar}`);
    System.log(`logins=${JSON.stringify(logins)}`);
  }
}
