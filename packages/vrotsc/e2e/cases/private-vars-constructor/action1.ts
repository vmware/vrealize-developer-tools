export class Test {
	private v1: string = "10";
	private v2: string;

	constructor(v2: string,
		public v3: string,
		protected v4 = "40",
		private v5 = 30,
		private v6 = true,
		private v7 = null) {
		this.v2 = v2;
	}

	print() {
		System.log(this.v1);
		System.log(this.v2);
		System.log(this.v3);
		System.log(this.v4);
		System.log(this.v5.toString());
		System.log(this.v6 ? "true" : "false");
		System.log(this.v7);
	}
}
