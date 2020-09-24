class Container {

    public async loadAsync(...modules: any[]) {

        const getHelpers = (id: string) => {};

        for (const currentModule of modules) {

            const containerModuleHelpers = getHelpers(currentModule.id);

            await currentModule.registry();

        }

    }
}

export { Container };
