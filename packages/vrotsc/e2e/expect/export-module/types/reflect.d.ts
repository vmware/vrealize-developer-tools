declare namespace MyNamespace {
    interface BufferLike {
        [offset: number]: number;
        length: number;
    }
    type MemberDecorator = void;
    function decorate(decorators: ClassDecorator[], target: Function): void;
    const hasOwn = "val1";
    class Mirror {
        reflect(params: number): void;
    }
}
