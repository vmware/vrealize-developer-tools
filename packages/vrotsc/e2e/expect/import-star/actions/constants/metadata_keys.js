/**
 * @return {Any}
 */
(function () {
    var exports = {};
    // Used for named bindings
    exports.NAMED_TAG = "named";
    // The name of the target at design time
    exports.NAME_TAG = "name";
    // The for unmanaged injections (in base classes when using inheritance)
    exports.UNMANAGED_TAG = "unmanaged";
    // The for optional injections
    exports.OPTIONAL_TAG = "optional";
    // The type of the binding at design time
    exports.INJECT_TAG = "inject";
    // The type of the binding at design type for multi-injections
    exports.MULTI_INJECT_TAG = "multi_inject";
    // used to store constructor arguments tags
    exports.TAGGED = "inversify:tagged";
    // used to store class properties tags
    exports.TAGGED_PROP = "inversify:tagged_props";
    // used to store types to be injected
    exports.PARAM_TYPES = "inversify:paramtypes";
    // used to access design time types
    exports.DESIGN_PARAM_TYPES = "design:paramtypes";
    // used to identify postConstruct functions
    exports.POST_CONSTRUCT = "post_construct";
    return exports;
});
