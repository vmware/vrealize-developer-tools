namespace MyNamespace {
	export interface BufferLike {
		[offset: number]: number;
		length: number;
	}
	interface BufferLike2 {}

	export type MemberDecorator = void;
	type MemberDecorator2 = void;

	export function decorate(decorators: ClassDecorator[], target: Function) {}
	function decorate2(decorators: ClassDecorator[], target: Function) {}

	export const hasOwn = "val1";
	const hasOwn2 = "val2";

	export class Mirror {
		reflect(params: number) {}
	}
	class Mirror2 {
		reflect(params: number) {}
	}
}
