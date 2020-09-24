export function ClassDecorator(target: any) {
	return target;
}

export function ClassDecorator2(param1: string) {
	return function ClassDecorator(target: any) {
		return target;
	}
}

export function FieldDecorator(param1: number) {
	return function (target: Object, propertyName: string) {
	}
}

export function StaticFieldDecorator(target: Object, propertyName: string) {
	Object.getOwnPropertyDescriptor(target, propertyName);
}

export function MethodDecorator(param1: string) {
	return function (target: Object, propertyName: string, propertyDesciptor: PropertyDescriptor) {
		return propertyDesciptor || Object.getOwnPropertyDescriptor(target, propertyName);
	}
}

export function StaticMethodDecorator(target: any, propertyName: string) {
	return target[propertyName];
}


declare function inject(): (target: any, targetKey: string, index?: number | undefined) => void;
export { inject };
