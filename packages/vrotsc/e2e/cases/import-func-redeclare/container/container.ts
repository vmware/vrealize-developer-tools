import { resolve } from "../resolution/resolver";

class Container {

    public resolve<T>(constructorFunction: any) {
    }

    // Planner creates a plan and Resolver resolves a plan
    // one of the jobs of the Container is to links the Planner
    // with the Resolver and that is what this function is about
    private _planAndResolve<T>(): (args: any) => (T | T[]) {
        return (args: any) => {
            // resolve plan
            const result = resolve<T>({});
            return result;

        };
    }

}

export { Container };
