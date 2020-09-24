export class TestClass1 {
	private field1: string;
	private static staticField1: string;

	public get prop1(): string {
		return this.field1;
	}

	public set prop1(value: string) {
		this.field1 = value;
	}

	public get prop2(): string {
		return "prop2";
	}

	public set prop3(value: string) {
	}

	public static get static_prop1(): string {
		return this.staticField1;
	}

	public static set static_prop1(value: string) {
		this.staticField1 = value;
	}

	public static get static_prop2(): string {
		return "prop2";
	}

	public static set static_prop3(value: string) {
	}
}
