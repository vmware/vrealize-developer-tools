export declare function ClassDecorator(target: any): any;
export declare function ClassDecorator2(param1: string): (target: any) => any;
export declare function FieldDecorator(param1: number): (target: Object, propertyName: string) => void;
export declare function StaticFieldDecorator(target: Object, propertyName: string): void;
export declare function MethodDecorator(param1: string): (target: Object, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor;
export declare function StaticMethodDecorator(target: any, propertyName: string): any;
declare function inject(): (target: any, targetKey: string, index?: number | undefined) => void;
export { inject };
