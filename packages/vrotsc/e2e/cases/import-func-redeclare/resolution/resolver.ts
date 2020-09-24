
const _resolveRequest = (requestScope: any) =>
    (request: any): any => {

        return "result";
    }

function resolve<T>(context: any): T {
    const _f = _resolveRequest(context.plan.rootRequest.requestScope);
    return _f(context.plan.rootRequest);
}

export { resolve };
