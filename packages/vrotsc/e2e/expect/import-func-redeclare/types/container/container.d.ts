declare class Container {
    resolve<T>(constructorFunction: any): void;
    private _planAndResolve;
}
export { Container };
