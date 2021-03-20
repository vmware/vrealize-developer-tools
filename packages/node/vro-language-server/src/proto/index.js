/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.vmw = (function() {

    /**
     * Namespace vmw.
     * @exports vmw
     * @namespace
     */
    var vmw = {};

    vmw.pscoe = (function() {

        /**
         * Namespace pscoe.
         * @memberof vmw
         * @namespace
         */
        var pscoe = {};

        pscoe.hints = (function() {

            /**
             * Namespace hints.
             * @memberof vmw.pscoe
             * @namespace
             */
            var hints = {};

            hints.ActionsPack = (function() {

                /**
                 * Properties of an ActionsPack.
                 * @memberof vmw.pscoe.hints
                 * @interface IActionsPack
                 * @property {number|null} [version] ActionsPack version
                 * @property {string|null} [uuid] ActionsPack uuid
                 * @property {vmw.pscoe.hints.ActionsPack.IMetadata|null} [metadata] ActionsPack metadata
                 * @property {Array.<vmw.pscoe.hints.IModule>|null} [modules] ActionsPack modules
                 */

                /**
                 * Constructs a new ActionsPack.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents an ActionsPack.
                 * @implements IActionsPack
                 * @constructor
                 * @param {vmw.pscoe.hints.IActionsPack=} [properties] Properties to set
                 */
                function ActionsPack(properties) {
                    this.modules = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ActionsPack version.
                 * @member {number} version
                 * @memberof vmw.pscoe.hints.ActionsPack
                 * @instance
                 */
                ActionsPack.prototype.version = 0;

                /**
                 * ActionsPack uuid.
                 * @member {string} uuid
                 * @memberof vmw.pscoe.hints.ActionsPack
                 * @instance
                 */
                ActionsPack.prototype.uuid = "";

                /**
                 * ActionsPack metadata.
                 * @member {vmw.pscoe.hints.ActionsPack.IMetadata|null|undefined} metadata
                 * @memberof vmw.pscoe.hints.ActionsPack
                 * @instance
                 */
                ActionsPack.prototype.metadata = null;

                /**
                 * ActionsPack modules.
                 * @member {Array.<vmw.pscoe.hints.IModule>} modules
                 * @memberof vmw.pscoe.hints.ActionsPack
                 * @instance
                 */
                ActionsPack.prototype.modules = $util.emptyArray;

                /**
                 * Creates a new ActionsPack instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.ActionsPack
                 * @static
                 * @param {vmw.pscoe.hints.IActionsPack=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.ActionsPack} ActionsPack instance
                 */
                ActionsPack.create = function create(properties) {
                    return new ActionsPack(properties);
                };

                /**
                 * Encodes the specified ActionsPack message. Does not implicitly {@link vmw.pscoe.hints.ActionsPack.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.ActionsPack
                 * @static
                 * @param {vmw.pscoe.hints.IActionsPack} message ActionsPack message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ActionsPack.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.version);
                    if (message.uuid != null && Object.hasOwnProperty.call(message, "uuid"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.uuid);
                    if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                        $root.vmw.pscoe.hints.ActionsPack.Metadata.encode(message.metadata, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    if (message.modules != null && message.modules.length)
                        for (var i = 0; i < message.modules.length; ++i)
                            $root.vmw.pscoe.hints.Module.encode(message.modules[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified ActionsPack message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ActionsPack.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.ActionsPack
                 * @static
                 * @param {vmw.pscoe.hints.IActionsPack} message ActionsPack message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ActionsPack.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an ActionsPack message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.ActionsPack
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.ActionsPack} ActionsPack
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ActionsPack.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.ActionsPack();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.version = reader.uint32();
                            break;
                        case 2:
                            message.uuid = reader.string();
                            break;
                        case 3:
                            message.metadata = $root.vmw.pscoe.hints.ActionsPack.Metadata.decode(reader, reader.uint32());
                            break;
                        case 4:
                            if (!(message.modules && message.modules.length))
                                message.modules = [];
                            message.modules.push($root.vmw.pscoe.hints.Module.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an ActionsPack message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.ActionsPack
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.ActionsPack} ActionsPack
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ActionsPack.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an ActionsPack message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.ActionsPack
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ActionsPack.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.version != null && message.hasOwnProperty("version"))
                        if (!$util.isInteger(message.version))
                            return "version: integer expected";
                    if (message.uuid != null && message.hasOwnProperty("uuid"))
                        if (!$util.isString(message.uuid))
                            return "uuid: string expected";
                    if (message.metadata != null && message.hasOwnProperty("metadata")) {
                        var error = $root.vmw.pscoe.hints.ActionsPack.Metadata.verify(message.metadata);
                        if (error)
                            return "metadata." + error;
                    }
                    if (message.modules != null && message.hasOwnProperty("modules")) {
                        if (!Array.isArray(message.modules))
                            return "modules: array expected";
                        for (var i = 0; i < message.modules.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Module.verify(message.modules[i]);
                            if (error)
                                return "modules." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates an ActionsPack message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.ActionsPack
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.ActionsPack} ActionsPack
                 */
                ActionsPack.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.ActionsPack)
                        return object;
                    var message = new $root.vmw.pscoe.hints.ActionsPack();
                    if (object.version != null)
                        message.version = object.version >>> 0;
                    if (object.uuid != null)
                        message.uuid = String(object.uuid);
                    if (object.metadata != null) {
                        if (typeof object.metadata !== "object")
                            throw TypeError(".vmw.pscoe.hints.ActionsPack.metadata: object expected");
                        message.metadata = $root.vmw.pscoe.hints.ActionsPack.Metadata.fromObject(object.metadata);
                    }
                    if (object.modules) {
                        if (!Array.isArray(object.modules))
                            throw TypeError(".vmw.pscoe.hints.ActionsPack.modules: array expected");
                        message.modules = [];
                        for (var i = 0; i < object.modules.length; ++i) {
                            if (typeof object.modules[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.ActionsPack.modules: object expected");
                            message.modules[i] = $root.vmw.pscoe.hints.Module.fromObject(object.modules[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from an ActionsPack message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.ActionsPack
                 * @static
                 * @param {vmw.pscoe.hints.ActionsPack} message ActionsPack
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ActionsPack.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.modules = [];
                    if (options.defaults) {
                        object.version = 0;
                        object.uuid = "";
                        object.metadata = null;
                    }
                    if (message.version != null && message.hasOwnProperty("version"))
                        object.version = message.version;
                    if (message.uuid != null && message.hasOwnProperty("uuid"))
                        object.uuid = message.uuid;
                    if (message.metadata != null && message.hasOwnProperty("metadata"))
                        object.metadata = $root.vmw.pscoe.hints.ActionsPack.Metadata.toObject(message.metadata, options);
                    if (message.modules && message.modules.length) {
                        object.modules = [];
                        for (var j = 0; j < message.modules.length; ++j)
                            object.modules[j] = $root.vmw.pscoe.hints.Module.toObject(message.modules[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this ActionsPack to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.ActionsPack
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ActionsPack.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                ActionsPack.Metadata = (function() {

                    /**
                     * Properties of a Metadata.
                     * @memberof vmw.pscoe.hints.ActionsPack
                     * @interface IMetadata
                     * @property {number|Long|null} [timestamp] Metadata timestamp
                     * @property {string|null} [serverName] Metadata serverName
                     * @property {string|null} [serverVersion] Metadata serverVersion
                     * @property {string|null} [hintingVersion] Metadata hintingVersion
                     */

                    /**
                     * Constructs a new Metadata.
                     * @memberof vmw.pscoe.hints.ActionsPack
                     * @classdesc Represents a Metadata.
                     * @implements IMetadata
                     * @constructor
                     * @param {vmw.pscoe.hints.ActionsPack.IMetadata=} [properties] Properties to set
                     */
                    function Metadata(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Metadata timestamp.
                     * @member {number|Long} timestamp
                     * @memberof vmw.pscoe.hints.ActionsPack.Metadata
                     * @instance
                     */
                    Metadata.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * Metadata serverName.
                     * @member {string} serverName
                     * @memberof vmw.pscoe.hints.ActionsPack.Metadata
                     * @instance
                     */
                    Metadata.prototype.serverName = "";

                    /**
                     * Metadata serverVersion.
                     * @member {string} serverVersion
                     * @memberof vmw.pscoe.hints.ActionsPack.Metadata
                     * @instance
                     */
                    Metadata.prototype.serverVersion = "";

                    /**
                     * Metadata hintingVersion.
                     * @member {string} hintingVersion
                     * @memberof vmw.pscoe.hints.ActionsPack.Metadata
                     * @instance
                     */
                    Metadata.prototype.hintingVersion = "";

                    /**
                     * Creates a new Metadata instance using the specified properties.
                     * @function create
                     * @memberof vmw.pscoe.hints.ActionsPack.Metadata
                     * @static
                     * @param {vmw.pscoe.hints.ActionsPack.IMetadata=} [properties] Properties to set
                     * @returns {vmw.pscoe.hints.ActionsPack.Metadata} Metadata instance
                     */
                    Metadata.create = function create(properties) {
                        return new Metadata(properties);
                    };

                    /**
                     * Encodes the specified Metadata message. Does not implicitly {@link vmw.pscoe.hints.ActionsPack.Metadata.verify|verify} messages.
                     * @function encode
                     * @memberof vmw.pscoe.hints.ActionsPack.Metadata
                     * @static
                     * @param {vmw.pscoe.hints.ActionsPack.IMetadata} message Metadata message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Metadata.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.timestamp);
                        if (message.serverName != null && Object.hasOwnProperty.call(message, "serverName"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.serverName);
                        if (message.serverVersion != null && Object.hasOwnProperty.call(message, "serverVersion"))
                            writer.uint32(/* id 3, wireType 2 =*/26).string(message.serverVersion);
                        if (message.hintingVersion != null && Object.hasOwnProperty.call(message, "hintingVersion"))
                            writer.uint32(/* id 4, wireType 2 =*/34).string(message.hintingVersion);
                        return writer;
                    };

                    /**
                     * Encodes the specified Metadata message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ActionsPack.Metadata.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof vmw.pscoe.hints.ActionsPack.Metadata
                     * @static
                     * @param {vmw.pscoe.hints.ActionsPack.IMetadata} message Metadata message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Metadata.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Metadata message from the specified reader or buffer.
                     * @function decode
                     * @memberof vmw.pscoe.hints.ActionsPack.Metadata
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {vmw.pscoe.hints.ActionsPack.Metadata} Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Metadata.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.ActionsPack.Metadata();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.timestamp = reader.int64();
                                break;
                            case 2:
                                message.serverName = reader.string();
                                break;
                            case 3:
                                message.serverVersion = reader.string();
                                break;
                            case 4:
                                message.hintingVersion = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a Metadata message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof vmw.pscoe.hints.ActionsPack.Metadata
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {vmw.pscoe.hints.ActionsPack.Metadata} Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Metadata.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Metadata message.
                     * @function verify
                     * @memberof vmw.pscoe.hints.ActionsPack.Metadata
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Metadata.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                                return "timestamp: integer|Long expected";
                        if (message.serverName != null && message.hasOwnProperty("serverName"))
                            if (!$util.isString(message.serverName))
                                return "serverName: string expected";
                        if (message.serverVersion != null && message.hasOwnProperty("serverVersion"))
                            if (!$util.isString(message.serverVersion))
                                return "serverVersion: string expected";
                        if (message.hintingVersion != null && message.hasOwnProperty("hintingVersion"))
                            if (!$util.isString(message.hintingVersion))
                                return "hintingVersion: string expected";
                        return null;
                    };

                    /**
                     * Creates a Metadata message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof vmw.pscoe.hints.ActionsPack.Metadata
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {vmw.pscoe.hints.ActionsPack.Metadata} Metadata
                     */
                    Metadata.fromObject = function fromObject(object) {
                        if (object instanceof $root.vmw.pscoe.hints.ActionsPack.Metadata)
                            return object;
                        var message = new $root.vmw.pscoe.hints.ActionsPack.Metadata();
                        if (object.timestamp != null)
                            if ($util.Long)
                                (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                            else if (typeof object.timestamp === "string")
                                message.timestamp = parseInt(object.timestamp, 10);
                            else if (typeof object.timestamp === "number")
                                message.timestamp = object.timestamp;
                            else if (typeof object.timestamp === "object")
                                message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
                        if (object.serverName != null)
                            message.serverName = String(object.serverName);
                        if (object.serverVersion != null)
                            message.serverVersion = String(object.serverVersion);
                        if (object.hintingVersion != null)
                            message.hintingVersion = String(object.hintingVersion);
                        return message;
                    };

                    /**
                     * Creates a plain object from a Metadata message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof vmw.pscoe.hints.ActionsPack.Metadata
                     * @static
                     * @param {vmw.pscoe.hints.ActionsPack.Metadata} message Metadata
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Metadata.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.timestamp = options.longs === String ? "0" : 0;
                            object.serverName = "";
                            object.serverVersion = "";
                            object.hintingVersion = "";
                        }
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (typeof message.timestamp === "number")
                                object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                            else
                                object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
                        if (message.serverName != null && message.hasOwnProperty("serverName"))
                            object.serverName = message.serverName;
                        if (message.serverVersion != null && message.hasOwnProperty("serverVersion"))
                            object.serverVersion = message.serverVersion;
                        if (message.hintingVersion != null && message.hasOwnProperty("hintingVersion"))
                            object.hintingVersion = message.hintingVersion;
                        return object;
                    };

                    /**
                     * Converts this Metadata to JSON.
                     * @function toJSON
                     * @memberof vmw.pscoe.hints.ActionsPack.Metadata
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Metadata.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Metadata;
                })();

                return ActionsPack;
            })();

            hints.Module = (function() {

                /**
                 * Properties of a Module.
                 * @memberof vmw.pscoe.hints
                 * @interface IModule
                 * @property {string|null} [name] Module name
                 * @property {Array.<vmw.pscoe.hints.IAction>|null} [actions] Module actions
                 */

                /**
                 * Constructs a new Module.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents a Module.
                 * @implements IModule
                 * @constructor
                 * @param {vmw.pscoe.hints.IModule=} [properties] Properties to set
                 */
                function Module(properties) {
                    this.actions = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Module name.
                 * @member {string} name
                 * @memberof vmw.pscoe.hints.Module
                 * @instance
                 */
                Module.prototype.name = "";

                /**
                 * Module actions.
                 * @member {Array.<vmw.pscoe.hints.IAction>} actions
                 * @memberof vmw.pscoe.hints.Module
                 * @instance
                 */
                Module.prototype.actions = $util.emptyArray;

                /**
                 * Creates a new Module instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.Module
                 * @static
                 * @param {vmw.pscoe.hints.IModule=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.Module} Module instance
                 */
                Module.create = function create(properties) {
                    return new Module(properties);
                };

                /**
                 * Encodes the specified Module message. Does not implicitly {@link vmw.pscoe.hints.Module.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.Module
                 * @static
                 * @param {vmw.pscoe.hints.IModule} message Module message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Module.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.actions != null && message.actions.length)
                        for (var i = 0; i < message.actions.length; ++i)
                            $root.vmw.pscoe.hints.Action.encode(message.actions[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Module message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Module.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.Module
                 * @static
                 * @param {vmw.pscoe.hints.IModule} message Module message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Module.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Module message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.Module
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.Module} Module
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Module.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.Module();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            if (!(message.actions && message.actions.length))
                                message.actions = [];
                            message.actions.push($root.vmw.pscoe.hints.Action.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Module message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.Module
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.Module} Module
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Module.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Module message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.Module
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Module.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.actions != null && message.hasOwnProperty("actions")) {
                        if (!Array.isArray(message.actions))
                            return "actions: array expected";
                        for (var i = 0; i < message.actions.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Action.verify(message.actions[i]);
                            if (error)
                                return "actions." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a Module message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.Module
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.Module} Module
                 */
                Module.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.Module)
                        return object;
                    var message = new $root.vmw.pscoe.hints.Module();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.actions) {
                        if (!Array.isArray(object.actions))
                            throw TypeError(".vmw.pscoe.hints.Module.actions: array expected");
                        message.actions = [];
                        for (var i = 0; i < object.actions.length; ++i) {
                            if (typeof object.actions[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.Module.actions: object expected");
                            message.actions[i] = $root.vmw.pscoe.hints.Action.fromObject(object.actions[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Module message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.Module
                 * @static
                 * @param {vmw.pscoe.hints.Module} message Module
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Module.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.actions = [];
                    if (options.defaults)
                        object.name = "";
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.actions && message.actions.length) {
                        object.actions = [];
                        for (var j = 0; j < message.actions.length; ++j)
                            object.actions[j] = $root.vmw.pscoe.hints.Action.toObject(message.actions[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this Module to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.Module
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Module.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Module;
            })();

            hints.Action = (function() {

                /**
                 * Properties of an Action.
                 * @memberof vmw.pscoe.hints
                 * @interface IAction
                 * @property {string|null} [name] Action name
                 * @property {string|null} [version] Action version
                 * @property {string|null} [description] Action description
                 * @property {string|null} [returnType] Action returnType
                 * @property {Array.<vmw.pscoe.hints.Action.IParameter>|null} [parameters] Action parameters
                 */

                /**
                 * Constructs a new Action.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents an Action.
                 * @implements IAction
                 * @constructor
                 * @param {vmw.pscoe.hints.IAction=} [properties] Properties to set
                 */
                function Action(properties) {
                    this.parameters = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Action name.
                 * @member {string} name
                 * @memberof vmw.pscoe.hints.Action
                 * @instance
                 */
                Action.prototype.name = "";

                /**
                 * Action version.
                 * @member {string} version
                 * @memberof vmw.pscoe.hints.Action
                 * @instance
                 */
                Action.prototype.version = "";

                /**
                 * Action description.
                 * @member {string} description
                 * @memberof vmw.pscoe.hints.Action
                 * @instance
                 */
                Action.prototype.description = "";

                /**
                 * Action returnType.
                 * @member {string} returnType
                 * @memberof vmw.pscoe.hints.Action
                 * @instance
                 */
                Action.prototype.returnType = "";

                /**
                 * Action parameters.
                 * @member {Array.<vmw.pscoe.hints.Action.IParameter>} parameters
                 * @memberof vmw.pscoe.hints.Action
                 * @instance
                 */
                Action.prototype.parameters = $util.emptyArray;

                /**
                 * Creates a new Action instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.Action
                 * @static
                 * @param {vmw.pscoe.hints.IAction=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.Action} Action instance
                 */
                Action.create = function create(properties) {
                    return new Action(properties);
                };

                /**
                 * Encodes the specified Action message. Does not implicitly {@link vmw.pscoe.hints.Action.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.Action
                 * @static
                 * @param {vmw.pscoe.hints.IAction} message Action message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Action.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.version);
                    if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.description);
                    if (message.returnType != null && Object.hasOwnProperty.call(message, "returnType"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.returnType);
                    if (message.parameters != null && message.parameters.length)
                        for (var i = 0; i < message.parameters.length; ++i)
                            $root.vmw.pscoe.hints.Action.Parameter.encode(message.parameters[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Action message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Action.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.Action
                 * @static
                 * @param {vmw.pscoe.hints.IAction} message Action message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Action.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an Action message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.Action
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.Action} Action
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Action.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.Action();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.version = reader.string();
                            break;
                        case 3:
                            message.description = reader.string();
                            break;
                        case 4:
                            message.returnType = reader.string();
                            break;
                        case 5:
                            if (!(message.parameters && message.parameters.length))
                                message.parameters = [];
                            message.parameters.push($root.vmw.pscoe.hints.Action.Parameter.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an Action message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.Action
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.Action} Action
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Action.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an Action message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.Action
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Action.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.version != null && message.hasOwnProperty("version"))
                        if (!$util.isString(message.version))
                            return "version: string expected";
                    if (message.description != null && message.hasOwnProperty("description"))
                        if (!$util.isString(message.description))
                            return "description: string expected";
                    if (message.returnType != null && message.hasOwnProperty("returnType"))
                        if (!$util.isString(message.returnType))
                            return "returnType: string expected";
                    if (message.parameters != null && message.hasOwnProperty("parameters")) {
                        if (!Array.isArray(message.parameters))
                            return "parameters: array expected";
                        for (var i = 0; i < message.parameters.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Action.Parameter.verify(message.parameters[i]);
                            if (error)
                                return "parameters." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates an Action message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.Action
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.Action} Action
                 */
                Action.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.Action)
                        return object;
                    var message = new $root.vmw.pscoe.hints.Action();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.version != null)
                        message.version = String(object.version);
                    if (object.description != null)
                        message.description = String(object.description);
                    if (object.returnType != null)
                        message.returnType = String(object.returnType);
                    if (object.parameters) {
                        if (!Array.isArray(object.parameters))
                            throw TypeError(".vmw.pscoe.hints.Action.parameters: array expected");
                        message.parameters = [];
                        for (var i = 0; i < object.parameters.length; ++i) {
                            if (typeof object.parameters[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.Action.parameters: object expected");
                            message.parameters[i] = $root.vmw.pscoe.hints.Action.Parameter.fromObject(object.parameters[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from an Action message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.Action
                 * @static
                 * @param {vmw.pscoe.hints.Action} message Action
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Action.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.parameters = [];
                    if (options.defaults) {
                        object.name = "";
                        object.version = "";
                        object.description = "";
                        object.returnType = "";
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.version != null && message.hasOwnProperty("version"))
                        object.version = message.version;
                    if (message.description != null && message.hasOwnProperty("description"))
                        object.description = message.description;
                    if (message.returnType != null && message.hasOwnProperty("returnType"))
                        object.returnType = message.returnType;
                    if (message.parameters && message.parameters.length) {
                        object.parameters = [];
                        for (var j = 0; j < message.parameters.length; ++j)
                            object.parameters[j] = $root.vmw.pscoe.hints.Action.Parameter.toObject(message.parameters[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this Action to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.Action
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Action.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                Action.Parameter = (function() {

                    /**
                     * Properties of a Parameter.
                     * @memberof vmw.pscoe.hints.Action
                     * @interface IParameter
                     * @property {string|null} [name] Parameter name
                     * @property {string|null} [type] Parameter type
                     * @property {string|null} [description] Parameter description
                     */

                    /**
                     * Constructs a new Parameter.
                     * @memberof vmw.pscoe.hints.Action
                     * @classdesc Represents a Parameter.
                     * @implements IParameter
                     * @constructor
                     * @param {vmw.pscoe.hints.Action.IParameter=} [properties] Properties to set
                     */
                    function Parameter(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Parameter name.
                     * @member {string} name
                     * @memberof vmw.pscoe.hints.Action.Parameter
                     * @instance
                     */
                    Parameter.prototype.name = "";

                    /**
                     * Parameter type.
                     * @member {string} type
                     * @memberof vmw.pscoe.hints.Action.Parameter
                     * @instance
                     */
                    Parameter.prototype.type = "";

                    /**
                     * Parameter description.
                     * @member {string} description
                     * @memberof vmw.pscoe.hints.Action.Parameter
                     * @instance
                     */
                    Parameter.prototype.description = "";

                    /**
                     * Creates a new Parameter instance using the specified properties.
                     * @function create
                     * @memberof vmw.pscoe.hints.Action.Parameter
                     * @static
                     * @param {vmw.pscoe.hints.Action.IParameter=} [properties] Properties to set
                     * @returns {vmw.pscoe.hints.Action.Parameter} Parameter instance
                     */
                    Parameter.create = function create(properties) {
                        return new Parameter(properties);
                    };

                    /**
                     * Encodes the specified Parameter message. Does not implicitly {@link vmw.pscoe.hints.Action.Parameter.verify|verify} messages.
                     * @function encode
                     * @memberof vmw.pscoe.hints.Action.Parameter
                     * @static
                     * @param {vmw.pscoe.hints.Action.IParameter} message Parameter message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Parameter.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                        if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.type);
                        if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                            writer.uint32(/* id 3, wireType 2 =*/26).string(message.description);
                        return writer;
                    };

                    /**
                     * Encodes the specified Parameter message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Action.Parameter.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof vmw.pscoe.hints.Action.Parameter
                     * @static
                     * @param {vmw.pscoe.hints.Action.IParameter} message Parameter message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Parameter.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Parameter message from the specified reader or buffer.
                     * @function decode
                     * @memberof vmw.pscoe.hints.Action.Parameter
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {vmw.pscoe.hints.Action.Parameter} Parameter
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Parameter.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.Action.Parameter();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.name = reader.string();
                                break;
                            case 2:
                                message.type = reader.string();
                                break;
                            case 3:
                                message.description = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a Parameter message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof vmw.pscoe.hints.Action.Parameter
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {vmw.pscoe.hints.Action.Parameter} Parameter
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Parameter.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Parameter message.
                     * @function verify
                     * @memberof vmw.pscoe.hints.Action.Parameter
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Parameter.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.name != null && message.hasOwnProperty("name"))
                            if (!$util.isString(message.name))
                                return "name: string expected";
                        if (message.type != null && message.hasOwnProperty("type"))
                            if (!$util.isString(message.type))
                                return "type: string expected";
                        if (message.description != null && message.hasOwnProperty("description"))
                            if (!$util.isString(message.description))
                                return "description: string expected";
                        return null;
                    };

                    /**
                     * Creates a Parameter message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof vmw.pscoe.hints.Action.Parameter
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {vmw.pscoe.hints.Action.Parameter} Parameter
                     */
                    Parameter.fromObject = function fromObject(object) {
                        if (object instanceof $root.vmw.pscoe.hints.Action.Parameter)
                            return object;
                        var message = new $root.vmw.pscoe.hints.Action.Parameter();
                        if (object.name != null)
                            message.name = String(object.name);
                        if (object.type != null)
                            message.type = String(object.type);
                        if (object.description != null)
                            message.description = String(object.description);
                        return message;
                    };

                    /**
                     * Creates a plain object from a Parameter message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof vmw.pscoe.hints.Action.Parameter
                     * @static
                     * @param {vmw.pscoe.hints.Action.Parameter} message Parameter
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Parameter.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.name = "";
                            object.type = "";
                            object.description = "";
                        }
                        if (message.name != null && message.hasOwnProperty("name"))
                            object.name = message.name;
                        if (message.type != null && message.hasOwnProperty("type"))
                            object.type = message.type;
                        if (message.description != null && message.hasOwnProperty("description"))
                            object.description = message.description;
                        return object;
                    };

                    /**
                     * Converts this Parameter to JSON.
                     * @function toJSON
                     * @memberof vmw.pscoe.hints.Action.Parameter
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Parameter.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Parameter;
                })();

                return Action;
            })();

            hints.ConfigurationsPack = (function() {

                /**
                 * Properties of a ConfigurationsPack.
                 * @memberof vmw.pscoe.hints
                 * @interface IConfigurationsPack
                 * @property {number|null} [version] ConfigurationsPack version
                 * @property {string|null} [uuid] ConfigurationsPack uuid
                 * @property {vmw.pscoe.hints.ConfigurationsPack.IMetadata|null} [metadata] ConfigurationsPack metadata
                 * @property {Array.<vmw.pscoe.hints.IConfigCategory>|null} [categories] ConfigurationsPack categories
                 */

                /**
                 * Constructs a new ConfigurationsPack.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents a ConfigurationsPack.
                 * @implements IConfigurationsPack
                 * @constructor
                 * @param {vmw.pscoe.hints.IConfigurationsPack=} [properties] Properties to set
                 */
                function ConfigurationsPack(properties) {
                    this.categories = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ConfigurationsPack version.
                 * @member {number} version
                 * @memberof vmw.pscoe.hints.ConfigurationsPack
                 * @instance
                 */
                ConfigurationsPack.prototype.version = 0;

                /**
                 * ConfigurationsPack uuid.
                 * @member {string} uuid
                 * @memberof vmw.pscoe.hints.ConfigurationsPack
                 * @instance
                 */
                ConfigurationsPack.prototype.uuid = "";

                /**
                 * ConfigurationsPack metadata.
                 * @member {vmw.pscoe.hints.ConfigurationsPack.IMetadata|null|undefined} metadata
                 * @memberof vmw.pscoe.hints.ConfigurationsPack
                 * @instance
                 */
                ConfigurationsPack.prototype.metadata = null;

                /**
                 * ConfigurationsPack categories.
                 * @member {Array.<vmw.pscoe.hints.IConfigCategory>} categories
                 * @memberof vmw.pscoe.hints.ConfigurationsPack
                 * @instance
                 */
                ConfigurationsPack.prototype.categories = $util.emptyArray;

                /**
                 * Creates a new ConfigurationsPack instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.ConfigurationsPack
                 * @static
                 * @param {vmw.pscoe.hints.IConfigurationsPack=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.ConfigurationsPack} ConfigurationsPack instance
                 */
                ConfigurationsPack.create = function create(properties) {
                    return new ConfigurationsPack(properties);
                };

                /**
                 * Encodes the specified ConfigurationsPack message. Does not implicitly {@link vmw.pscoe.hints.ConfigurationsPack.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.ConfigurationsPack
                 * @static
                 * @param {vmw.pscoe.hints.IConfigurationsPack} message ConfigurationsPack message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ConfigurationsPack.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.version);
                    if (message.uuid != null && Object.hasOwnProperty.call(message, "uuid"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.uuid);
                    if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                        $root.vmw.pscoe.hints.ConfigurationsPack.Metadata.encode(message.metadata, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    if (message.categories != null && message.categories.length)
                        for (var i = 0; i < message.categories.length; ++i)
                            $root.vmw.pscoe.hints.ConfigCategory.encode(message.categories[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified ConfigurationsPack message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ConfigurationsPack.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.ConfigurationsPack
                 * @static
                 * @param {vmw.pscoe.hints.IConfigurationsPack} message ConfigurationsPack message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ConfigurationsPack.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ConfigurationsPack message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.ConfigurationsPack
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.ConfigurationsPack} ConfigurationsPack
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ConfigurationsPack.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.ConfigurationsPack();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.version = reader.uint32();
                            break;
                        case 2:
                            message.uuid = reader.string();
                            break;
                        case 3:
                            message.metadata = $root.vmw.pscoe.hints.ConfigurationsPack.Metadata.decode(reader, reader.uint32());
                            break;
                        case 4:
                            if (!(message.categories && message.categories.length))
                                message.categories = [];
                            message.categories.push($root.vmw.pscoe.hints.ConfigCategory.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ConfigurationsPack message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.ConfigurationsPack
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.ConfigurationsPack} ConfigurationsPack
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ConfigurationsPack.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ConfigurationsPack message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.ConfigurationsPack
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ConfigurationsPack.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.version != null && message.hasOwnProperty("version"))
                        if (!$util.isInteger(message.version))
                            return "version: integer expected";
                    if (message.uuid != null && message.hasOwnProperty("uuid"))
                        if (!$util.isString(message.uuid))
                            return "uuid: string expected";
                    if (message.metadata != null && message.hasOwnProperty("metadata")) {
                        var error = $root.vmw.pscoe.hints.ConfigurationsPack.Metadata.verify(message.metadata);
                        if (error)
                            return "metadata." + error;
                    }
                    if (message.categories != null && message.hasOwnProperty("categories")) {
                        if (!Array.isArray(message.categories))
                            return "categories: array expected";
                        for (var i = 0; i < message.categories.length; ++i) {
                            var error = $root.vmw.pscoe.hints.ConfigCategory.verify(message.categories[i]);
                            if (error)
                                return "categories." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a ConfigurationsPack message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.ConfigurationsPack
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.ConfigurationsPack} ConfigurationsPack
                 */
                ConfigurationsPack.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.ConfigurationsPack)
                        return object;
                    var message = new $root.vmw.pscoe.hints.ConfigurationsPack();
                    if (object.version != null)
                        message.version = object.version >>> 0;
                    if (object.uuid != null)
                        message.uuid = String(object.uuid);
                    if (object.metadata != null) {
                        if (typeof object.metadata !== "object")
                            throw TypeError(".vmw.pscoe.hints.ConfigurationsPack.metadata: object expected");
                        message.metadata = $root.vmw.pscoe.hints.ConfigurationsPack.Metadata.fromObject(object.metadata);
                    }
                    if (object.categories) {
                        if (!Array.isArray(object.categories))
                            throw TypeError(".vmw.pscoe.hints.ConfigurationsPack.categories: array expected");
                        message.categories = [];
                        for (var i = 0; i < object.categories.length; ++i) {
                            if (typeof object.categories[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.ConfigurationsPack.categories: object expected");
                            message.categories[i] = $root.vmw.pscoe.hints.ConfigCategory.fromObject(object.categories[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a ConfigurationsPack message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.ConfigurationsPack
                 * @static
                 * @param {vmw.pscoe.hints.ConfigurationsPack} message ConfigurationsPack
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ConfigurationsPack.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.categories = [];
                    if (options.defaults) {
                        object.version = 0;
                        object.uuid = "";
                        object.metadata = null;
                    }
                    if (message.version != null && message.hasOwnProperty("version"))
                        object.version = message.version;
                    if (message.uuid != null && message.hasOwnProperty("uuid"))
                        object.uuid = message.uuid;
                    if (message.metadata != null && message.hasOwnProperty("metadata"))
                        object.metadata = $root.vmw.pscoe.hints.ConfigurationsPack.Metadata.toObject(message.metadata, options);
                    if (message.categories && message.categories.length) {
                        object.categories = [];
                        for (var j = 0; j < message.categories.length; ++j)
                            object.categories[j] = $root.vmw.pscoe.hints.ConfigCategory.toObject(message.categories[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this ConfigurationsPack to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.ConfigurationsPack
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ConfigurationsPack.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                ConfigurationsPack.Metadata = (function() {

                    /**
                     * Properties of a Metadata.
                     * @memberof vmw.pscoe.hints.ConfigurationsPack
                     * @interface IMetadata
                     * @property {number|Long|null} [timestamp] Metadata timestamp
                     * @property {string|null} [serverName] Metadata serverName
                     * @property {string|null} [serverVersion] Metadata serverVersion
                     * @property {string|null} [hintingVersion] Metadata hintingVersion
                     */

                    /**
                     * Constructs a new Metadata.
                     * @memberof vmw.pscoe.hints.ConfigurationsPack
                     * @classdesc Represents a Metadata.
                     * @implements IMetadata
                     * @constructor
                     * @param {vmw.pscoe.hints.ConfigurationsPack.IMetadata=} [properties] Properties to set
                     */
                    function Metadata(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Metadata timestamp.
                     * @member {number|Long} timestamp
                     * @memberof vmw.pscoe.hints.ConfigurationsPack.Metadata
                     * @instance
                     */
                    Metadata.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * Metadata serverName.
                     * @member {string} serverName
                     * @memberof vmw.pscoe.hints.ConfigurationsPack.Metadata
                     * @instance
                     */
                    Metadata.prototype.serverName = "";

                    /**
                     * Metadata serverVersion.
                     * @member {string} serverVersion
                     * @memberof vmw.pscoe.hints.ConfigurationsPack.Metadata
                     * @instance
                     */
                    Metadata.prototype.serverVersion = "";

                    /**
                     * Metadata hintingVersion.
                     * @member {string} hintingVersion
                     * @memberof vmw.pscoe.hints.ConfigurationsPack.Metadata
                     * @instance
                     */
                    Metadata.prototype.hintingVersion = "";

                    /**
                     * Creates a new Metadata instance using the specified properties.
                     * @function create
                     * @memberof vmw.pscoe.hints.ConfigurationsPack.Metadata
                     * @static
                     * @param {vmw.pscoe.hints.ConfigurationsPack.IMetadata=} [properties] Properties to set
                     * @returns {vmw.pscoe.hints.ConfigurationsPack.Metadata} Metadata instance
                     */
                    Metadata.create = function create(properties) {
                        return new Metadata(properties);
                    };

                    /**
                     * Encodes the specified Metadata message. Does not implicitly {@link vmw.pscoe.hints.ConfigurationsPack.Metadata.verify|verify} messages.
                     * @function encode
                     * @memberof vmw.pscoe.hints.ConfigurationsPack.Metadata
                     * @static
                     * @param {vmw.pscoe.hints.ConfigurationsPack.IMetadata} message Metadata message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Metadata.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.timestamp);
                        if (message.serverName != null && Object.hasOwnProperty.call(message, "serverName"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.serverName);
                        if (message.serverVersion != null && Object.hasOwnProperty.call(message, "serverVersion"))
                            writer.uint32(/* id 3, wireType 2 =*/26).string(message.serverVersion);
                        if (message.hintingVersion != null && Object.hasOwnProperty.call(message, "hintingVersion"))
                            writer.uint32(/* id 4, wireType 2 =*/34).string(message.hintingVersion);
                        return writer;
                    };

                    /**
                     * Encodes the specified Metadata message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ConfigurationsPack.Metadata.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof vmw.pscoe.hints.ConfigurationsPack.Metadata
                     * @static
                     * @param {vmw.pscoe.hints.ConfigurationsPack.IMetadata} message Metadata message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Metadata.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Metadata message from the specified reader or buffer.
                     * @function decode
                     * @memberof vmw.pscoe.hints.ConfigurationsPack.Metadata
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {vmw.pscoe.hints.ConfigurationsPack.Metadata} Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Metadata.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.ConfigurationsPack.Metadata();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.timestamp = reader.int64();
                                break;
                            case 2:
                                message.serverName = reader.string();
                                break;
                            case 3:
                                message.serverVersion = reader.string();
                                break;
                            case 4:
                                message.hintingVersion = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a Metadata message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof vmw.pscoe.hints.ConfigurationsPack.Metadata
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {vmw.pscoe.hints.ConfigurationsPack.Metadata} Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Metadata.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Metadata message.
                     * @function verify
                     * @memberof vmw.pscoe.hints.ConfigurationsPack.Metadata
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Metadata.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                                return "timestamp: integer|Long expected";
                        if (message.serverName != null && message.hasOwnProperty("serverName"))
                            if (!$util.isString(message.serverName))
                                return "serverName: string expected";
                        if (message.serverVersion != null && message.hasOwnProperty("serverVersion"))
                            if (!$util.isString(message.serverVersion))
                                return "serverVersion: string expected";
                        if (message.hintingVersion != null && message.hasOwnProperty("hintingVersion"))
                            if (!$util.isString(message.hintingVersion))
                                return "hintingVersion: string expected";
                        return null;
                    };

                    /**
                     * Creates a Metadata message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof vmw.pscoe.hints.ConfigurationsPack.Metadata
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {vmw.pscoe.hints.ConfigurationsPack.Metadata} Metadata
                     */
                    Metadata.fromObject = function fromObject(object) {
                        if (object instanceof $root.vmw.pscoe.hints.ConfigurationsPack.Metadata)
                            return object;
                        var message = new $root.vmw.pscoe.hints.ConfigurationsPack.Metadata();
                        if (object.timestamp != null)
                            if ($util.Long)
                                (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                            else if (typeof object.timestamp === "string")
                                message.timestamp = parseInt(object.timestamp, 10);
                            else if (typeof object.timestamp === "number")
                                message.timestamp = object.timestamp;
                            else if (typeof object.timestamp === "object")
                                message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
                        if (object.serverName != null)
                            message.serverName = String(object.serverName);
                        if (object.serverVersion != null)
                            message.serverVersion = String(object.serverVersion);
                        if (object.hintingVersion != null)
                            message.hintingVersion = String(object.hintingVersion);
                        return message;
                    };

                    /**
                     * Creates a plain object from a Metadata message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof vmw.pscoe.hints.ConfigurationsPack.Metadata
                     * @static
                     * @param {vmw.pscoe.hints.ConfigurationsPack.Metadata} message Metadata
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Metadata.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.timestamp = options.longs === String ? "0" : 0;
                            object.serverName = "";
                            object.serverVersion = "";
                            object.hintingVersion = "";
                        }
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (typeof message.timestamp === "number")
                                object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                            else
                                object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
                        if (message.serverName != null && message.hasOwnProperty("serverName"))
                            object.serverName = message.serverName;
                        if (message.serverVersion != null && message.hasOwnProperty("serverVersion"))
                            object.serverVersion = message.serverVersion;
                        if (message.hintingVersion != null && message.hasOwnProperty("hintingVersion"))
                            object.hintingVersion = message.hintingVersion;
                        return object;
                    };

                    /**
                     * Converts this Metadata to JSON.
                     * @function toJSON
                     * @memberof vmw.pscoe.hints.ConfigurationsPack.Metadata
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Metadata.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Metadata;
                })();

                return ConfigurationsPack;
            })();

            hints.ConfigCategory = (function() {

                /**
                 * Properties of a ConfigCategory.
                 * @memberof vmw.pscoe.hints
                 * @interface IConfigCategory
                 * @property {string|null} [path] ConfigCategory path
                 * @property {Array.<vmw.pscoe.hints.IConfig>|null} [configurations] ConfigCategory configurations
                 */

                /**
                 * Constructs a new ConfigCategory.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents a ConfigCategory.
                 * @implements IConfigCategory
                 * @constructor
                 * @param {vmw.pscoe.hints.IConfigCategory=} [properties] Properties to set
                 */
                function ConfigCategory(properties) {
                    this.configurations = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ConfigCategory path.
                 * @member {string} path
                 * @memberof vmw.pscoe.hints.ConfigCategory
                 * @instance
                 */
                ConfigCategory.prototype.path = "";

                /**
                 * ConfigCategory configurations.
                 * @member {Array.<vmw.pscoe.hints.IConfig>} configurations
                 * @memberof vmw.pscoe.hints.ConfigCategory
                 * @instance
                 */
                ConfigCategory.prototype.configurations = $util.emptyArray;

                /**
                 * Creates a new ConfigCategory instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.ConfigCategory
                 * @static
                 * @param {vmw.pscoe.hints.IConfigCategory=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.ConfigCategory} ConfigCategory instance
                 */
                ConfigCategory.create = function create(properties) {
                    return new ConfigCategory(properties);
                };

                /**
                 * Encodes the specified ConfigCategory message. Does not implicitly {@link vmw.pscoe.hints.ConfigCategory.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.ConfigCategory
                 * @static
                 * @param {vmw.pscoe.hints.IConfigCategory} message ConfigCategory message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ConfigCategory.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.path != null && Object.hasOwnProperty.call(message, "path"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.path);
                    if (message.configurations != null && message.configurations.length)
                        for (var i = 0; i < message.configurations.length; ++i)
                            $root.vmw.pscoe.hints.Config.encode(message.configurations[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified ConfigCategory message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ConfigCategory.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.ConfigCategory
                 * @static
                 * @param {vmw.pscoe.hints.IConfigCategory} message ConfigCategory message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ConfigCategory.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ConfigCategory message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.ConfigCategory
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.ConfigCategory} ConfigCategory
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ConfigCategory.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.ConfigCategory();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.path = reader.string();
                            break;
                        case 2:
                            if (!(message.configurations && message.configurations.length))
                                message.configurations = [];
                            message.configurations.push($root.vmw.pscoe.hints.Config.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ConfigCategory message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.ConfigCategory
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.ConfigCategory} ConfigCategory
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ConfigCategory.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ConfigCategory message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.ConfigCategory
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ConfigCategory.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.path != null && message.hasOwnProperty("path"))
                        if (!$util.isString(message.path))
                            return "path: string expected";
                    if (message.configurations != null && message.hasOwnProperty("configurations")) {
                        if (!Array.isArray(message.configurations))
                            return "configurations: array expected";
                        for (var i = 0; i < message.configurations.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Config.verify(message.configurations[i]);
                            if (error)
                                return "configurations." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a ConfigCategory message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.ConfigCategory
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.ConfigCategory} ConfigCategory
                 */
                ConfigCategory.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.ConfigCategory)
                        return object;
                    var message = new $root.vmw.pscoe.hints.ConfigCategory();
                    if (object.path != null)
                        message.path = String(object.path);
                    if (object.configurations) {
                        if (!Array.isArray(object.configurations))
                            throw TypeError(".vmw.pscoe.hints.ConfigCategory.configurations: array expected");
                        message.configurations = [];
                        for (var i = 0; i < object.configurations.length; ++i) {
                            if (typeof object.configurations[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.ConfigCategory.configurations: object expected");
                            message.configurations[i] = $root.vmw.pscoe.hints.Config.fromObject(object.configurations[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a ConfigCategory message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.ConfigCategory
                 * @static
                 * @param {vmw.pscoe.hints.ConfigCategory} message ConfigCategory
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ConfigCategory.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.configurations = [];
                    if (options.defaults)
                        object.path = "";
                    if (message.path != null && message.hasOwnProperty("path"))
                        object.path = message.path;
                    if (message.configurations && message.configurations.length) {
                        object.configurations = [];
                        for (var j = 0; j < message.configurations.length; ++j)
                            object.configurations[j] = $root.vmw.pscoe.hints.Config.toObject(message.configurations[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this ConfigCategory to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.ConfigCategory
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ConfigCategory.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ConfigCategory;
            })();

            hints.Config = (function() {

                /**
                 * Properties of a Config.
                 * @memberof vmw.pscoe.hints
                 * @interface IConfig
                 * @property {string|null} [uuid] Config uuid
                 * @property {string|null} [name] Config name
                 * @property {string|null} [version] Config version
                 * @property {string|null} [description] Config description
                 */

                /**
                 * Constructs a new Config.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents a Config.
                 * @implements IConfig
                 * @constructor
                 * @param {vmw.pscoe.hints.IConfig=} [properties] Properties to set
                 */
                function Config(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Config uuid.
                 * @member {string} uuid
                 * @memberof vmw.pscoe.hints.Config
                 * @instance
                 */
                Config.prototype.uuid = "";

                /**
                 * Config name.
                 * @member {string} name
                 * @memberof vmw.pscoe.hints.Config
                 * @instance
                 */
                Config.prototype.name = "";

                /**
                 * Config version.
                 * @member {string} version
                 * @memberof vmw.pscoe.hints.Config
                 * @instance
                 */
                Config.prototype.version = "";

                /**
                 * Config description.
                 * @member {string} description
                 * @memberof vmw.pscoe.hints.Config
                 * @instance
                 */
                Config.prototype.description = "";

                /**
                 * Creates a new Config instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.Config
                 * @static
                 * @param {vmw.pscoe.hints.IConfig=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.Config} Config instance
                 */
                Config.create = function create(properties) {
                    return new Config(properties);
                };

                /**
                 * Encodes the specified Config message. Does not implicitly {@link vmw.pscoe.hints.Config.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.Config
                 * @static
                 * @param {vmw.pscoe.hints.IConfig} message Config message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Config.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.uuid != null && Object.hasOwnProperty.call(message, "uuid"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.uuid);
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                    if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.version);
                    if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.description);
                    return writer;
                };

                /**
                 * Encodes the specified Config message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Config.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.Config
                 * @static
                 * @param {vmw.pscoe.hints.IConfig} message Config message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Config.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Config message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.Config
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.Config} Config
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Config.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.Config();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.uuid = reader.string();
                            break;
                        case 2:
                            message.name = reader.string();
                            break;
                        case 3:
                            message.version = reader.string();
                            break;
                        case 4:
                            message.description = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Config message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.Config
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.Config} Config
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Config.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Config message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.Config
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Config.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.uuid != null && message.hasOwnProperty("uuid"))
                        if (!$util.isString(message.uuid))
                            return "uuid: string expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.version != null && message.hasOwnProperty("version"))
                        if (!$util.isString(message.version))
                            return "version: string expected";
                    if (message.description != null && message.hasOwnProperty("description"))
                        if (!$util.isString(message.description))
                            return "description: string expected";
                    return null;
                };

                /**
                 * Creates a Config message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.Config
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.Config} Config
                 */
                Config.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.Config)
                        return object;
                    var message = new $root.vmw.pscoe.hints.Config();
                    if (object.uuid != null)
                        message.uuid = String(object.uuid);
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.version != null)
                        message.version = String(object.version);
                    if (object.description != null)
                        message.description = String(object.description);
                    return message;
                };

                /**
                 * Creates a plain object from a Config message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.Config
                 * @static
                 * @param {vmw.pscoe.hints.Config} message Config
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Config.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.uuid = "";
                        object.name = "";
                        object.version = "";
                        object.description = "";
                    }
                    if (message.uuid != null && message.hasOwnProperty("uuid"))
                        object.uuid = message.uuid;
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.version != null && message.hasOwnProperty("version"))
                        object.version = message.version;
                    if (message.description != null && message.hasOwnProperty("description"))
                        object.description = message.description;
                    return object;
                };

                /**
                 * Converts this Config to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.Config
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Config.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Config;
            })();

            hints.Class = (function() {

                /**
                 * Properties of a Class.
                 * @memberof vmw.pscoe.hints
                 * @interface IClass
                 * @property {string|null} [name] Class name
                 * @property {string|null} [description] Class description
                 * @property {vmw.pscoe.hints.ScriptingApi.Stage|null} [stage] Class stage
                 * @property {Array.<vmw.pscoe.hints.IProperty>|null} [properties] Class properties
                 * @property {Array.<vmw.pscoe.hints.IConstructor>|null} [constructors] Class constructors
                 * @property {Array.<vmw.pscoe.hints.IMethod>|null} [methods] Class methods
                 * @property {Array.<vmw.pscoe.hints.IEvent>|null} [events] Class events
                 * @property {Array.<string>|null} [codeSnippets] Class codeSnippets
                 */

                /**
                 * Constructs a new Class.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents a Class.
                 * @implements IClass
                 * @constructor
                 * @param {vmw.pscoe.hints.IClass=} [properties] Properties to set
                 */
                function Class(properties) {
                    this.properties = [];
                    this.constructors = [];
                    this.methods = [];
                    this.events = [];
                    this.codeSnippets = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Class name.
                 * @member {string} name
                 * @memberof vmw.pscoe.hints.Class
                 * @instance
                 */
                Class.prototype.name = "";

                /**
                 * Class description.
                 * @member {string} description
                 * @memberof vmw.pscoe.hints.Class
                 * @instance
                 */
                Class.prototype.description = "";

                /**
                 * Class stage.
                 * @member {vmw.pscoe.hints.ScriptingApi.Stage} stage
                 * @memberof vmw.pscoe.hints.Class
                 * @instance
                 */
                Class.prototype.stage = 0;

                /**
                 * Class properties.
                 * @member {Array.<vmw.pscoe.hints.IProperty>} properties
                 * @memberof vmw.pscoe.hints.Class
                 * @instance
                 */
                Class.prototype.properties = $util.emptyArray;

                /**
                 * Class constructors.
                 * @member {Array.<vmw.pscoe.hints.IConstructor>} constructors
                 * @memberof vmw.pscoe.hints.Class
                 * @instance
                 */
                Class.prototype.constructors = $util.emptyArray;

                /**
                 * Class methods.
                 * @member {Array.<vmw.pscoe.hints.IMethod>} methods
                 * @memberof vmw.pscoe.hints.Class
                 * @instance
                 */
                Class.prototype.methods = $util.emptyArray;

                /**
                 * Class events.
                 * @member {Array.<vmw.pscoe.hints.IEvent>} events
                 * @memberof vmw.pscoe.hints.Class
                 * @instance
                 */
                Class.prototype.events = $util.emptyArray;

                /**
                 * Class codeSnippets.
                 * @member {Array.<string>} codeSnippets
                 * @memberof vmw.pscoe.hints.Class
                 * @instance
                 */
                Class.prototype.codeSnippets = $util.emptyArray;

                /**
                 * Creates a new Class instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.Class
                 * @static
                 * @param {vmw.pscoe.hints.IClass=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.Class} Class instance
                 */
                Class.create = function create(properties) {
                    return new Class(properties);
                };

                /**
                 * Encodes the specified Class message. Does not implicitly {@link vmw.pscoe.hints.Class.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.Class
                 * @static
                 * @param {vmw.pscoe.hints.IClass} message Class message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Class.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
                    if (message.stage != null && Object.hasOwnProperty.call(message, "stage"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.stage);
                    if (message.properties != null && message.properties.length)
                        for (var i = 0; i < message.properties.length; ++i)
                            $root.vmw.pscoe.hints.Property.encode(message.properties[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    if (message.constructors != null && message.constructors.length)
                        for (var i = 0; i < message.constructors.length; ++i)
                            $root.vmw.pscoe.hints.Constructor.encode(message.constructors[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                    if (message.methods != null && message.methods.length)
                        for (var i = 0; i < message.methods.length; ++i)
                            $root.vmw.pscoe.hints.Method.encode(message.methods[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                    if (message.events != null && message.events.length)
                        for (var i = 0; i < message.events.length; ++i)
                            $root.vmw.pscoe.hints.Event.encode(message.events[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                    if (message.codeSnippets != null && message.codeSnippets.length)
                        for (var i = 0; i < message.codeSnippets.length; ++i)
                            writer.uint32(/* id 8, wireType 2 =*/66).string(message.codeSnippets[i]);
                    return writer;
                };

                /**
                 * Encodes the specified Class message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Class.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.Class
                 * @static
                 * @param {vmw.pscoe.hints.IClass} message Class message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Class.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Class message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.Class
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.Class} Class
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Class.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.Class();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.description = reader.string();
                            break;
                        case 3:
                            message.stage = reader.int32();
                            break;
                        case 4:
                            if (!(message.properties && message.properties.length))
                                message.properties = [];
                            message.properties.push($root.vmw.pscoe.hints.Property.decode(reader, reader.uint32()));
                            break;
                        case 5:
                            if (!(message.constructors && message.constructors.length))
                                message.constructors = [];
                            message.constructors.push($root.vmw.pscoe.hints.Constructor.decode(reader, reader.uint32()));
                            break;
                        case 6:
                            if (!(message.methods && message.methods.length))
                                message.methods = [];
                            message.methods.push($root.vmw.pscoe.hints.Method.decode(reader, reader.uint32()));
                            break;
                        case 7:
                            if (!(message.events && message.events.length))
                                message.events = [];
                            message.events.push($root.vmw.pscoe.hints.Event.decode(reader, reader.uint32()));
                            break;
                        case 8:
                            if (!(message.codeSnippets && message.codeSnippets.length))
                                message.codeSnippets = [];
                            message.codeSnippets.push(reader.string());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Class message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.Class
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.Class} Class
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Class.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Class message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.Class
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Class.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.description != null && message.hasOwnProperty("description"))
                        if (!$util.isString(message.description))
                            return "description: string expected";
                    if (message.stage != null && message.hasOwnProperty("stage"))
                        switch (message.stage) {
                        default:
                            return "stage: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            break;
                        }
                    if (message.properties != null && message.hasOwnProperty("properties")) {
                        if (!Array.isArray(message.properties))
                            return "properties: array expected";
                        for (var i = 0; i < message.properties.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Property.verify(message.properties[i]);
                            if (error)
                                return "properties." + error;
                        }
                    }
                    if (message.constructors != null && message.hasOwnProperty("constructors")) {
                        if (!Array.isArray(message.constructors))
                            return "constructors: array expected";
                        for (var i = 0; i < message.constructors.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Constructor.verify(message.constructors[i]);
                            if (error)
                                return "constructors." + error;
                        }
                    }
                    if (message.methods != null && message.hasOwnProperty("methods")) {
                        if (!Array.isArray(message.methods))
                            return "methods: array expected";
                        for (var i = 0; i < message.methods.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Method.verify(message.methods[i]);
                            if (error)
                                return "methods." + error;
                        }
                    }
                    if (message.events != null && message.hasOwnProperty("events")) {
                        if (!Array.isArray(message.events))
                            return "events: array expected";
                        for (var i = 0; i < message.events.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Event.verify(message.events[i]);
                            if (error)
                                return "events." + error;
                        }
                    }
                    if (message.codeSnippets != null && message.hasOwnProperty("codeSnippets")) {
                        if (!Array.isArray(message.codeSnippets))
                            return "codeSnippets: array expected";
                        for (var i = 0; i < message.codeSnippets.length; ++i)
                            if (!$util.isString(message.codeSnippets[i]))
                                return "codeSnippets: string[] expected";
                    }
                    return null;
                };

                /**
                 * Creates a Class message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.Class
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.Class} Class
                 */
                Class.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.Class)
                        return object;
                    var message = new $root.vmw.pscoe.hints.Class();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.description != null)
                        message.description = String(object.description);
                    switch (object.stage) {
                    case "RELEASE":
                    case 0:
                        message.stage = 0;
                        break;
                    case "ALPHA":
                    case 1:
                        message.stage = 1;
                        break;
                    case "BETA":
                    case 2:
                        message.stage = 2;
                        break;
                    case "DEPRECATED":
                    case 3:
                        message.stage = 3;
                        break;
                    }
                    if (object.properties) {
                        if (!Array.isArray(object.properties))
                            throw TypeError(".vmw.pscoe.hints.Class.properties: array expected");
                        message.properties = [];
                        for (var i = 0; i < object.properties.length; ++i) {
                            if (typeof object.properties[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.Class.properties: object expected");
                            message.properties[i] = $root.vmw.pscoe.hints.Property.fromObject(object.properties[i]);
                        }
                    }
                    if (object.constructors) {
                        if (!Array.isArray(object.constructors))
                            throw TypeError(".vmw.pscoe.hints.Class.constructors: array expected");
                        message.constructors = [];
                        for (var i = 0; i < object.constructors.length; ++i) {
                            if (typeof object.constructors[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.Class.constructors: object expected");
                            message.constructors[i] = $root.vmw.pscoe.hints.Constructor.fromObject(object.constructors[i]);
                        }
                    }
                    if (object.methods) {
                        if (!Array.isArray(object.methods))
                            throw TypeError(".vmw.pscoe.hints.Class.methods: array expected");
                        message.methods = [];
                        for (var i = 0; i < object.methods.length; ++i) {
                            if (typeof object.methods[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.Class.methods: object expected");
                            message.methods[i] = $root.vmw.pscoe.hints.Method.fromObject(object.methods[i]);
                        }
                    }
                    if (object.events) {
                        if (!Array.isArray(object.events))
                            throw TypeError(".vmw.pscoe.hints.Class.events: array expected");
                        message.events = [];
                        for (var i = 0; i < object.events.length; ++i) {
                            if (typeof object.events[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.Class.events: object expected");
                            message.events[i] = $root.vmw.pscoe.hints.Event.fromObject(object.events[i]);
                        }
                    }
                    if (object.codeSnippets) {
                        if (!Array.isArray(object.codeSnippets))
                            throw TypeError(".vmw.pscoe.hints.Class.codeSnippets: array expected");
                        message.codeSnippets = [];
                        for (var i = 0; i < object.codeSnippets.length; ++i)
                            message.codeSnippets[i] = String(object.codeSnippets[i]);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Class message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.Class
                 * @static
                 * @param {vmw.pscoe.hints.Class} message Class
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Class.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.properties = [];
                        object.constructors = [];
                        object.methods = [];
                        object.events = [];
                        object.codeSnippets = [];
                    }
                    if (options.defaults) {
                        object.name = "";
                        object.description = "";
                        object.stage = options.enums === String ? "RELEASE" : 0;
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.description != null && message.hasOwnProperty("description"))
                        object.description = message.description;
                    if (message.stage != null && message.hasOwnProperty("stage"))
                        object.stage = options.enums === String ? $root.vmw.pscoe.hints.ScriptingApi.Stage[message.stage] : message.stage;
                    if (message.properties && message.properties.length) {
                        object.properties = [];
                        for (var j = 0; j < message.properties.length; ++j)
                            object.properties[j] = $root.vmw.pscoe.hints.Property.toObject(message.properties[j], options);
                    }
                    if (message.constructors && message.constructors.length) {
                        object.constructors = [];
                        for (var j = 0; j < message.constructors.length; ++j)
                            object.constructors[j] = $root.vmw.pscoe.hints.Constructor.toObject(message.constructors[j], options);
                    }
                    if (message.methods && message.methods.length) {
                        object.methods = [];
                        for (var j = 0; j < message.methods.length; ++j)
                            object.methods[j] = $root.vmw.pscoe.hints.Method.toObject(message.methods[j], options);
                    }
                    if (message.events && message.events.length) {
                        object.events = [];
                        for (var j = 0; j < message.events.length; ++j)
                            object.events[j] = $root.vmw.pscoe.hints.Event.toObject(message.events[j], options);
                    }
                    if (message.codeSnippets && message.codeSnippets.length) {
                        object.codeSnippets = [];
                        for (var j = 0; j < message.codeSnippets.length; ++j)
                            object.codeSnippets[j] = message.codeSnippets[j];
                    }
                    return object;
                };

                /**
                 * Converts this Class to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.Class
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Class.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Class;
            })();

            hints.Type = (function() {

                /**
                 * Properties of a Type.
                 * @memberof vmw.pscoe.hints
                 * @interface IType
                 * @property {string|null} [name] Type name
                 * @property {string|null} [description] Type description
                 * @property {string|null} [scriptName] Type scriptName
                 * @property {Array.<string>|null} [propertyNames] Type propertyNames
                 */

                /**
                 * Constructs a new Type.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents a Type.
                 * @implements IType
                 * @constructor
                 * @param {vmw.pscoe.hints.IType=} [properties] Properties to set
                 */
                function Type(properties) {
                    this.propertyNames = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Type name.
                 * @member {string} name
                 * @memberof vmw.pscoe.hints.Type
                 * @instance
                 */
                Type.prototype.name = "";

                /**
                 * Type description.
                 * @member {string} description
                 * @memberof vmw.pscoe.hints.Type
                 * @instance
                 */
                Type.prototype.description = "";

                /**
                 * Type scriptName.
                 * @member {string} scriptName
                 * @memberof vmw.pscoe.hints.Type
                 * @instance
                 */
                Type.prototype.scriptName = "";

                /**
                 * Type propertyNames.
                 * @member {Array.<string>} propertyNames
                 * @memberof vmw.pscoe.hints.Type
                 * @instance
                 */
                Type.prototype.propertyNames = $util.emptyArray;

                /**
                 * Creates a new Type instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.Type
                 * @static
                 * @param {vmw.pscoe.hints.IType=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.Type} Type instance
                 */
                Type.create = function create(properties) {
                    return new Type(properties);
                };

                /**
                 * Encodes the specified Type message. Does not implicitly {@link vmw.pscoe.hints.Type.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.Type
                 * @static
                 * @param {vmw.pscoe.hints.IType} message Type message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Type.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
                    if (message.scriptName != null && Object.hasOwnProperty.call(message, "scriptName"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.scriptName);
                    if (message.propertyNames != null && message.propertyNames.length)
                        for (var i = 0; i < message.propertyNames.length; ++i)
                            writer.uint32(/* id 4, wireType 2 =*/34).string(message.propertyNames[i]);
                    return writer;
                };

                /**
                 * Encodes the specified Type message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Type.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.Type
                 * @static
                 * @param {vmw.pscoe.hints.IType} message Type message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Type.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Type message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.Type
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.Type} Type
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Type.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.Type();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.description = reader.string();
                            break;
                        case 3:
                            message.scriptName = reader.string();
                            break;
                        case 4:
                            if (!(message.propertyNames && message.propertyNames.length))
                                message.propertyNames = [];
                            message.propertyNames.push(reader.string());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Type message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.Type
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.Type} Type
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Type.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Type message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.Type
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Type.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.description != null && message.hasOwnProperty("description"))
                        if (!$util.isString(message.description))
                            return "description: string expected";
                    if (message.scriptName != null && message.hasOwnProperty("scriptName"))
                        if (!$util.isString(message.scriptName))
                            return "scriptName: string expected";
                    if (message.propertyNames != null && message.hasOwnProperty("propertyNames")) {
                        if (!Array.isArray(message.propertyNames))
                            return "propertyNames: array expected";
                        for (var i = 0; i < message.propertyNames.length; ++i)
                            if (!$util.isString(message.propertyNames[i]))
                                return "propertyNames: string[] expected";
                    }
                    return null;
                };

                /**
                 * Creates a Type message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.Type
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.Type} Type
                 */
                Type.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.Type)
                        return object;
                    var message = new $root.vmw.pscoe.hints.Type();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.description != null)
                        message.description = String(object.description);
                    if (object.scriptName != null)
                        message.scriptName = String(object.scriptName);
                    if (object.propertyNames) {
                        if (!Array.isArray(object.propertyNames))
                            throw TypeError(".vmw.pscoe.hints.Type.propertyNames: array expected");
                        message.propertyNames = [];
                        for (var i = 0; i < object.propertyNames.length; ++i)
                            message.propertyNames[i] = String(object.propertyNames[i]);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Type message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.Type
                 * @static
                 * @param {vmw.pscoe.hints.Type} message Type
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Type.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.propertyNames = [];
                    if (options.defaults) {
                        object.name = "";
                        object.description = "";
                        object.scriptName = "";
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.description != null && message.hasOwnProperty("description"))
                        object.description = message.description;
                    if (message.scriptName != null && message.hasOwnProperty("scriptName"))
                        object.scriptName = message.scriptName;
                    if (message.propertyNames && message.propertyNames.length) {
                        object.propertyNames = [];
                        for (var j = 0; j < message.propertyNames.length; ++j)
                            object.propertyNames[j] = message.propertyNames[j];
                    }
                    return object;
                };

                /**
                 * Converts this Type to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.Type
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Type.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Type;
            })();

            hints.FunctionSet = (function() {

                /**
                 * Properties of a FunctionSet.
                 * @memberof vmw.pscoe.hints
                 * @interface IFunctionSet
                 * @property {string|null} [name] FunctionSet name
                 * @property {string|null} [description] FunctionSet description
                 * @property {vmw.pscoe.hints.ScriptingApi.Stage|null} [stage] FunctionSet stage
                 * @property {Array.<string>|null} [codeSnippets] FunctionSet codeSnippets
                 * @property {Array.<vmw.pscoe.hints.IMethod>|null} [methods] FunctionSet methods
                 */

                /**
                 * Constructs a new FunctionSet.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents a FunctionSet.
                 * @implements IFunctionSet
                 * @constructor
                 * @param {vmw.pscoe.hints.IFunctionSet=} [properties] Properties to set
                 */
                function FunctionSet(properties) {
                    this.codeSnippets = [];
                    this.methods = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * FunctionSet name.
                 * @member {string} name
                 * @memberof vmw.pscoe.hints.FunctionSet
                 * @instance
                 */
                FunctionSet.prototype.name = "";

                /**
                 * FunctionSet description.
                 * @member {string} description
                 * @memberof vmw.pscoe.hints.FunctionSet
                 * @instance
                 */
                FunctionSet.prototype.description = "";

                /**
                 * FunctionSet stage.
                 * @member {vmw.pscoe.hints.ScriptingApi.Stage} stage
                 * @memberof vmw.pscoe.hints.FunctionSet
                 * @instance
                 */
                FunctionSet.prototype.stage = 0;

                /**
                 * FunctionSet codeSnippets.
                 * @member {Array.<string>} codeSnippets
                 * @memberof vmw.pscoe.hints.FunctionSet
                 * @instance
                 */
                FunctionSet.prototype.codeSnippets = $util.emptyArray;

                /**
                 * FunctionSet methods.
                 * @member {Array.<vmw.pscoe.hints.IMethod>} methods
                 * @memberof vmw.pscoe.hints.FunctionSet
                 * @instance
                 */
                FunctionSet.prototype.methods = $util.emptyArray;

                /**
                 * Creates a new FunctionSet instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.FunctionSet
                 * @static
                 * @param {vmw.pscoe.hints.IFunctionSet=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.FunctionSet} FunctionSet instance
                 */
                FunctionSet.create = function create(properties) {
                    return new FunctionSet(properties);
                };

                /**
                 * Encodes the specified FunctionSet message. Does not implicitly {@link vmw.pscoe.hints.FunctionSet.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.FunctionSet
                 * @static
                 * @param {vmw.pscoe.hints.IFunctionSet} message FunctionSet message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                FunctionSet.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
                    if (message.stage != null && Object.hasOwnProperty.call(message, "stage"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.stage);
                    if (message.codeSnippets != null && message.codeSnippets.length)
                        for (var i = 0; i < message.codeSnippets.length; ++i)
                            writer.uint32(/* id 4, wireType 2 =*/34).string(message.codeSnippets[i]);
                    if (message.methods != null && message.methods.length)
                        for (var i = 0; i < message.methods.length; ++i)
                            $root.vmw.pscoe.hints.Method.encode(message.methods[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified FunctionSet message, length delimited. Does not implicitly {@link vmw.pscoe.hints.FunctionSet.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.FunctionSet
                 * @static
                 * @param {vmw.pscoe.hints.IFunctionSet} message FunctionSet message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                FunctionSet.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a FunctionSet message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.FunctionSet
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.FunctionSet} FunctionSet
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                FunctionSet.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.FunctionSet();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.description = reader.string();
                            break;
                        case 3:
                            message.stage = reader.int32();
                            break;
                        case 4:
                            if (!(message.codeSnippets && message.codeSnippets.length))
                                message.codeSnippets = [];
                            message.codeSnippets.push(reader.string());
                            break;
                        case 5:
                            if (!(message.methods && message.methods.length))
                                message.methods = [];
                            message.methods.push($root.vmw.pscoe.hints.Method.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a FunctionSet message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.FunctionSet
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.FunctionSet} FunctionSet
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                FunctionSet.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a FunctionSet message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.FunctionSet
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                FunctionSet.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.description != null && message.hasOwnProperty("description"))
                        if (!$util.isString(message.description))
                            return "description: string expected";
                    if (message.stage != null && message.hasOwnProperty("stage"))
                        switch (message.stage) {
                        default:
                            return "stage: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            break;
                        }
                    if (message.codeSnippets != null && message.hasOwnProperty("codeSnippets")) {
                        if (!Array.isArray(message.codeSnippets))
                            return "codeSnippets: array expected";
                        for (var i = 0; i < message.codeSnippets.length; ++i)
                            if (!$util.isString(message.codeSnippets[i]))
                                return "codeSnippets: string[] expected";
                    }
                    if (message.methods != null && message.hasOwnProperty("methods")) {
                        if (!Array.isArray(message.methods))
                            return "methods: array expected";
                        for (var i = 0; i < message.methods.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Method.verify(message.methods[i]);
                            if (error)
                                return "methods." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a FunctionSet message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.FunctionSet
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.FunctionSet} FunctionSet
                 */
                FunctionSet.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.FunctionSet)
                        return object;
                    var message = new $root.vmw.pscoe.hints.FunctionSet();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.description != null)
                        message.description = String(object.description);
                    switch (object.stage) {
                    case "RELEASE":
                    case 0:
                        message.stage = 0;
                        break;
                    case "ALPHA":
                    case 1:
                        message.stage = 1;
                        break;
                    case "BETA":
                    case 2:
                        message.stage = 2;
                        break;
                    case "DEPRECATED":
                    case 3:
                        message.stage = 3;
                        break;
                    }
                    if (object.codeSnippets) {
                        if (!Array.isArray(object.codeSnippets))
                            throw TypeError(".vmw.pscoe.hints.FunctionSet.codeSnippets: array expected");
                        message.codeSnippets = [];
                        for (var i = 0; i < object.codeSnippets.length; ++i)
                            message.codeSnippets[i] = String(object.codeSnippets[i]);
                    }
                    if (object.methods) {
                        if (!Array.isArray(object.methods))
                            throw TypeError(".vmw.pscoe.hints.FunctionSet.methods: array expected");
                        message.methods = [];
                        for (var i = 0; i < object.methods.length; ++i) {
                            if (typeof object.methods[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.FunctionSet.methods: object expected");
                            message.methods[i] = $root.vmw.pscoe.hints.Method.fromObject(object.methods[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a FunctionSet message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.FunctionSet
                 * @static
                 * @param {vmw.pscoe.hints.FunctionSet} message FunctionSet
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                FunctionSet.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.codeSnippets = [];
                        object.methods = [];
                    }
                    if (options.defaults) {
                        object.name = "";
                        object.description = "";
                        object.stage = options.enums === String ? "RELEASE" : 0;
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.description != null && message.hasOwnProperty("description"))
                        object.description = message.description;
                    if (message.stage != null && message.hasOwnProperty("stage"))
                        object.stage = options.enums === String ? $root.vmw.pscoe.hints.ScriptingApi.Stage[message.stage] : message.stage;
                    if (message.codeSnippets && message.codeSnippets.length) {
                        object.codeSnippets = [];
                        for (var j = 0; j < message.codeSnippets.length; ++j)
                            object.codeSnippets[j] = message.codeSnippets[j];
                    }
                    if (message.methods && message.methods.length) {
                        object.methods = [];
                        for (var j = 0; j < message.methods.length; ++j)
                            object.methods[j] = $root.vmw.pscoe.hints.Method.toObject(message.methods[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this FunctionSet to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.FunctionSet
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                FunctionSet.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return FunctionSet;
            })();

            hints.Enumeration = (function() {

                /**
                 * Properties of an Enumeration.
                 * @memberof vmw.pscoe.hints
                 * @interface IEnumeration
                 * @property {string|null} [name] Enumeration name
                 * @property {string|null} [description] Enumeration description
                 * @property {vmw.pscoe.hints.ScriptingApi.Stage|null} [stage] Enumeration stage
                 * @property {Array.<vmw.pscoe.hints.Enumeration.IPossibleValue>|null} [possibleValues] Enumeration possibleValues
                 */

                /**
                 * Constructs a new Enumeration.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents an Enumeration.
                 * @implements IEnumeration
                 * @constructor
                 * @param {vmw.pscoe.hints.IEnumeration=} [properties] Properties to set
                 */
                function Enumeration(properties) {
                    this.possibleValues = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Enumeration name.
                 * @member {string} name
                 * @memberof vmw.pscoe.hints.Enumeration
                 * @instance
                 */
                Enumeration.prototype.name = "";

                /**
                 * Enumeration description.
                 * @member {string} description
                 * @memberof vmw.pscoe.hints.Enumeration
                 * @instance
                 */
                Enumeration.prototype.description = "";

                /**
                 * Enumeration stage.
                 * @member {vmw.pscoe.hints.ScriptingApi.Stage} stage
                 * @memberof vmw.pscoe.hints.Enumeration
                 * @instance
                 */
                Enumeration.prototype.stage = 0;

                /**
                 * Enumeration possibleValues.
                 * @member {Array.<vmw.pscoe.hints.Enumeration.IPossibleValue>} possibleValues
                 * @memberof vmw.pscoe.hints.Enumeration
                 * @instance
                 */
                Enumeration.prototype.possibleValues = $util.emptyArray;

                /**
                 * Creates a new Enumeration instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.Enumeration
                 * @static
                 * @param {vmw.pscoe.hints.IEnumeration=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.Enumeration} Enumeration instance
                 */
                Enumeration.create = function create(properties) {
                    return new Enumeration(properties);
                };

                /**
                 * Encodes the specified Enumeration message. Does not implicitly {@link vmw.pscoe.hints.Enumeration.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.Enumeration
                 * @static
                 * @param {vmw.pscoe.hints.IEnumeration} message Enumeration message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Enumeration.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
                    if (message.stage != null && Object.hasOwnProperty.call(message, "stage"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.stage);
                    if (message.possibleValues != null && message.possibleValues.length)
                        for (var i = 0; i < message.possibleValues.length; ++i)
                            $root.vmw.pscoe.hints.Enumeration.PossibleValue.encode(message.possibleValues[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Enumeration message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Enumeration.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.Enumeration
                 * @static
                 * @param {vmw.pscoe.hints.IEnumeration} message Enumeration message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Enumeration.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an Enumeration message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.Enumeration
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.Enumeration} Enumeration
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Enumeration.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.Enumeration();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.description = reader.string();
                            break;
                        case 3:
                            message.stage = reader.int32();
                            break;
                        case 4:
                            if (!(message.possibleValues && message.possibleValues.length))
                                message.possibleValues = [];
                            message.possibleValues.push($root.vmw.pscoe.hints.Enumeration.PossibleValue.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an Enumeration message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.Enumeration
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.Enumeration} Enumeration
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Enumeration.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an Enumeration message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.Enumeration
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Enumeration.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.description != null && message.hasOwnProperty("description"))
                        if (!$util.isString(message.description))
                            return "description: string expected";
                    if (message.stage != null && message.hasOwnProperty("stage"))
                        switch (message.stage) {
                        default:
                            return "stage: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            break;
                        }
                    if (message.possibleValues != null && message.hasOwnProperty("possibleValues")) {
                        if (!Array.isArray(message.possibleValues))
                            return "possibleValues: array expected";
                        for (var i = 0; i < message.possibleValues.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Enumeration.PossibleValue.verify(message.possibleValues[i]);
                            if (error)
                                return "possibleValues." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates an Enumeration message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.Enumeration
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.Enumeration} Enumeration
                 */
                Enumeration.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.Enumeration)
                        return object;
                    var message = new $root.vmw.pscoe.hints.Enumeration();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.description != null)
                        message.description = String(object.description);
                    switch (object.stage) {
                    case "RELEASE":
                    case 0:
                        message.stage = 0;
                        break;
                    case "ALPHA":
                    case 1:
                        message.stage = 1;
                        break;
                    case "BETA":
                    case 2:
                        message.stage = 2;
                        break;
                    case "DEPRECATED":
                    case 3:
                        message.stage = 3;
                        break;
                    }
                    if (object.possibleValues) {
                        if (!Array.isArray(object.possibleValues))
                            throw TypeError(".vmw.pscoe.hints.Enumeration.possibleValues: array expected");
                        message.possibleValues = [];
                        for (var i = 0; i < object.possibleValues.length; ++i) {
                            if (typeof object.possibleValues[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.Enumeration.possibleValues: object expected");
                            message.possibleValues[i] = $root.vmw.pscoe.hints.Enumeration.PossibleValue.fromObject(object.possibleValues[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from an Enumeration message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.Enumeration
                 * @static
                 * @param {vmw.pscoe.hints.Enumeration} message Enumeration
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Enumeration.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.possibleValues = [];
                    if (options.defaults) {
                        object.name = "";
                        object.description = "";
                        object.stage = options.enums === String ? "RELEASE" : 0;
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.description != null && message.hasOwnProperty("description"))
                        object.description = message.description;
                    if (message.stage != null && message.hasOwnProperty("stage"))
                        object.stage = options.enums === String ? $root.vmw.pscoe.hints.ScriptingApi.Stage[message.stage] : message.stage;
                    if (message.possibleValues && message.possibleValues.length) {
                        object.possibleValues = [];
                        for (var j = 0; j < message.possibleValues.length; ++j)
                            object.possibleValues[j] = $root.vmw.pscoe.hints.Enumeration.PossibleValue.toObject(message.possibleValues[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this Enumeration to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.Enumeration
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Enumeration.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                Enumeration.PossibleValue = (function() {

                    /**
                     * Properties of a PossibleValue.
                     * @memberof vmw.pscoe.hints.Enumeration
                     * @interface IPossibleValue
                     * @property {string|null} [name] PossibleValue name
                     * @property {string|null} [description] PossibleValue description
                     */

                    /**
                     * Constructs a new PossibleValue.
                     * @memberof vmw.pscoe.hints.Enumeration
                     * @classdesc Represents a PossibleValue.
                     * @implements IPossibleValue
                     * @constructor
                     * @param {vmw.pscoe.hints.Enumeration.IPossibleValue=} [properties] Properties to set
                     */
                    function PossibleValue(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * PossibleValue name.
                     * @member {string} name
                     * @memberof vmw.pscoe.hints.Enumeration.PossibleValue
                     * @instance
                     */
                    PossibleValue.prototype.name = "";

                    /**
                     * PossibleValue description.
                     * @member {string} description
                     * @memberof vmw.pscoe.hints.Enumeration.PossibleValue
                     * @instance
                     */
                    PossibleValue.prototype.description = "";

                    /**
                     * Creates a new PossibleValue instance using the specified properties.
                     * @function create
                     * @memberof vmw.pscoe.hints.Enumeration.PossibleValue
                     * @static
                     * @param {vmw.pscoe.hints.Enumeration.IPossibleValue=} [properties] Properties to set
                     * @returns {vmw.pscoe.hints.Enumeration.PossibleValue} PossibleValue instance
                     */
                    PossibleValue.create = function create(properties) {
                        return new PossibleValue(properties);
                    };

                    /**
                     * Encodes the specified PossibleValue message. Does not implicitly {@link vmw.pscoe.hints.Enumeration.PossibleValue.verify|verify} messages.
                     * @function encode
                     * @memberof vmw.pscoe.hints.Enumeration.PossibleValue
                     * @static
                     * @param {vmw.pscoe.hints.Enumeration.IPossibleValue} message PossibleValue message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PossibleValue.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                        if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
                        return writer;
                    };

                    /**
                     * Encodes the specified PossibleValue message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Enumeration.PossibleValue.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof vmw.pscoe.hints.Enumeration.PossibleValue
                     * @static
                     * @param {vmw.pscoe.hints.Enumeration.IPossibleValue} message PossibleValue message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PossibleValue.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a PossibleValue message from the specified reader or buffer.
                     * @function decode
                     * @memberof vmw.pscoe.hints.Enumeration.PossibleValue
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {vmw.pscoe.hints.Enumeration.PossibleValue} PossibleValue
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PossibleValue.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.Enumeration.PossibleValue();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.name = reader.string();
                                break;
                            case 2:
                                message.description = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a PossibleValue message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof vmw.pscoe.hints.Enumeration.PossibleValue
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {vmw.pscoe.hints.Enumeration.PossibleValue} PossibleValue
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PossibleValue.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a PossibleValue message.
                     * @function verify
                     * @memberof vmw.pscoe.hints.Enumeration.PossibleValue
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    PossibleValue.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.name != null && message.hasOwnProperty("name"))
                            if (!$util.isString(message.name))
                                return "name: string expected";
                        if (message.description != null && message.hasOwnProperty("description"))
                            if (!$util.isString(message.description))
                                return "description: string expected";
                        return null;
                    };

                    /**
                     * Creates a PossibleValue message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof vmw.pscoe.hints.Enumeration.PossibleValue
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {vmw.pscoe.hints.Enumeration.PossibleValue} PossibleValue
                     */
                    PossibleValue.fromObject = function fromObject(object) {
                        if (object instanceof $root.vmw.pscoe.hints.Enumeration.PossibleValue)
                            return object;
                        var message = new $root.vmw.pscoe.hints.Enumeration.PossibleValue();
                        if (object.name != null)
                            message.name = String(object.name);
                        if (object.description != null)
                            message.description = String(object.description);
                        return message;
                    };

                    /**
                     * Creates a plain object from a PossibleValue message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof vmw.pscoe.hints.Enumeration.PossibleValue
                     * @static
                     * @param {vmw.pscoe.hints.Enumeration.PossibleValue} message PossibleValue
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    PossibleValue.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.name = "";
                            object.description = "";
                        }
                        if (message.name != null && message.hasOwnProperty("name"))
                            object.name = message.name;
                        if (message.description != null && message.hasOwnProperty("description"))
                            object.description = message.description;
                        return object;
                    };

                    /**
                     * Converts this PossibleValue to JSON.
                     * @function toJSON
                     * @memberof vmw.pscoe.hints.Enumeration.PossibleValue
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    PossibleValue.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return PossibleValue;
                })();

                return Enumeration;
            })();

            hints.Primitive = (function() {

                /**
                 * Properties of a Primitive.
                 * @memberof vmw.pscoe.hints
                 * @interface IPrimitive
                 * @property {string|null} [name] Primitive name
                 * @property {string|null} [description] Primitive description
                 */

                /**
                 * Constructs a new Primitive.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents a Primitive.
                 * @implements IPrimitive
                 * @constructor
                 * @param {vmw.pscoe.hints.IPrimitive=} [properties] Properties to set
                 */
                function Primitive(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Primitive name.
                 * @member {string} name
                 * @memberof vmw.pscoe.hints.Primitive
                 * @instance
                 */
                Primitive.prototype.name = "";

                /**
                 * Primitive description.
                 * @member {string} description
                 * @memberof vmw.pscoe.hints.Primitive
                 * @instance
                 */
                Primitive.prototype.description = "";

                /**
                 * Creates a new Primitive instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.Primitive
                 * @static
                 * @param {vmw.pscoe.hints.IPrimitive=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.Primitive} Primitive instance
                 */
                Primitive.create = function create(properties) {
                    return new Primitive(properties);
                };

                /**
                 * Encodes the specified Primitive message. Does not implicitly {@link vmw.pscoe.hints.Primitive.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.Primitive
                 * @static
                 * @param {vmw.pscoe.hints.IPrimitive} message Primitive message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Primitive.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
                    return writer;
                };

                /**
                 * Encodes the specified Primitive message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Primitive.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.Primitive
                 * @static
                 * @param {vmw.pscoe.hints.IPrimitive} message Primitive message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Primitive.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Primitive message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.Primitive
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.Primitive} Primitive
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Primitive.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.Primitive();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.description = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Primitive message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.Primitive
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.Primitive} Primitive
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Primitive.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Primitive message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.Primitive
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Primitive.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.description != null && message.hasOwnProperty("description"))
                        if (!$util.isString(message.description))
                            return "description: string expected";
                    return null;
                };

                /**
                 * Creates a Primitive message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.Primitive
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.Primitive} Primitive
                 */
                Primitive.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.Primitive)
                        return object;
                    var message = new $root.vmw.pscoe.hints.Primitive();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.description != null)
                        message.description = String(object.description);
                    return message;
                };

                /**
                 * Creates a plain object from a Primitive message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.Primitive
                 * @static
                 * @param {vmw.pscoe.hints.Primitive} message Primitive
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Primitive.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.name = "";
                        object.description = "";
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.description != null && message.hasOwnProperty("description"))
                        object.description = message.description;
                    return object;
                };

                /**
                 * Converts this Primitive to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.Primitive
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Primitive.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Primitive;
            })();

            hints.Event = (function() {

                /**
                 * Properties of an Event.
                 * @memberof vmw.pscoe.hints
                 * @interface IEvent
                 * @property {string|null} [name] Event name
                 * @property {string|null} [description] Event description
                 * @property {vmw.pscoe.hints.ScriptingApi.Stage|null} [stage] Event stage
                 * @property {Array.<vmw.pscoe.hints.IExample>|null} [examples] Event examples
                 */

                /**
                 * Constructs a new Event.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents an Event.
                 * @implements IEvent
                 * @constructor
                 * @param {vmw.pscoe.hints.IEvent=} [properties] Properties to set
                 */
                function Event(properties) {
                    this.examples = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Event name.
                 * @member {string} name
                 * @memberof vmw.pscoe.hints.Event
                 * @instance
                 */
                Event.prototype.name = "";

                /**
                 * Event description.
                 * @member {string} description
                 * @memberof vmw.pscoe.hints.Event
                 * @instance
                 */
                Event.prototype.description = "";

                /**
                 * Event stage.
                 * @member {vmw.pscoe.hints.ScriptingApi.Stage} stage
                 * @memberof vmw.pscoe.hints.Event
                 * @instance
                 */
                Event.prototype.stage = 0;

                /**
                 * Event examples.
                 * @member {Array.<vmw.pscoe.hints.IExample>} examples
                 * @memberof vmw.pscoe.hints.Event
                 * @instance
                 */
                Event.prototype.examples = $util.emptyArray;

                /**
                 * Creates a new Event instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.Event
                 * @static
                 * @param {vmw.pscoe.hints.IEvent=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.Event} Event instance
                 */
                Event.create = function create(properties) {
                    return new Event(properties);
                };

                /**
                 * Encodes the specified Event message. Does not implicitly {@link vmw.pscoe.hints.Event.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.Event
                 * @static
                 * @param {vmw.pscoe.hints.IEvent} message Event message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Event.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
                    if (message.stage != null && Object.hasOwnProperty.call(message, "stage"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.stage);
                    if (message.examples != null && message.examples.length)
                        for (var i = 0; i < message.examples.length; ++i)
                            $root.vmw.pscoe.hints.Example.encode(message.examples[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Event message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Event.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.Event
                 * @static
                 * @param {vmw.pscoe.hints.IEvent} message Event message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Event.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an Event message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.Event
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.Event} Event
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Event.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.Event();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.description = reader.string();
                            break;
                        case 3:
                            message.stage = reader.int32();
                            break;
                        case 4:
                            if (!(message.examples && message.examples.length))
                                message.examples = [];
                            message.examples.push($root.vmw.pscoe.hints.Example.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an Event message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.Event
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.Event} Event
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Event.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an Event message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.Event
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Event.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.description != null && message.hasOwnProperty("description"))
                        if (!$util.isString(message.description))
                            return "description: string expected";
                    if (message.stage != null && message.hasOwnProperty("stage"))
                        switch (message.stage) {
                        default:
                            return "stage: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            break;
                        }
                    if (message.examples != null && message.hasOwnProperty("examples")) {
                        if (!Array.isArray(message.examples))
                            return "examples: array expected";
                        for (var i = 0; i < message.examples.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Example.verify(message.examples[i]);
                            if (error)
                                return "examples." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates an Event message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.Event
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.Event} Event
                 */
                Event.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.Event)
                        return object;
                    var message = new $root.vmw.pscoe.hints.Event();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.description != null)
                        message.description = String(object.description);
                    switch (object.stage) {
                    case "RELEASE":
                    case 0:
                        message.stage = 0;
                        break;
                    case "ALPHA":
                    case 1:
                        message.stage = 1;
                        break;
                    case "BETA":
                    case 2:
                        message.stage = 2;
                        break;
                    case "DEPRECATED":
                    case 3:
                        message.stage = 3;
                        break;
                    }
                    if (object.examples) {
                        if (!Array.isArray(object.examples))
                            throw TypeError(".vmw.pscoe.hints.Event.examples: array expected");
                        message.examples = [];
                        for (var i = 0; i < object.examples.length; ++i) {
                            if (typeof object.examples[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.Event.examples: object expected");
                            message.examples[i] = $root.vmw.pscoe.hints.Example.fromObject(object.examples[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from an Event message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.Event
                 * @static
                 * @param {vmw.pscoe.hints.Event} message Event
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Event.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.examples = [];
                    if (options.defaults) {
                        object.name = "";
                        object.description = "";
                        object.stage = options.enums === String ? "RELEASE" : 0;
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.description != null && message.hasOwnProperty("description"))
                        object.description = message.description;
                    if (message.stage != null && message.hasOwnProperty("stage"))
                        object.stage = options.enums === String ? $root.vmw.pscoe.hints.ScriptingApi.Stage[message.stage] : message.stage;
                    if (message.examples && message.examples.length) {
                        object.examples = [];
                        for (var j = 0; j < message.examples.length; ++j)
                            object.examples[j] = $root.vmw.pscoe.hints.Example.toObject(message.examples[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this Event to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.Event
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Event.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Event;
            })();

            hints.Property = (function() {

                /**
                 * Properties of a Property.
                 * @memberof vmw.pscoe.hints
                 * @interface IProperty
                 * @property {string|null} [name] Property name
                 * @property {string|null} [description] Property description
                 * @property {vmw.pscoe.hints.ScriptingApi.Stage|null} [stage] Property stage
                 * @property {boolean|null} [readOnly] Property readOnly
                 * @property {vmw.pscoe.hints.IReturnType|null} [returnType] Property returnType
                 * @property {Array.<vmw.pscoe.hints.IExample>|null} [examples] Property examples
                 */

                /**
                 * Constructs a new Property.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents a Property.
                 * @implements IProperty
                 * @constructor
                 * @param {vmw.pscoe.hints.IProperty=} [properties] Properties to set
                 */
                function Property(properties) {
                    this.examples = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Property name.
                 * @member {string} name
                 * @memberof vmw.pscoe.hints.Property
                 * @instance
                 */
                Property.prototype.name = "";

                /**
                 * Property description.
                 * @member {string} description
                 * @memberof vmw.pscoe.hints.Property
                 * @instance
                 */
                Property.prototype.description = "";

                /**
                 * Property stage.
                 * @member {vmw.pscoe.hints.ScriptingApi.Stage} stage
                 * @memberof vmw.pscoe.hints.Property
                 * @instance
                 */
                Property.prototype.stage = 0;

                /**
                 * Property readOnly.
                 * @member {boolean} readOnly
                 * @memberof vmw.pscoe.hints.Property
                 * @instance
                 */
                Property.prototype.readOnly = false;

                /**
                 * Property returnType.
                 * @member {vmw.pscoe.hints.IReturnType|null|undefined} returnType
                 * @memberof vmw.pscoe.hints.Property
                 * @instance
                 */
                Property.prototype.returnType = null;

                /**
                 * Property examples.
                 * @member {Array.<vmw.pscoe.hints.IExample>} examples
                 * @memberof vmw.pscoe.hints.Property
                 * @instance
                 */
                Property.prototype.examples = $util.emptyArray;

                /**
                 * Creates a new Property instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.Property
                 * @static
                 * @param {vmw.pscoe.hints.IProperty=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.Property} Property instance
                 */
                Property.create = function create(properties) {
                    return new Property(properties);
                };

                /**
                 * Encodes the specified Property message. Does not implicitly {@link vmw.pscoe.hints.Property.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.Property
                 * @static
                 * @param {vmw.pscoe.hints.IProperty} message Property message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Property.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
                    if (message.stage != null && Object.hasOwnProperty.call(message, "stage"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.stage);
                    if (message.readOnly != null && Object.hasOwnProperty.call(message, "readOnly"))
                        writer.uint32(/* id 4, wireType 0 =*/32).bool(message.readOnly);
                    if (message.returnType != null && Object.hasOwnProperty.call(message, "returnType"))
                        $root.vmw.pscoe.hints.ReturnType.encode(message.returnType, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                    if (message.examples != null && message.examples.length)
                        for (var i = 0; i < message.examples.length; ++i)
                            $root.vmw.pscoe.hints.Example.encode(message.examples[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Property message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Property.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.Property
                 * @static
                 * @param {vmw.pscoe.hints.IProperty} message Property message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Property.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Property message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.Property
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.Property} Property
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Property.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.Property();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.description = reader.string();
                            break;
                        case 3:
                            message.stage = reader.int32();
                            break;
                        case 4:
                            message.readOnly = reader.bool();
                            break;
                        case 5:
                            message.returnType = $root.vmw.pscoe.hints.ReturnType.decode(reader, reader.uint32());
                            break;
                        case 6:
                            if (!(message.examples && message.examples.length))
                                message.examples = [];
                            message.examples.push($root.vmw.pscoe.hints.Example.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Property message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.Property
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.Property} Property
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Property.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Property message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.Property
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Property.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.description != null && message.hasOwnProperty("description"))
                        if (!$util.isString(message.description))
                            return "description: string expected";
                    if (message.stage != null && message.hasOwnProperty("stage"))
                        switch (message.stage) {
                        default:
                            return "stage: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            break;
                        }
                    if (message.readOnly != null && message.hasOwnProperty("readOnly"))
                        if (typeof message.readOnly !== "boolean")
                            return "readOnly: boolean expected";
                    if (message.returnType != null && message.hasOwnProperty("returnType")) {
                        var error = $root.vmw.pscoe.hints.ReturnType.verify(message.returnType);
                        if (error)
                            return "returnType." + error;
                    }
                    if (message.examples != null && message.hasOwnProperty("examples")) {
                        if (!Array.isArray(message.examples))
                            return "examples: array expected";
                        for (var i = 0; i < message.examples.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Example.verify(message.examples[i]);
                            if (error)
                                return "examples." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a Property message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.Property
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.Property} Property
                 */
                Property.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.Property)
                        return object;
                    var message = new $root.vmw.pscoe.hints.Property();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.description != null)
                        message.description = String(object.description);
                    switch (object.stage) {
                    case "RELEASE":
                    case 0:
                        message.stage = 0;
                        break;
                    case "ALPHA":
                    case 1:
                        message.stage = 1;
                        break;
                    case "BETA":
                    case 2:
                        message.stage = 2;
                        break;
                    case "DEPRECATED":
                    case 3:
                        message.stage = 3;
                        break;
                    }
                    if (object.readOnly != null)
                        message.readOnly = Boolean(object.readOnly);
                    if (object.returnType != null) {
                        if (typeof object.returnType !== "object")
                            throw TypeError(".vmw.pscoe.hints.Property.returnType: object expected");
                        message.returnType = $root.vmw.pscoe.hints.ReturnType.fromObject(object.returnType);
                    }
                    if (object.examples) {
                        if (!Array.isArray(object.examples))
                            throw TypeError(".vmw.pscoe.hints.Property.examples: array expected");
                        message.examples = [];
                        for (var i = 0; i < object.examples.length; ++i) {
                            if (typeof object.examples[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.Property.examples: object expected");
                            message.examples[i] = $root.vmw.pscoe.hints.Example.fromObject(object.examples[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Property message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.Property
                 * @static
                 * @param {vmw.pscoe.hints.Property} message Property
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Property.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.examples = [];
                    if (options.defaults) {
                        object.name = "";
                        object.description = "";
                        object.stage = options.enums === String ? "RELEASE" : 0;
                        object.readOnly = false;
                        object.returnType = null;
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.description != null && message.hasOwnProperty("description"))
                        object.description = message.description;
                    if (message.stage != null && message.hasOwnProperty("stage"))
                        object.stage = options.enums === String ? $root.vmw.pscoe.hints.ScriptingApi.Stage[message.stage] : message.stage;
                    if (message.readOnly != null && message.hasOwnProperty("readOnly"))
                        object.readOnly = message.readOnly;
                    if (message.returnType != null && message.hasOwnProperty("returnType"))
                        object.returnType = $root.vmw.pscoe.hints.ReturnType.toObject(message.returnType, options);
                    if (message.examples && message.examples.length) {
                        object.examples = [];
                        for (var j = 0; j < message.examples.length; ++j)
                            object.examples[j] = $root.vmw.pscoe.hints.Example.toObject(message.examples[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this Property to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.Property
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Property.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Property;
            })();

            hints.Constructor = (function() {

                /**
                 * Properties of a Constructor.
                 * @memberof vmw.pscoe.hints
                 * @interface IConstructor
                 * @property {string|null} [description] Constructor description
                 * @property {vmw.pscoe.hints.ScriptingApi.Stage|null} [stage] Constructor stage
                 * @property {Array.<vmw.pscoe.hints.IParameter>|null} [parameters] Constructor parameters
                 * @property {Array.<vmw.pscoe.hints.IExample>|null} [examples] Constructor examples
                 */

                /**
                 * Constructs a new Constructor.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents a Constructor.
                 * @implements IConstructor
                 * @constructor
                 * @param {vmw.pscoe.hints.IConstructor=} [properties] Properties to set
                 */
                function Constructor(properties) {
                    this.parameters = [];
                    this.examples = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Constructor description.
                 * @member {string} description
                 * @memberof vmw.pscoe.hints.Constructor
                 * @instance
                 */
                Constructor.prototype.description = "";

                /**
                 * Constructor stage.
                 * @member {vmw.pscoe.hints.ScriptingApi.Stage} stage
                 * @memberof vmw.pscoe.hints.Constructor
                 * @instance
                 */
                Constructor.prototype.stage = 0;

                /**
                 * Constructor parameters.
                 * @member {Array.<vmw.pscoe.hints.IParameter>} parameters
                 * @memberof vmw.pscoe.hints.Constructor
                 * @instance
                 */
                Constructor.prototype.parameters = $util.emptyArray;

                /**
                 * Constructor examples.
                 * @member {Array.<vmw.pscoe.hints.IExample>} examples
                 * @memberof vmw.pscoe.hints.Constructor
                 * @instance
                 */
                Constructor.prototype.examples = $util.emptyArray;

                /**
                 * Creates a new Constructor instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.Constructor
                 * @static
                 * @param {vmw.pscoe.hints.IConstructor=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.Constructor} Constructor instance
                 */
                Constructor.create = function create(properties) {
                    return new Constructor(properties);
                };

                /**
                 * Encodes the specified Constructor message. Does not implicitly {@link vmw.pscoe.hints.Constructor.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.Constructor
                 * @static
                 * @param {vmw.pscoe.hints.IConstructor} message Constructor message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Constructor.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.description);
                    if (message.stage != null && Object.hasOwnProperty.call(message, "stage"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.stage);
                    if (message.parameters != null && message.parameters.length)
                        for (var i = 0; i < message.parameters.length; ++i)
                            $root.vmw.pscoe.hints.Parameter.encode(message.parameters[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    if (message.examples != null && message.examples.length)
                        for (var i = 0; i < message.examples.length; ++i)
                            $root.vmw.pscoe.hints.Example.encode(message.examples[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Constructor message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Constructor.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.Constructor
                 * @static
                 * @param {vmw.pscoe.hints.IConstructor} message Constructor message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Constructor.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Constructor message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.Constructor
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.Constructor} Constructor
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Constructor.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.Constructor();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.description = reader.string();
                            break;
                        case 2:
                            message.stage = reader.int32();
                            break;
                        case 3:
                            if (!(message.parameters && message.parameters.length))
                                message.parameters = [];
                            message.parameters.push($root.vmw.pscoe.hints.Parameter.decode(reader, reader.uint32()));
                            break;
                        case 4:
                            if (!(message.examples && message.examples.length))
                                message.examples = [];
                            message.examples.push($root.vmw.pscoe.hints.Example.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Constructor message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.Constructor
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.Constructor} Constructor
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Constructor.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Constructor message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.Constructor
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Constructor.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.description != null && message.hasOwnProperty("description"))
                        if (!$util.isString(message.description))
                            return "description: string expected";
                    if (message.stage != null && message.hasOwnProperty("stage"))
                        switch (message.stage) {
                        default:
                            return "stage: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            break;
                        }
                    if (message.parameters != null && message.hasOwnProperty("parameters")) {
                        if (!Array.isArray(message.parameters))
                            return "parameters: array expected";
                        for (var i = 0; i < message.parameters.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Parameter.verify(message.parameters[i]);
                            if (error)
                                return "parameters." + error;
                        }
                    }
                    if (message.examples != null && message.hasOwnProperty("examples")) {
                        if (!Array.isArray(message.examples))
                            return "examples: array expected";
                        for (var i = 0; i < message.examples.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Example.verify(message.examples[i]);
                            if (error)
                                return "examples." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a Constructor message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.Constructor
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.Constructor} Constructor
                 */
                Constructor.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.Constructor)
                        return object;
                    var message = new $root.vmw.pscoe.hints.Constructor();
                    if (object.description != null)
                        message.description = String(object.description);
                    switch (object.stage) {
                    case "RELEASE":
                    case 0:
                        message.stage = 0;
                        break;
                    case "ALPHA":
                    case 1:
                        message.stage = 1;
                        break;
                    case "BETA":
                    case 2:
                        message.stage = 2;
                        break;
                    case "DEPRECATED":
                    case 3:
                        message.stage = 3;
                        break;
                    }
                    if (object.parameters) {
                        if (!Array.isArray(object.parameters))
                            throw TypeError(".vmw.pscoe.hints.Constructor.parameters: array expected");
                        message.parameters = [];
                        for (var i = 0; i < object.parameters.length; ++i) {
                            if (typeof object.parameters[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.Constructor.parameters: object expected");
                            message.parameters[i] = $root.vmw.pscoe.hints.Parameter.fromObject(object.parameters[i]);
                        }
                    }
                    if (object.examples) {
                        if (!Array.isArray(object.examples))
                            throw TypeError(".vmw.pscoe.hints.Constructor.examples: array expected");
                        message.examples = [];
                        for (var i = 0; i < object.examples.length; ++i) {
                            if (typeof object.examples[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.Constructor.examples: object expected");
                            message.examples[i] = $root.vmw.pscoe.hints.Example.fromObject(object.examples[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Constructor message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.Constructor
                 * @static
                 * @param {vmw.pscoe.hints.Constructor} message Constructor
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Constructor.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.parameters = [];
                        object.examples = [];
                    }
                    if (options.defaults) {
                        object.description = "";
                        object.stage = options.enums === String ? "RELEASE" : 0;
                    }
                    if (message.description != null && message.hasOwnProperty("description"))
                        object.description = message.description;
                    if (message.stage != null && message.hasOwnProperty("stage"))
                        object.stage = options.enums === String ? $root.vmw.pscoe.hints.ScriptingApi.Stage[message.stage] : message.stage;
                    if (message.parameters && message.parameters.length) {
                        object.parameters = [];
                        for (var j = 0; j < message.parameters.length; ++j)
                            object.parameters[j] = $root.vmw.pscoe.hints.Parameter.toObject(message.parameters[j], options);
                    }
                    if (message.examples && message.examples.length) {
                        object.examples = [];
                        for (var j = 0; j < message.examples.length; ++j)
                            object.examples[j] = $root.vmw.pscoe.hints.Example.toObject(message.examples[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this Constructor to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.Constructor
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Constructor.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Constructor;
            })();

            hints.Method = (function() {

                /**
                 * Properties of a Method.
                 * @memberof vmw.pscoe.hints
                 * @interface IMethod
                 * @property {string|null} [name] Method name
                 * @property {string|null} [description] Method description
                 * @property {vmw.pscoe.hints.ScriptingApi.Stage|null} [stage] Method stage
                 * @property {Array.<vmw.pscoe.hints.IParameter>|null} [parameters] Method parameters
                 * @property {vmw.pscoe.hints.IReturnType|null} [returnType] Method returnType
                 * @property {Array.<vmw.pscoe.hints.IExample>|null} [examples] Method examples
                 */

                /**
                 * Constructs a new Method.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents a Method.
                 * @implements IMethod
                 * @constructor
                 * @param {vmw.pscoe.hints.IMethod=} [properties] Properties to set
                 */
                function Method(properties) {
                    this.parameters = [];
                    this.examples = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Method name.
                 * @member {string} name
                 * @memberof vmw.pscoe.hints.Method
                 * @instance
                 */
                Method.prototype.name = "";

                /**
                 * Method description.
                 * @member {string} description
                 * @memberof vmw.pscoe.hints.Method
                 * @instance
                 */
                Method.prototype.description = "";

                /**
                 * Method stage.
                 * @member {vmw.pscoe.hints.ScriptingApi.Stage} stage
                 * @memberof vmw.pscoe.hints.Method
                 * @instance
                 */
                Method.prototype.stage = 0;

                /**
                 * Method parameters.
                 * @member {Array.<vmw.pscoe.hints.IParameter>} parameters
                 * @memberof vmw.pscoe.hints.Method
                 * @instance
                 */
                Method.prototype.parameters = $util.emptyArray;

                /**
                 * Method returnType.
                 * @member {vmw.pscoe.hints.IReturnType|null|undefined} returnType
                 * @memberof vmw.pscoe.hints.Method
                 * @instance
                 */
                Method.prototype.returnType = null;

                /**
                 * Method examples.
                 * @member {Array.<vmw.pscoe.hints.IExample>} examples
                 * @memberof vmw.pscoe.hints.Method
                 * @instance
                 */
                Method.prototype.examples = $util.emptyArray;

                /**
                 * Creates a new Method instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.Method
                 * @static
                 * @param {vmw.pscoe.hints.IMethod=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.Method} Method instance
                 */
                Method.create = function create(properties) {
                    return new Method(properties);
                };

                /**
                 * Encodes the specified Method message. Does not implicitly {@link vmw.pscoe.hints.Method.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.Method
                 * @static
                 * @param {vmw.pscoe.hints.IMethod} message Method message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Method.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
                    if (message.stage != null && Object.hasOwnProperty.call(message, "stage"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.stage);
                    if (message.parameters != null && message.parameters.length)
                        for (var i = 0; i < message.parameters.length; ++i)
                            $root.vmw.pscoe.hints.Parameter.encode(message.parameters[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    if (message.returnType != null && Object.hasOwnProperty.call(message, "returnType"))
                        $root.vmw.pscoe.hints.ReturnType.encode(message.returnType, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                    if (message.examples != null && message.examples.length)
                        for (var i = 0; i < message.examples.length; ++i)
                            $root.vmw.pscoe.hints.Example.encode(message.examples[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Method message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Method.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.Method
                 * @static
                 * @param {vmw.pscoe.hints.IMethod} message Method message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Method.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Method message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.Method
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.Method} Method
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Method.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.Method();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.description = reader.string();
                            break;
                        case 3:
                            message.stage = reader.int32();
                            break;
                        case 4:
                            if (!(message.parameters && message.parameters.length))
                                message.parameters = [];
                            message.parameters.push($root.vmw.pscoe.hints.Parameter.decode(reader, reader.uint32()));
                            break;
                        case 5:
                            message.returnType = $root.vmw.pscoe.hints.ReturnType.decode(reader, reader.uint32());
                            break;
                        case 6:
                            if (!(message.examples && message.examples.length))
                                message.examples = [];
                            message.examples.push($root.vmw.pscoe.hints.Example.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Method message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.Method
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.Method} Method
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Method.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Method message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.Method
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Method.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.description != null && message.hasOwnProperty("description"))
                        if (!$util.isString(message.description))
                            return "description: string expected";
                    if (message.stage != null && message.hasOwnProperty("stage"))
                        switch (message.stage) {
                        default:
                            return "stage: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            break;
                        }
                    if (message.parameters != null && message.hasOwnProperty("parameters")) {
                        if (!Array.isArray(message.parameters))
                            return "parameters: array expected";
                        for (var i = 0; i < message.parameters.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Parameter.verify(message.parameters[i]);
                            if (error)
                                return "parameters." + error;
                        }
                    }
                    if (message.returnType != null && message.hasOwnProperty("returnType")) {
                        var error = $root.vmw.pscoe.hints.ReturnType.verify(message.returnType);
                        if (error)
                            return "returnType." + error;
                    }
                    if (message.examples != null && message.hasOwnProperty("examples")) {
                        if (!Array.isArray(message.examples))
                            return "examples: array expected";
                        for (var i = 0; i < message.examples.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Example.verify(message.examples[i]);
                            if (error)
                                return "examples." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a Method message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.Method
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.Method} Method
                 */
                Method.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.Method)
                        return object;
                    var message = new $root.vmw.pscoe.hints.Method();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.description != null)
                        message.description = String(object.description);
                    switch (object.stage) {
                    case "RELEASE":
                    case 0:
                        message.stage = 0;
                        break;
                    case "ALPHA":
                    case 1:
                        message.stage = 1;
                        break;
                    case "BETA":
                    case 2:
                        message.stage = 2;
                        break;
                    case "DEPRECATED":
                    case 3:
                        message.stage = 3;
                        break;
                    }
                    if (object.parameters) {
                        if (!Array.isArray(object.parameters))
                            throw TypeError(".vmw.pscoe.hints.Method.parameters: array expected");
                        message.parameters = [];
                        for (var i = 0; i < object.parameters.length; ++i) {
                            if (typeof object.parameters[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.Method.parameters: object expected");
                            message.parameters[i] = $root.vmw.pscoe.hints.Parameter.fromObject(object.parameters[i]);
                        }
                    }
                    if (object.returnType != null) {
                        if (typeof object.returnType !== "object")
                            throw TypeError(".vmw.pscoe.hints.Method.returnType: object expected");
                        message.returnType = $root.vmw.pscoe.hints.ReturnType.fromObject(object.returnType);
                    }
                    if (object.examples) {
                        if (!Array.isArray(object.examples))
                            throw TypeError(".vmw.pscoe.hints.Method.examples: array expected");
                        message.examples = [];
                        for (var i = 0; i < object.examples.length; ++i) {
                            if (typeof object.examples[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.Method.examples: object expected");
                            message.examples[i] = $root.vmw.pscoe.hints.Example.fromObject(object.examples[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Method message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.Method
                 * @static
                 * @param {vmw.pscoe.hints.Method} message Method
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Method.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.parameters = [];
                        object.examples = [];
                    }
                    if (options.defaults) {
                        object.name = "";
                        object.description = "";
                        object.stage = options.enums === String ? "RELEASE" : 0;
                        object.returnType = null;
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.description != null && message.hasOwnProperty("description"))
                        object.description = message.description;
                    if (message.stage != null && message.hasOwnProperty("stage"))
                        object.stage = options.enums === String ? $root.vmw.pscoe.hints.ScriptingApi.Stage[message.stage] : message.stage;
                    if (message.parameters && message.parameters.length) {
                        object.parameters = [];
                        for (var j = 0; j < message.parameters.length; ++j)
                            object.parameters[j] = $root.vmw.pscoe.hints.Parameter.toObject(message.parameters[j], options);
                    }
                    if (message.returnType != null && message.hasOwnProperty("returnType"))
                        object.returnType = $root.vmw.pscoe.hints.ReturnType.toObject(message.returnType, options);
                    if (message.examples && message.examples.length) {
                        object.examples = [];
                        for (var j = 0; j < message.examples.length; ++j)
                            object.examples[j] = $root.vmw.pscoe.hints.Example.toObject(message.examples[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this Method to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.Method
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Method.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Method;
            })();

            hints.ReturnType = (function() {

                /**
                 * Properties of a ReturnType.
                 * @memberof vmw.pscoe.hints
                 * @interface IReturnType
                 * @property {string|null} [type] ReturnType type
                 * @property {string|null} [description] ReturnType description
                 * @property {string|null} [enumeration] ReturnType enumeration
                 */

                /**
                 * Constructs a new ReturnType.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents a ReturnType.
                 * @implements IReturnType
                 * @constructor
                 * @param {vmw.pscoe.hints.IReturnType=} [properties] Properties to set
                 */
                function ReturnType(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ReturnType type.
                 * @member {string} type
                 * @memberof vmw.pscoe.hints.ReturnType
                 * @instance
                 */
                ReturnType.prototype.type = "";

                /**
                 * ReturnType description.
                 * @member {string} description
                 * @memberof vmw.pscoe.hints.ReturnType
                 * @instance
                 */
                ReturnType.prototype.description = "";

                /**
                 * ReturnType enumeration.
                 * @member {string} enumeration
                 * @memberof vmw.pscoe.hints.ReturnType
                 * @instance
                 */
                ReturnType.prototype.enumeration = "";

                /**
                 * Creates a new ReturnType instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.ReturnType
                 * @static
                 * @param {vmw.pscoe.hints.IReturnType=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.ReturnType} ReturnType instance
                 */
                ReturnType.create = function create(properties) {
                    return new ReturnType(properties);
                };

                /**
                 * Encodes the specified ReturnType message. Does not implicitly {@link vmw.pscoe.hints.ReturnType.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.ReturnType
                 * @static
                 * @param {vmw.pscoe.hints.IReturnType} message ReturnType message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ReturnType.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.type);
                    if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
                    if (message.enumeration != null && Object.hasOwnProperty.call(message, "enumeration"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.enumeration);
                    return writer;
                };

                /**
                 * Encodes the specified ReturnType message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ReturnType.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.ReturnType
                 * @static
                 * @param {vmw.pscoe.hints.IReturnType} message ReturnType message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ReturnType.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ReturnType message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.ReturnType
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.ReturnType} ReturnType
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ReturnType.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.ReturnType();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.type = reader.string();
                            break;
                        case 2:
                            message.description = reader.string();
                            break;
                        case 3:
                            message.enumeration = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ReturnType message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.ReturnType
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.ReturnType} ReturnType
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ReturnType.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ReturnType message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.ReturnType
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ReturnType.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.type != null && message.hasOwnProperty("type"))
                        if (!$util.isString(message.type))
                            return "type: string expected";
                    if (message.description != null && message.hasOwnProperty("description"))
                        if (!$util.isString(message.description))
                            return "description: string expected";
                    if (message.enumeration != null && message.hasOwnProperty("enumeration"))
                        if (!$util.isString(message.enumeration))
                            return "enumeration: string expected";
                    return null;
                };

                /**
                 * Creates a ReturnType message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.ReturnType
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.ReturnType} ReturnType
                 */
                ReturnType.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.ReturnType)
                        return object;
                    var message = new $root.vmw.pscoe.hints.ReturnType();
                    if (object.type != null)
                        message.type = String(object.type);
                    if (object.description != null)
                        message.description = String(object.description);
                    if (object.enumeration != null)
                        message.enumeration = String(object.enumeration);
                    return message;
                };

                /**
                 * Creates a plain object from a ReturnType message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.ReturnType
                 * @static
                 * @param {vmw.pscoe.hints.ReturnType} message ReturnType
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ReturnType.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.type = "";
                        object.description = "";
                        object.enumeration = "";
                    }
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = message.type;
                    if (message.description != null && message.hasOwnProperty("description"))
                        object.description = message.description;
                    if (message.enumeration != null && message.hasOwnProperty("enumeration"))
                        object.enumeration = message.enumeration;
                    return object;
                };

                /**
                 * Converts this ReturnType to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.ReturnType
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ReturnType.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ReturnType;
            })();

            hints.Parameter = (function() {

                /**
                 * Properties of a Parameter.
                 * @memberof vmw.pscoe.hints
                 * @interface IParameter
                 * @property {string|null} [name] Parameter name
                 * @property {string|null} [type] Parameter type
                 * @property {string|null} [description] Parameter description
                 * @property {string|null} [enumeration] Parameter enumeration
                 */

                /**
                 * Constructs a new Parameter.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents a Parameter.
                 * @implements IParameter
                 * @constructor
                 * @param {vmw.pscoe.hints.IParameter=} [properties] Properties to set
                 */
                function Parameter(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Parameter name.
                 * @member {string} name
                 * @memberof vmw.pscoe.hints.Parameter
                 * @instance
                 */
                Parameter.prototype.name = "";

                /**
                 * Parameter type.
                 * @member {string} type
                 * @memberof vmw.pscoe.hints.Parameter
                 * @instance
                 */
                Parameter.prototype.type = "";

                /**
                 * Parameter description.
                 * @member {string} description
                 * @memberof vmw.pscoe.hints.Parameter
                 * @instance
                 */
                Parameter.prototype.description = "";

                /**
                 * Parameter enumeration.
                 * @member {string} enumeration
                 * @memberof vmw.pscoe.hints.Parameter
                 * @instance
                 */
                Parameter.prototype.enumeration = "";

                /**
                 * Creates a new Parameter instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.Parameter
                 * @static
                 * @param {vmw.pscoe.hints.IParameter=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.Parameter} Parameter instance
                 */
                Parameter.create = function create(properties) {
                    return new Parameter(properties);
                };

                /**
                 * Encodes the specified Parameter message. Does not implicitly {@link vmw.pscoe.hints.Parameter.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.Parameter
                 * @static
                 * @param {vmw.pscoe.hints.IParameter} message Parameter message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Parameter.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.type);
                    if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.description);
                    if (message.enumeration != null && Object.hasOwnProperty.call(message, "enumeration"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.enumeration);
                    return writer;
                };

                /**
                 * Encodes the specified Parameter message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Parameter.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.Parameter
                 * @static
                 * @param {vmw.pscoe.hints.IParameter} message Parameter message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Parameter.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Parameter message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.Parameter
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.Parameter} Parameter
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Parameter.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.Parameter();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.type = reader.string();
                            break;
                        case 3:
                            message.description = reader.string();
                            break;
                        case 4:
                            message.enumeration = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Parameter message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.Parameter
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.Parameter} Parameter
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Parameter.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Parameter message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.Parameter
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Parameter.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.type != null && message.hasOwnProperty("type"))
                        if (!$util.isString(message.type))
                            return "type: string expected";
                    if (message.description != null && message.hasOwnProperty("description"))
                        if (!$util.isString(message.description))
                            return "description: string expected";
                    if (message.enumeration != null && message.hasOwnProperty("enumeration"))
                        if (!$util.isString(message.enumeration))
                            return "enumeration: string expected";
                    return null;
                };

                /**
                 * Creates a Parameter message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.Parameter
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.Parameter} Parameter
                 */
                Parameter.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.Parameter)
                        return object;
                    var message = new $root.vmw.pscoe.hints.Parameter();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.type != null)
                        message.type = String(object.type);
                    if (object.description != null)
                        message.description = String(object.description);
                    if (object.enumeration != null)
                        message.enumeration = String(object.enumeration);
                    return message;
                };

                /**
                 * Creates a plain object from a Parameter message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.Parameter
                 * @static
                 * @param {vmw.pscoe.hints.Parameter} message Parameter
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Parameter.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.name = "";
                        object.type = "";
                        object.description = "";
                        object.enumeration = "";
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = message.type;
                    if (message.description != null && message.hasOwnProperty("description"))
                        object.description = message.description;
                    if (message.enumeration != null && message.hasOwnProperty("enumeration"))
                        object.enumeration = message.enumeration;
                    return object;
                };

                /**
                 * Converts this Parameter to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.Parameter
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Parameter.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Parameter;
            })();

            hints.Example = (function() {

                /**
                 * Properties of an Example.
                 * @memberof vmw.pscoe.hints
                 * @interface IExample
                 * @property {string|null} [description] Example description
                 * @property {string|null} [codeSnippet] Example codeSnippet
                 */

                /**
                 * Constructs a new Example.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents an Example.
                 * @implements IExample
                 * @constructor
                 * @param {vmw.pscoe.hints.IExample=} [properties] Properties to set
                 */
                function Example(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Example description.
                 * @member {string} description
                 * @memberof vmw.pscoe.hints.Example
                 * @instance
                 */
                Example.prototype.description = "";

                /**
                 * Example codeSnippet.
                 * @member {string} codeSnippet
                 * @memberof vmw.pscoe.hints.Example
                 * @instance
                 */
                Example.prototype.codeSnippet = "";

                /**
                 * Creates a new Example instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.Example
                 * @static
                 * @param {vmw.pscoe.hints.IExample=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.Example} Example instance
                 */
                Example.create = function create(properties) {
                    return new Example(properties);
                };

                /**
                 * Encodes the specified Example message. Does not implicitly {@link vmw.pscoe.hints.Example.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.Example
                 * @static
                 * @param {vmw.pscoe.hints.IExample} message Example message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Example.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.description);
                    if (message.codeSnippet != null && Object.hasOwnProperty.call(message, "codeSnippet"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.codeSnippet);
                    return writer;
                };

                /**
                 * Encodes the specified Example message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Example.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.Example
                 * @static
                 * @param {vmw.pscoe.hints.IExample} message Example message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Example.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an Example message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.Example
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.Example} Example
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Example.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.Example();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.description = reader.string();
                            break;
                        case 2:
                            message.codeSnippet = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an Example message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.Example
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.Example} Example
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Example.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an Example message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.Example
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Example.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.description != null && message.hasOwnProperty("description"))
                        if (!$util.isString(message.description))
                            return "description: string expected";
                    if (message.codeSnippet != null && message.hasOwnProperty("codeSnippet"))
                        if (!$util.isString(message.codeSnippet))
                            return "codeSnippet: string expected";
                    return null;
                };

                /**
                 * Creates an Example message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.Example
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.Example} Example
                 */
                Example.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.Example)
                        return object;
                    var message = new $root.vmw.pscoe.hints.Example();
                    if (object.description != null)
                        message.description = String(object.description);
                    if (object.codeSnippet != null)
                        message.codeSnippet = String(object.codeSnippet);
                    return message;
                };

                /**
                 * Creates a plain object from an Example message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.Example
                 * @static
                 * @param {vmw.pscoe.hints.Example} message Example
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Example.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.description = "";
                        object.codeSnippet = "";
                    }
                    if (message.description != null && message.hasOwnProperty("description"))
                        object.description = message.description;
                    if (message.codeSnippet != null && message.hasOwnProperty("codeSnippet"))
                        object.codeSnippet = message.codeSnippet;
                    return object;
                };

                /**
                 * Converts this Example to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.Example
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Example.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Example;
            })();

            hints.ScriptingApiPack = (function() {

                /**
                 * Properties of a ScriptingApiPack.
                 * @memberof vmw.pscoe.hints
                 * @interface IScriptingApiPack
                 * @property {number|null} [version] ScriptingApiPack version
                 * @property {string|null} [uuid] ScriptingApiPack uuid
                 * @property {vmw.pscoe.hints.ScriptingApiPack.IMetadata|null} [metadata] ScriptingApiPack metadata
                 * @property {Array.<vmw.pscoe.hints.IClass>|null} [classes] ScriptingApiPack classes
                 * @property {Array.<vmw.pscoe.hints.IType>|null} [types] ScriptingApiPack types
                 * @property {Array.<vmw.pscoe.hints.IFunctionSet>|null} [functionSets] ScriptingApiPack functionSets
                 * @property {Array.<vmw.pscoe.hints.IPrimitive>|null} [primitives] ScriptingApiPack primitives
                 * @property {Array.<vmw.pscoe.hints.IEnumeration>|null} [enums] ScriptingApiPack enums
                 */

                /**
                 * Constructs a new ScriptingApiPack.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents a ScriptingApiPack.
                 * @implements IScriptingApiPack
                 * @constructor
                 * @param {vmw.pscoe.hints.IScriptingApiPack=} [properties] Properties to set
                 */
                function ScriptingApiPack(properties) {
                    this.classes = [];
                    this.types = [];
                    this.functionSets = [];
                    this.primitives = [];
                    this.enums = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ScriptingApiPack version.
                 * @member {number} version
                 * @memberof vmw.pscoe.hints.ScriptingApiPack
                 * @instance
                 */
                ScriptingApiPack.prototype.version = 0;

                /**
                 * ScriptingApiPack uuid.
                 * @member {string} uuid
                 * @memberof vmw.pscoe.hints.ScriptingApiPack
                 * @instance
                 */
                ScriptingApiPack.prototype.uuid = "";

                /**
                 * ScriptingApiPack metadata.
                 * @member {vmw.pscoe.hints.ScriptingApiPack.IMetadata|null|undefined} metadata
                 * @memberof vmw.pscoe.hints.ScriptingApiPack
                 * @instance
                 */
                ScriptingApiPack.prototype.metadata = null;

                /**
                 * ScriptingApiPack classes.
                 * @member {Array.<vmw.pscoe.hints.IClass>} classes
                 * @memberof vmw.pscoe.hints.ScriptingApiPack
                 * @instance
                 */
                ScriptingApiPack.prototype.classes = $util.emptyArray;

                /**
                 * ScriptingApiPack types.
                 * @member {Array.<vmw.pscoe.hints.IType>} types
                 * @memberof vmw.pscoe.hints.ScriptingApiPack
                 * @instance
                 */
                ScriptingApiPack.prototype.types = $util.emptyArray;

                /**
                 * ScriptingApiPack functionSets.
                 * @member {Array.<vmw.pscoe.hints.IFunctionSet>} functionSets
                 * @memberof vmw.pscoe.hints.ScriptingApiPack
                 * @instance
                 */
                ScriptingApiPack.prototype.functionSets = $util.emptyArray;

                /**
                 * ScriptingApiPack primitives.
                 * @member {Array.<vmw.pscoe.hints.IPrimitive>} primitives
                 * @memberof vmw.pscoe.hints.ScriptingApiPack
                 * @instance
                 */
                ScriptingApiPack.prototype.primitives = $util.emptyArray;

                /**
                 * ScriptingApiPack enums.
                 * @member {Array.<vmw.pscoe.hints.IEnumeration>} enums
                 * @memberof vmw.pscoe.hints.ScriptingApiPack
                 * @instance
                 */
                ScriptingApiPack.prototype.enums = $util.emptyArray;

                /**
                 * Creates a new ScriptingApiPack instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.ScriptingApiPack
                 * @static
                 * @param {vmw.pscoe.hints.IScriptingApiPack=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.ScriptingApiPack} ScriptingApiPack instance
                 */
                ScriptingApiPack.create = function create(properties) {
                    return new ScriptingApiPack(properties);
                };

                /**
                 * Encodes the specified ScriptingApiPack message. Does not implicitly {@link vmw.pscoe.hints.ScriptingApiPack.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.ScriptingApiPack
                 * @static
                 * @param {vmw.pscoe.hints.IScriptingApiPack} message ScriptingApiPack message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ScriptingApiPack.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.version);
                    if (message.uuid != null && Object.hasOwnProperty.call(message, "uuid"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.uuid);
                    if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                        $root.vmw.pscoe.hints.ScriptingApiPack.Metadata.encode(message.metadata, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    if (message.classes != null && message.classes.length)
                        for (var i = 0; i < message.classes.length; ++i)
                            $root.vmw.pscoe.hints.Class.encode(message.classes[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    if (message.types != null && message.types.length)
                        for (var i = 0; i < message.types.length; ++i)
                            $root.vmw.pscoe.hints.Type.encode(message.types[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                    if (message.functionSets != null && message.functionSets.length)
                        for (var i = 0; i < message.functionSets.length; ++i)
                            $root.vmw.pscoe.hints.FunctionSet.encode(message.functionSets[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                    if (message.primitives != null && message.primitives.length)
                        for (var i = 0; i < message.primitives.length; ++i)
                            $root.vmw.pscoe.hints.Primitive.encode(message.primitives[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                    if (message.enums != null && message.enums.length)
                        for (var i = 0; i < message.enums.length; ++i)
                            $root.vmw.pscoe.hints.Enumeration.encode(message.enums[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified ScriptingApiPack message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ScriptingApiPack.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.ScriptingApiPack
                 * @static
                 * @param {vmw.pscoe.hints.IScriptingApiPack} message ScriptingApiPack message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ScriptingApiPack.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ScriptingApiPack message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.ScriptingApiPack
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.ScriptingApiPack} ScriptingApiPack
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ScriptingApiPack.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.ScriptingApiPack();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.version = reader.uint32();
                            break;
                        case 2:
                            message.uuid = reader.string();
                            break;
                        case 3:
                            message.metadata = $root.vmw.pscoe.hints.ScriptingApiPack.Metadata.decode(reader, reader.uint32());
                            break;
                        case 4:
                            if (!(message.classes && message.classes.length))
                                message.classes = [];
                            message.classes.push($root.vmw.pscoe.hints.Class.decode(reader, reader.uint32()));
                            break;
                        case 5:
                            if (!(message.types && message.types.length))
                                message.types = [];
                            message.types.push($root.vmw.pscoe.hints.Type.decode(reader, reader.uint32()));
                            break;
                        case 6:
                            if (!(message.functionSets && message.functionSets.length))
                                message.functionSets = [];
                            message.functionSets.push($root.vmw.pscoe.hints.FunctionSet.decode(reader, reader.uint32()));
                            break;
                        case 7:
                            if (!(message.primitives && message.primitives.length))
                                message.primitives = [];
                            message.primitives.push($root.vmw.pscoe.hints.Primitive.decode(reader, reader.uint32()));
                            break;
                        case 8:
                            if (!(message.enums && message.enums.length))
                                message.enums = [];
                            message.enums.push($root.vmw.pscoe.hints.Enumeration.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ScriptingApiPack message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.ScriptingApiPack
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.ScriptingApiPack} ScriptingApiPack
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ScriptingApiPack.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ScriptingApiPack message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.ScriptingApiPack
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ScriptingApiPack.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.version != null && message.hasOwnProperty("version"))
                        if (!$util.isInteger(message.version))
                            return "version: integer expected";
                    if (message.uuid != null && message.hasOwnProperty("uuid"))
                        if (!$util.isString(message.uuid))
                            return "uuid: string expected";
                    if (message.metadata != null && message.hasOwnProperty("metadata")) {
                        var error = $root.vmw.pscoe.hints.ScriptingApiPack.Metadata.verify(message.metadata);
                        if (error)
                            return "metadata." + error;
                    }
                    if (message.classes != null && message.hasOwnProperty("classes")) {
                        if (!Array.isArray(message.classes))
                            return "classes: array expected";
                        for (var i = 0; i < message.classes.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Class.verify(message.classes[i]);
                            if (error)
                                return "classes." + error;
                        }
                    }
                    if (message.types != null && message.hasOwnProperty("types")) {
                        if (!Array.isArray(message.types))
                            return "types: array expected";
                        for (var i = 0; i < message.types.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Type.verify(message.types[i]);
                            if (error)
                                return "types." + error;
                        }
                    }
                    if (message.functionSets != null && message.hasOwnProperty("functionSets")) {
                        if (!Array.isArray(message.functionSets))
                            return "functionSets: array expected";
                        for (var i = 0; i < message.functionSets.length; ++i) {
                            var error = $root.vmw.pscoe.hints.FunctionSet.verify(message.functionSets[i]);
                            if (error)
                                return "functionSets." + error;
                        }
                    }
                    if (message.primitives != null && message.hasOwnProperty("primitives")) {
                        if (!Array.isArray(message.primitives))
                            return "primitives: array expected";
                        for (var i = 0; i < message.primitives.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Primitive.verify(message.primitives[i]);
                            if (error)
                                return "primitives." + error;
                        }
                    }
                    if (message.enums != null && message.hasOwnProperty("enums")) {
                        if (!Array.isArray(message.enums))
                            return "enums: array expected";
                        for (var i = 0; i < message.enums.length; ++i) {
                            var error = $root.vmw.pscoe.hints.Enumeration.verify(message.enums[i]);
                            if (error)
                                return "enums." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a ScriptingApiPack message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.ScriptingApiPack
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.ScriptingApiPack} ScriptingApiPack
                 */
                ScriptingApiPack.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.ScriptingApiPack)
                        return object;
                    var message = new $root.vmw.pscoe.hints.ScriptingApiPack();
                    if (object.version != null)
                        message.version = object.version >>> 0;
                    if (object.uuid != null)
                        message.uuid = String(object.uuid);
                    if (object.metadata != null) {
                        if (typeof object.metadata !== "object")
                            throw TypeError(".vmw.pscoe.hints.ScriptingApiPack.metadata: object expected");
                        message.metadata = $root.vmw.pscoe.hints.ScriptingApiPack.Metadata.fromObject(object.metadata);
                    }
                    if (object.classes) {
                        if (!Array.isArray(object.classes))
                            throw TypeError(".vmw.pscoe.hints.ScriptingApiPack.classes: array expected");
                        message.classes = [];
                        for (var i = 0; i < object.classes.length; ++i) {
                            if (typeof object.classes[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.ScriptingApiPack.classes: object expected");
                            message.classes[i] = $root.vmw.pscoe.hints.Class.fromObject(object.classes[i]);
                        }
                    }
                    if (object.types) {
                        if (!Array.isArray(object.types))
                            throw TypeError(".vmw.pscoe.hints.ScriptingApiPack.types: array expected");
                        message.types = [];
                        for (var i = 0; i < object.types.length; ++i) {
                            if (typeof object.types[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.ScriptingApiPack.types: object expected");
                            message.types[i] = $root.vmw.pscoe.hints.Type.fromObject(object.types[i]);
                        }
                    }
                    if (object.functionSets) {
                        if (!Array.isArray(object.functionSets))
                            throw TypeError(".vmw.pscoe.hints.ScriptingApiPack.functionSets: array expected");
                        message.functionSets = [];
                        for (var i = 0; i < object.functionSets.length; ++i) {
                            if (typeof object.functionSets[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.ScriptingApiPack.functionSets: object expected");
                            message.functionSets[i] = $root.vmw.pscoe.hints.FunctionSet.fromObject(object.functionSets[i]);
                        }
                    }
                    if (object.primitives) {
                        if (!Array.isArray(object.primitives))
                            throw TypeError(".vmw.pscoe.hints.ScriptingApiPack.primitives: array expected");
                        message.primitives = [];
                        for (var i = 0; i < object.primitives.length; ++i) {
                            if (typeof object.primitives[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.ScriptingApiPack.primitives: object expected");
                            message.primitives[i] = $root.vmw.pscoe.hints.Primitive.fromObject(object.primitives[i]);
                        }
                    }
                    if (object.enums) {
                        if (!Array.isArray(object.enums))
                            throw TypeError(".vmw.pscoe.hints.ScriptingApiPack.enums: array expected");
                        message.enums = [];
                        for (var i = 0; i < object.enums.length; ++i) {
                            if (typeof object.enums[i] !== "object")
                                throw TypeError(".vmw.pscoe.hints.ScriptingApiPack.enums: object expected");
                            message.enums[i] = $root.vmw.pscoe.hints.Enumeration.fromObject(object.enums[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a ScriptingApiPack message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.ScriptingApiPack
                 * @static
                 * @param {vmw.pscoe.hints.ScriptingApiPack} message ScriptingApiPack
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ScriptingApiPack.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.classes = [];
                        object.types = [];
                        object.functionSets = [];
                        object.primitives = [];
                        object.enums = [];
                    }
                    if (options.defaults) {
                        object.version = 0;
                        object.uuid = "";
                        object.metadata = null;
                    }
                    if (message.version != null && message.hasOwnProperty("version"))
                        object.version = message.version;
                    if (message.uuid != null && message.hasOwnProperty("uuid"))
                        object.uuid = message.uuid;
                    if (message.metadata != null && message.hasOwnProperty("metadata"))
                        object.metadata = $root.vmw.pscoe.hints.ScriptingApiPack.Metadata.toObject(message.metadata, options);
                    if (message.classes && message.classes.length) {
                        object.classes = [];
                        for (var j = 0; j < message.classes.length; ++j)
                            object.classes[j] = $root.vmw.pscoe.hints.Class.toObject(message.classes[j], options);
                    }
                    if (message.types && message.types.length) {
                        object.types = [];
                        for (var j = 0; j < message.types.length; ++j)
                            object.types[j] = $root.vmw.pscoe.hints.Type.toObject(message.types[j], options);
                    }
                    if (message.functionSets && message.functionSets.length) {
                        object.functionSets = [];
                        for (var j = 0; j < message.functionSets.length; ++j)
                            object.functionSets[j] = $root.vmw.pscoe.hints.FunctionSet.toObject(message.functionSets[j], options);
                    }
                    if (message.primitives && message.primitives.length) {
                        object.primitives = [];
                        for (var j = 0; j < message.primitives.length; ++j)
                            object.primitives[j] = $root.vmw.pscoe.hints.Primitive.toObject(message.primitives[j], options);
                    }
                    if (message.enums && message.enums.length) {
                        object.enums = [];
                        for (var j = 0; j < message.enums.length; ++j)
                            object.enums[j] = $root.vmw.pscoe.hints.Enumeration.toObject(message.enums[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this ScriptingApiPack to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.ScriptingApiPack
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ScriptingApiPack.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                ScriptingApiPack.Metadata = (function() {

                    /**
                     * Properties of a Metadata.
                     * @memberof vmw.pscoe.hints.ScriptingApiPack
                     * @interface IMetadata
                     * @property {number|Long|null} [timestamp] Metadata timestamp
                     * @property {string|null} [serverName] Metadata serverName
                     * @property {string|null} [serverVersion] Metadata serverVersion
                     * @property {string|null} [moduleName] Metadata moduleName
                     * @property {string|null} [moduleVersion] Metadata moduleVersion
                     * @property {string|null} [hintingVersion] Metadata hintingVersion
                     */

                    /**
                     * Constructs a new Metadata.
                     * @memberof vmw.pscoe.hints.ScriptingApiPack
                     * @classdesc Represents a Metadata.
                     * @implements IMetadata
                     * @constructor
                     * @param {vmw.pscoe.hints.ScriptingApiPack.IMetadata=} [properties] Properties to set
                     */
                    function Metadata(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Metadata timestamp.
                     * @member {number|Long} timestamp
                     * @memberof vmw.pscoe.hints.ScriptingApiPack.Metadata
                     * @instance
                     */
                    Metadata.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * Metadata serverName.
                     * @member {string} serverName
                     * @memberof vmw.pscoe.hints.ScriptingApiPack.Metadata
                     * @instance
                     */
                    Metadata.prototype.serverName = "";

                    /**
                     * Metadata serverVersion.
                     * @member {string} serverVersion
                     * @memberof vmw.pscoe.hints.ScriptingApiPack.Metadata
                     * @instance
                     */
                    Metadata.prototype.serverVersion = "";

                    /**
                     * Metadata moduleName.
                     * @member {string} moduleName
                     * @memberof vmw.pscoe.hints.ScriptingApiPack.Metadata
                     * @instance
                     */
                    Metadata.prototype.moduleName = "";

                    /**
                     * Metadata moduleVersion.
                     * @member {string} moduleVersion
                     * @memberof vmw.pscoe.hints.ScriptingApiPack.Metadata
                     * @instance
                     */
                    Metadata.prototype.moduleVersion = "";

                    /**
                     * Metadata hintingVersion.
                     * @member {string} hintingVersion
                     * @memberof vmw.pscoe.hints.ScriptingApiPack.Metadata
                     * @instance
                     */
                    Metadata.prototype.hintingVersion = "";

                    /**
                     * Creates a new Metadata instance using the specified properties.
                     * @function create
                     * @memberof vmw.pscoe.hints.ScriptingApiPack.Metadata
                     * @static
                     * @param {vmw.pscoe.hints.ScriptingApiPack.IMetadata=} [properties] Properties to set
                     * @returns {vmw.pscoe.hints.ScriptingApiPack.Metadata} Metadata instance
                     */
                    Metadata.create = function create(properties) {
                        return new Metadata(properties);
                    };

                    /**
                     * Encodes the specified Metadata message. Does not implicitly {@link vmw.pscoe.hints.ScriptingApiPack.Metadata.verify|verify} messages.
                     * @function encode
                     * @memberof vmw.pscoe.hints.ScriptingApiPack.Metadata
                     * @static
                     * @param {vmw.pscoe.hints.ScriptingApiPack.IMetadata} message Metadata message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Metadata.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.timestamp);
                        if (message.serverName != null && Object.hasOwnProperty.call(message, "serverName"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.serverName);
                        if (message.serverVersion != null && Object.hasOwnProperty.call(message, "serverVersion"))
                            writer.uint32(/* id 3, wireType 2 =*/26).string(message.serverVersion);
                        if (message.moduleName != null && Object.hasOwnProperty.call(message, "moduleName"))
                            writer.uint32(/* id 4, wireType 2 =*/34).string(message.moduleName);
                        if (message.moduleVersion != null && Object.hasOwnProperty.call(message, "moduleVersion"))
                            writer.uint32(/* id 5, wireType 2 =*/42).string(message.moduleVersion);
                        if (message.hintingVersion != null && Object.hasOwnProperty.call(message, "hintingVersion"))
                            writer.uint32(/* id 6, wireType 2 =*/50).string(message.hintingVersion);
                        return writer;
                    };

                    /**
                     * Encodes the specified Metadata message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ScriptingApiPack.Metadata.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof vmw.pscoe.hints.ScriptingApiPack.Metadata
                     * @static
                     * @param {vmw.pscoe.hints.ScriptingApiPack.IMetadata} message Metadata message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Metadata.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Metadata message from the specified reader or buffer.
                     * @function decode
                     * @memberof vmw.pscoe.hints.ScriptingApiPack.Metadata
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {vmw.pscoe.hints.ScriptingApiPack.Metadata} Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Metadata.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.ScriptingApiPack.Metadata();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.timestamp = reader.int64();
                                break;
                            case 2:
                                message.serverName = reader.string();
                                break;
                            case 3:
                                message.serverVersion = reader.string();
                                break;
                            case 4:
                                message.moduleName = reader.string();
                                break;
                            case 5:
                                message.moduleVersion = reader.string();
                                break;
                            case 6:
                                message.hintingVersion = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a Metadata message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof vmw.pscoe.hints.ScriptingApiPack.Metadata
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {vmw.pscoe.hints.ScriptingApiPack.Metadata} Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Metadata.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Metadata message.
                     * @function verify
                     * @memberof vmw.pscoe.hints.ScriptingApiPack.Metadata
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Metadata.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                                return "timestamp: integer|Long expected";
                        if (message.serverName != null && message.hasOwnProperty("serverName"))
                            if (!$util.isString(message.serverName))
                                return "serverName: string expected";
                        if (message.serverVersion != null && message.hasOwnProperty("serverVersion"))
                            if (!$util.isString(message.serverVersion))
                                return "serverVersion: string expected";
                        if (message.moduleName != null && message.hasOwnProperty("moduleName"))
                            if (!$util.isString(message.moduleName))
                                return "moduleName: string expected";
                        if (message.moduleVersion != null && message.hasOwnProperty("moduleVersion"))
                            if (!$util.isString(message.moduleVersion))
                                return "moduleVersion: string expected";
                        if (message.hintingVersion != null && message.hasOwnProperty("hintingVersion"))
                            if (!$util.isString(message.hintingVersion))
                                return "hintingVersion: string expected";
                        return null;
                    };

                    /**
                     * Creates a Metadata message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof vmw.pscoe.hints.ScriptingApiPack.Metadata
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {vmw.pscoe.hints.ScriptingApiPack.Metadata} Metadata
                     */
                    Metadata.fromObject = function fromObject(object) {
                        if (object instanceof $root.vmw.pscoe.hints.ScriptingApiPack.Metadata)
                            return object;
                        var message = new $root.vmw.pscoe.hints.ScriptingApiPack.Metadata();
                        if (object.timestamp != null)
                            if ($util.Long)
                                (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                            else if (typeof object.timestamp === "string")
                                message.timestamp = parseInt(object.timestamp, 10);
                            else if (typeof object.timestamp === "number")
                                message.timestamp = object.timestamp;
                            else if (typeof object.timestamp === "object")
                                message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
                        if (object.serverName != null)
                            message.serverName = String(object.serverName);
                        if (object.serverVersion != null)
                            message.serverVersion = String(object.serverVersion);
                        if (object.moduleName != null)
                            message.moduleName = String(object.moduleName);
                        if (object.moduleVersion != null)
                            message.moduleVersion = String(object.moduleVersion);
                        if (object.hintingVersion != null)
                            message.hintingVersion = String(object.hintingVersion);
                        return message;
                    };

                    /**
                     * Creates a plain object from a Metadata message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof vmw.pscoe.hints.ScriptingApiPack.Metadata
                     * @static
                     * @param {vmw.pscoe.hints.ScriptingApiPack.Metadata} message Metadata
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Metadata.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.timestamp = options.longs === String ? "0" : 0;
                            object.serverName = "";
                            object.serverVersion = "";
                            object.moduleName = "";
                            object.moduleVersion = "";
                            object.hintingVersion = "";
                        }
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (typeof message.timestamp === "number")
                                object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                            else
                                object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
                        if (message.serverName != null && message.hasOwnProperty("serverName"))
                            object.serverName = message.serverName;
                        if (message.serverVersion != null && message.hasOwnProperty("serverVersion"))
                            object.serverVersion = message.serverVersion;
                        if (message.moduleName != null && message.hasOwnProperty("moduleName"))
                            object.moduleName = message.moduleName;
                        if (message.moduleVersion != null && message.hasOwnProperty("moduleVersion"))
                            object.moduleVersion = message.moduleVersion;
                        if (message.hintingVersion != null && message.hasOwnProperty("hintingVersion"))
                            object.hintingVersion = message.hintingVersion;
                        return object;
                    };

                    /**
                     * Converts this Metadata to JSON.
                     * @function toJSON
                     * @memberof vmw.pscoe.hints.ScriptingApiPack.Metadata
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Metadata.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Metadata;
                })();

                return ScriptingApiPack;
            })();

            hints.ScriptingApi = (function() {

                /**
                 * Properties of a ScriptingApi.
                 * @memberof vmw.pscoe.hints
                 * @interface IScriptingApi
                 */

                /**
                 * Constructs a new ScriptingApi.
                 * @memberof vmw.pscoe.hints
                 * @classdesc Represents a ScriptingApi.
                 * @implements IScriptingApi
                 * @constructor
                 * @param {vmw.pscoe.hints.IScriptingApi=} [properties] Properties to set
                 */
                function ScriptingApi(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Creates a new ScriptingApi instance using the specified properties.
                 * @function create
                 * @memberof vmw.pscoe.hints.ScriptingApi
                 * @static
                 * @param {vmw.pscoe.hints.IScriptingApi=} [properties] Properties to set
                 * @returns {vmw.pscoe.hints.ScriptingApi} ScriptingApi instance
                 */
                ScriptingApi.create = function create(properties) {
                    return new ScriptingApi(properties);
                };

                /**
                 * Encodes the specified ScriptingApi message. Does not implicitly {@link vmw.pscoe.hints.ScriptingApi.verify|verify} messages.
                 * @function encode
                 * @memberof vmw.pscoe.hints.ScriptingApi
                 * @static
                 * @param {vmw.pscoe.hints.IScriptingApi} message ScriptingApi message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ScriptingApi.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    return writer;
                };

                /**
                 * Encodes the specified ScriptingApi message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ScriptingApi.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof vmw.pscoe.hints.ScriptingApi
                 * @static
                 * @param {vmw.pscoe.hints.IScriptingApi} message ScriptingApi message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ScriptingApi.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ScriptingApi message from the specified reader or buffer.
                 * @function decode
                 * @memberof vmw.pscoe.hints.ScriptingApi
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {vmw.pscoe.hints.ScriptingApi} ScriptingApi
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ScriptingApi.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.ScriptingApi();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ScriptingApi message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof vmw.pscoe.hints.ScriptingApi
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {vmw.pscoe.hints.ScriptingApi} ScriptingApi
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ScriptingApi.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ScriptingApi message.
                 * @function verify
                 * @memberof vmw.pscoe.hints.ScriptingApi
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ScriptingApi.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    return null;
                };

                /**
                 * Creates a ScriptingApi message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof vmw.pscoe.hints.ScriptingApi
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {vmw.pscoe.hints.ScriptingApi} ScriptingApi
                 */
                ScriptingApi.fromObject = function fromObject(object) {
                    if (object instanceof $root.vmw.pscoe.hints.ScriptingApi)
                        return object;
                    return new $root.vmw.pscoe.hints.ScriptingApi();
                };

                /**
                 * Creates a plain object from a ScriptingApi message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof vmw.pscoe.hints.ScriptingApi
                 * @static
                 * @param {vmw.pscoe.hints.ScriptingApi} message ScriptingApi
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ScriptingApi.toObject = function toObject() {
                    return {};
                };

                /**
                 * Converts this ScriptingApi to JSON.
                 * @function toJSON
                 * @memberof vmw.pscoe.hints.ScriptingApi
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ScriptingApi.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                ScriptingApi.Reference = (function() {

                    /**
                     * Properties of a Reference.
                     * @memberof vmw.pscoe.hints.ScriptingApi
                     * @interface IReference
                     * @property {string|null} [name] Reference name
                     */

                    /**
                     * Constructs a new Reference.
                     * @memberof vmw.pscoe.hints.ScriptingApi
                     * @classdesc Represents a Reference.
                     * @implements IReference
                     * @constructor
                     * @param {vmw.pscoe.hints.ScriptingApi.IReference=} [properties] Properties to set
                     */
                    function Reference(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Reference name.
                     * @member {string} name
                     * @memberof vmw.pscoe.hints.ScriptingApi.Reference
                     * @instance
                     */
                    Reference.prototype.name = "";

                    /**
                     * Creates a new Reference instance using the specified properties.
                     * @function create
                     * @memberof vmw.pscoe.hints.ScriptingApi.Reference
                     * @static
                     * @param {vmw.pscoe.hints.ScriptingApi.IReference=} [properties] Properties to set
                     * @returns {vmw.pscoe.hints.ScriptingApi.Reference} Reference instance
                     */
                    Reference.create = function create(properties) {
                        return new Reference(properties);
                    };

                    /**
                     * Encodes the specified Reference message. Does not implicitly {@link vmw.pscoe.hints.ScriptingApi.Reference.verify|verify} messages.
                     * @function encode
                     * @memberof vmw.pscoe.hints.ScriptingApi.Reference
                     * @static
                     * @param {vmw.pscoe.hints.ScriptingApi.IReference} message Reference message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Reference.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                        return writer;
                    };

                    /**
                     * Encodes the specified Reference message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ScriptingApi.Reference.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof vmw.pscoe.hints.ScriptingApi.Reference
                     * @static
                     * @param {vmw.pscoe.hints.ScriptingApi.IReference} message Reference message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Reference.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Reference message from the specified reader or buffer.
                     * @function decode
                     * @memberof vmw.pscoe.hints.ScriptingApi.Reference
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {vmw.pscoe.hints.ScriptingApi.Reference} Reference
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Reference.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vmw.pscoe.hints.ScriptingApi.Reference();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.name = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a Reference message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof vmw.pscoe.hints.ScriptingApi.Reference
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {vmw.pscoe.hints.ScriptingApi.Reference} Reference
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Reference.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Reference message.
                     * @function verify
                     * @memberof vmw.pscoe.hints.ScriptingApi.Reference
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Reference.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.name != null && message.hasOwnProperty("name"))
                            if (!$util.isString(message.name))
                                return "name: string expected";
                        return null;
                    };

                    /**
                     * Creates a Reference message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof vmw.pscoe.hints.ScriptingApi.Reference
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {vmw.pscoe.hints.ScriptingApi.Reference} Reference
                     */
                    Reference.fromObject = function fromObject(object) {
                        if (object instanceof $root.vmw.pscoe.hints.ScriptingApi.Reference)
                            return object;
                        var message = new $root.vmw.pscoe.hints.ScriptingApi.Reference();
                        if (object.name != null)
                            message.name = String(object.name);
                        return message;
                    };

                    /**
                     * Creates a plain object from a Reference message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof vmw.pscoe.hints.ScriptingApi.Reference
                     * @static
                     * @param {vmw.pscoe.hints.ScriptingApi.Reference} message Reference
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Reference.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults)
                            object.name = "";
                        if (message.name != null && message.hasOwnProperty("name"))
                            object.name = message.name;
                        return object;
                    };

                    /**
                     * Converts this Reference to JSON.
                     * @function toJSON
                     * @memberof vmw.pscoe.hints.ScriptingApi.Reference
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Reference.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Reference;
                })();

                /**
                 * Stage enum.
                 * @name vmw.pscoe.hints.ScriptingApi.Stage
                 * @enum {number}
                 * @property {number} RELEASE=0 RELEASE value
                 * @property {number} ALPHA=1 ALPHA value
                 * @property {number} BETA=2 BETA value
                 * @property {number} DEPRECATED=3 DEPRECATED value
                 */
                ScriptingApi.Stage = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "RELEASE"] = 0;
                    values[valuesById[1] = "ALPHA"] = 1;
                    values[valuesById[2] = "BETA"] = 2;
                    values[valuesById[3] = "DEPRECATED"] = 3;
                    return values;
                })();

                return ScriptingApi;
            })();

            return hints;
        })();

        return pscoe;
    })();

    return vmw;
})();

module.exports = $root;
