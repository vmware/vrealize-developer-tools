import * as $protobuf from "protobufjs";
/** Namespace vmw. */
export namespace vmw {

    /** Namespace pscoe. */
    namespace pscoe {

        /** Namespace hints. */
        namespace hints {

            /** Properties of an ActionsPack. */
            interface IActionsPack {

                /** ActionsPack version */
                version?: (number|null);

                /** ActionsPack uuid */
                uuid?: (string|null);

                /** ActionsPack metadata */
                metadata?: (vmw.pscoe.hints.ActionsPack.IMetadata|null);

                /** ActionsPack modules */
                modules?: (vmw.pscoe.hints.IModule[]|null);
            }

            /** Represents an ActionsPack. */
            class ActionsPack implements IActionsPack {

                /**
                 * Constructs a new ActionsPack.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IActionsPack);

                /** ActionsPack version. */
                public version: number;

                /** ActionsPack uuid. */
                public uuid: string;

                /** ActionsPack metadata. */
                public metadata?: (vmw.pscoe.hints.ActionsPack.IMetadata|null);

                /** ActionsPack modules. */
                public modules: vmw.pscoe.hints.IModule[];

                /**
                 * Creates a new ActionsPack instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ActionsPack instance
                 */
                public static create(properties?: vmw.pscoe.hints.IActionsPack): vmw.pscoe.hints.ActionsPack;

                /**
                 * Encodes the specified ActionsPack message. Does not implicitly {@link vmw.pscoe.hints.ActionsPack.verify|verify} messages.
                 * @param message ActionsPack message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IActionsPack, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ActionsPack message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ActionsPack.verify|verify} messages.
                 * @param message ActionsPack message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IActionsPack, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ActionsPack message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ActionsPack
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.ActionsPack;

                /**
                 * Decodes an ActionsPack message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ActionsPack
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.ActionsPack;

                /**
                 * Verifies an ActionsPack message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an ActionsPack message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ActionsPack
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.ActionsPack;

                /**
                 * Creates a plain object from an ActionsPack message. Also converts values to other types if specified.
                 * @param message ActionsPack
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.ActionsPack, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ActionsPack to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace ActionsPack {

                /** Properties of a Metadata. */
                interface IMetadata {

                    /** Metadata timestamp */
                    timestamp?: (number|Long|null);

                    /** Metadata serverName */
                    serverName?: (string|null);

                    /** Metadata serverVersion */
                    serverVersion?: (string|null);

                    /** Metadata hintingVersion */
                    hintingVersion?: (string|null);
                }

                /** Represents a Metadata. */
                class Metadata implements IMetadata {

                    /**
                     * Constructs a new Metadata.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: vmw.pscoe.hints.ActionsPack.IMetadata);

                    /** Metadata timestamp. */
                    public timestamp: (number|Long);

                    /** Metadata serverName. */
                    public serverName: string;

                    /** Metadata serverVersion. */
                    public serverVersion: string;

                    /** Metadata hintingVersion. */
                    public hintingVersion: string;

                    /**
                     * Creates a new Metadata instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Metadata instance
                     */
                    public static create(properties?: vmw.pscoe.hints.ActionsPack.IMetadata): vmw.pscoe.hints.ActionsPack.Metadata;

                    /**
                     * Encodes the specified Metadata message. Does not implicitly {@link vmw.pscoe.hints.ActionsPack.Metadata.verify|verify} messages.
                     * @param message Metadata message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: vmw.pscoe.hints.ActionsPack.IMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Metadata message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ActionsPack.Metadata.verify|verify} messages.
                     * @param message Metadata message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: vmw.pscoe.hints.ActionsPack.IMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Metadata message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.ActionsPack.Metadata;

                    /**
                     * Decodes a Metadata message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.ActionsPack.Metadata;

                    /**
                     * Verifies a Metadata message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Metadata message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Metadata
                     */
                    public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.ActionsPack.Metadata;

                    /**
                     * Creates a plain object from a Metadata message. Also converts values to other types if specified.
                     * @param message Metadata
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: vmw.pscoe.hints.ActionsPack.Metadata, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Metadata to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Properties of a Module. */
            interface IModule {

                /** Module name */
                name?: (string|null);

                /** Module actions */
                actions?: (vmw.pscoe.hints.IAction[]|null);
            }

            /** Represents a Module. */
            class Module implements IModule {

                /**
                 * Constructs a new Module.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IModule);

                /** Module name. */
                public name: string;

                /** Module actions. */
                public actions: vmw.pscoe.hints.IAction[];

                /**
                 * Creates a new Module instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Module instance
                 */
                public static create(properties?: vmw.pscoe.hints.IModule): vmw.pscoe.hints.Module;

                /**
                 * Encodes the specified Module message. Does not implicitly {@link vmw.pscoe.hints.Module.verify|verify} messages.
                 * @param message Module message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IModule, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Module message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Module.verify|verify} messages.
                 * @param message Module message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IModule, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Module message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Module
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.Module;

                /**
                 * Decodes a Module message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Module
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.Module;

                /**
                 * Verifies a Module message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Module message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Module
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.Module;

                /**
                 * Creates a plain object from a Module message. Also converts values to other types if specified.
                 * @param message Module
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.Module, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Module to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an Action. */
            interface IAction {

                /** Action name */
                name?: (string|null);

                /** Action version */
                version?: (string|null);

                /** Action description */
                description?: (string|null);

                /** Action returnType */
                returnType?: (string|null);

                /** Action parameters */
                parameters?: (vmw.pscoe.hints.Action.IParameter[]|null);
            }

            /** Represents an Action. */
            class Action implements IAction {

                /**
                 * Constructs a new Action.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IAction);

                /** Action name. */
                public name: string;

                /** Action version. */
                public version: string;

                /** Action description. */
                public description: string;

                /** Action returnType. */
                public returnType: string;

                /** Action parameters. */
                public parameters: vmw.pscoe.hints.Action.IParameter[];

                /**
                 * Creates a new Action instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Action instance
                 */
                public static create(properties?: vmw.pscoe.hints.IAction): vmw.pscoe.hints.Action;

                /**
                 * Encodes the specified Action message. Does not implicitly {@link vmw.pscoe.hints.Action.verify|verify} messages.
                 * @param message Action message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IAction, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Action message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Action.verify|verify} messages.
                 * @param message Action message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IAction, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Action message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Action
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.Action;

                /**
                 * Decodes an Action message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Action
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.Action;

                /**
                 * Verifies an Action message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Action message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Action
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.Action;

                /**
                 * Creates a plain object from an Action message. Also converts values to other types if specified.
                 * @param message Action
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.Action, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Action to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace Action {

                /** Properties of a Parameter. */
                interface IParameter {

                    /** Parameter name */
                    name?: (string|null);

                    /** Parameter type */
                    type?: (string|null);

                    /** Parameter description */
                    description?: (string|null);
                }

                /** Represents a Parameter. */
                class Parameter implements IParameter {

                    /**
                     * Constructs a new Parameter.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: vmw.pscoe.hints.Action.IParameter);

                    /** Parameter name. */
                    public name: string;

                    /** Parameter type. */
                    public type: string;

                    /** Parameter description. */
                    public description: string;

                    /**
                     * Creates a new Parameter instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Parameter instance
                     */
                    public static create(properties?: vmw.pscoe.hints.Action.IParameter): vmw.pscoe.hints.Action.Parameter;

                    /**
                     * Encodes the specified Parameter message. Does not implicitly {@link vmw.pscoe.hints.Action.Parameter.verify|verify} messages.
                     * @param message Parameter message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: vmw.pscoe.hints.Action.IParameter, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Parameter message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Action.Parameter.verify|verify} messages.
                     * @param message Parameter message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: vmw.pscoe.hints.Action.IParameter, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Parameter message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Parameter
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.Action.Parameter;

                    /**
                     * Decodes a Parameter message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Parameter
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.Action.Parameter;

                    /**
                     * Verifies a Parameter message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Parameter message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Parameter
                     */
                    public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.Action.Parameter;

                    /**
                     * Creates a plain object from a Parameter message. Also converts values to other types if specified.
                     * @param message Parameter
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: vmw.pscoe.hints.Action.Parameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Parameter to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Properties of a ConfigurationsPack. */
            interface IConfigurationsPack {

                /** ConfigurationsPack version */
                version?: (number|null);

                /** ConfigurationsPack uuid */
                uuid?: (string|null);

                /** ConfigurationsPack metadata */
                metadata?: (vmw.pscoe.hints.ConfigurationsPack.IMetadata|null);

                /** ConfigurationsPack categories */
                categories?: (vmw.pscoe.hints.IConfigCategory[]|null);
            }

            /** Represents a ConfigurationsPack. */
            class ConfigurationsPack implements IConfigurationsPack {

                /**
                 * Constructs a new ConfigurationsPack.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IConfigurationsPack);

                /** ConfigurationsPack version. */
                public version: number;

                /** ConfigurationsPack uuid. */
                public uuid: string;

                /** ConfigurationsPack metadata. */
                public metadata?: (vmw.pscoe.hints.ConfigurationsPack.IMetadata|null);

                /** ConfigurationsPack categories. */
                public categories: vmw.pscoe.hints.IConfigCategory[];

                /**
                 * Creates a new ConfigurationsPack instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ConfigurationsPack instance
                 */
                public static create(properties?: vmw.pscoe.hints.IConfigurationsPack): vmw.pscoe.hints.ConfigurationsPack;

                /**
                 * Encodes the specified ConfigurationsPack message. Does not implicitly {@link vmw.pscoe.hints.ConfigurationsPack.verify|verify} messages.
                 * @param message ConfigurationsPack message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IConfigurationsPack, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ConfigurationsPack message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ConfigurationsPack.verify|verify} messages.
                 * @param message ConfigurationsPack message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IConfigurationsPack, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ConfigurationsPack message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ConfigurationsPack
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.ConfigurationsPack;

                /**
                 * Decodes a ConfigurationsPack message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ConfigurationsPack
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.ConfigurationsPack;

                /**
                 * Verifies a ConfigurationsPack message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ConfigurationsPack message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ConfigurationsPack
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.ConfigurationsPack;

                /**
                 * Creates a plain object from a ConfigurationsPack message. Also converts values to other types if specified.
                 * @param message ConfigurationsPack
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.ConfigurationsPack, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ConfigurationsPack to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace ConfigurationsPack {

                /** Properties of a Metadata. */
                interface IMetadata {

                    /** Metadata timestamp */
                    timestamp?: (number|Long|null);

                    /** Metadata serverName */
                    serverName?: (string|null);

                    /** Metadata serverVersion */
                    serverVersion?: (string|null);

                    /** Metadata hintingVersion */
                    hintingVersion?: (string|null);
                }

                /** Represents a Metadata. */
                class Metadata implements IMetadata {

                    /**
                     * Constructs a new Metadata.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: vmw.pscoe.hints.ConfigurationsPack.IMetadata);

                    /** Metadata timestamp. */
                    public timestamp: (number|Long);

                    /** Metadata serverName. */
                    public serverName: string;

                    /** Metadata serverVersion. */
                    public serverVersion: string;

                    /** Metadata hintingVersion. */
                    public hintingVersion: string;

                    /**
                     * Creates a new Metadata instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Metadata instance
                     */
                    public static create(properties?: vmw.pscoe.hints.ConfigurationsPack.IMetadata): vmw.pscoe.hints.ConfigurationsPack.Metadata;

                    /**
                     * Encodes the specified Metadata message. Does not implicitly {@link vmw.pscoe.hints.ConfigurationsPack.Metadata.verify|verify} messages.
                     * @param message Metadata message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: vmw.pscoe.hints.ConfigurationsPack.IMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Metadata message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ConfigurationsPack.Metadata.verify|verify} messages.
                     * @param message Metadata message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: vmw.pscoe.hints.ConfigurationsPack.IMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Metadata message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.ConfigurationsPack.Metadata;

                    /**
                     * Decodes a Metadata message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.ConfigurationsPack.Metadata;

                    /**
                     * Verifies a Metadata message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Metadata message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Metadata
                     */
                    public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.ConfigurationsPack.Metadata;

                    /**
                     * Creates a plain object from a Metadata message. Also converts values to other types if specified.
                     * @param message Metadata
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: vmw.pscoe.hints.ConfigurationsPack.Metadata, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Metadata to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Properties of a ConfigCategory. */
            interface IConfigCategory {

                /** ConfigCategory path */
                path?: (string|null);

                /** ConfigCategory configurations */
                configurations?: (vmw.pscoe.hints.IConfig[]|null);
            }

            /** Represents a ConfigCategory. */
            class ConfigCategory implements IConfigCategory {

                /**
                 * Constructs a new ConfigCategory.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IConfigCategory);

                /** ConfigCategory path. */
                public path: string;

                /** ConfigCategory configurations. */
                public configurations: vmw.pscoe.hints.IConfig[];

                /**
                 * Creates a new ConfigCategory instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ConfigCategory instance
                 */
                public static create(properties?: vmw.pscoe.hints.IConfigCategory): vmw.pscoe.hints.ConfigCategory;

                /**
                 * Encodes the specified ConfigCategory message. Does not implicitly {@link vmw.pscoe.hints.ConfigCategory.verify|verify} messages.
                 * @param message ConfigCategory message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IConfigCategory, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ConfigCategory message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ConfigCategory.verify|verify} messages.
                 * @param message ConfigCategory message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IConfigCategory, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ConfigCategory message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ConfigCategory
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.ConfigCategory;

                /**
                 * Decodes a ConfigCategory message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ConfigCategory
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.ConfigCategory;

                /**
                 * Verifies a ConfigCategory message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ConfigCategory message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ConfigCategory
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.ConfigCategory;

                /**
                 * Creates a plain object from a ConfigCategory message. Also converts values to other types if specified.
                 * @param message ConfigCategory
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.ConfigCategory, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ConfigCategory to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Config. */
            interface IConfig {

                /** Config uuid */
                uuid?: (string|null);

                /** Config name */
                name?: (string|null);

                /** Config version */
                version?: (string|null);

                /** Config description */
                description?: (string|null);
            }

            /** Represents a Config. */
            class Config implements IConfig {

                /**
                 * Constructs a new Config.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IConfig);

                /** Config uuid. */
                public uuid: string;

                /** Config name. */
                public name: string;

                /** Config version. */
                public version: string;

                /** Config description. */
                public description: string;

                /**
                 * Creates a new Config instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Config instance
                 */
                public static create(properties?: vmw.pscoe.hints.IConfig): vmw.pscoe.hints.Config;

                /**
                 * Encodes the specified Config message. Does not implicitly {@link vmw.pscoe.hints.Config.verify|verify} messages.
                 * @param message Config message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IConfig, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Config message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Config.verify|verify} messages.
                 * @param message Config message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IConfig, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Config message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Config
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.Config;

                /**
                 * Decodes a Config message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Config
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.Config;

                /**
                 * Verifies a Config message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Config message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Config
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.Config;

                /**
                 * Creates a plain object from a Config message. Also converts values to other types if specified.
                 * @param message Config
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.Config, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Config to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Class. */
            interface IClass {

                /** Class name */
                name?: (string|null);

                /** Class description */
                description?: (string|null);

                /** Class stage */
                stage?: (vmw.pscoe.hints.ScriptingApi.Stage|null);

                /** Class properties */
                properties?: (vmw.pscoe.hints.IProperty[]|null);

                /** Class constructors */
                constructors?: (vmw.pscoe.hints.IConstructor[]|null);

                /** Class methods */
                methods?: (vmw.pscoe.hints.IMethod[]|null);

                /** Class events */
                events?: (vmw.pscoe.hints.IEvent[]|null);

                /** Class codeSnippets */
                codeSnippets?: (string[]|null);
            }

            /** Represents a Class. */
            class Class implements IClass {

                /**
                 * Constructs a new Class.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IClass);

                /** Class name. */
                public name: string;

                /** Class description. */
                public description: string;

                /** Class stage. */
                public stage: vmw.pscoe.hints.ScriptingApi.Stage;

                /** Class properties. */
                public properties: vmw.pscoe.hints.IProperty[];

                /** Class constructors. */
                public constructors: vmw.pscoe.hints.IConstructor[];

                /** Class methods. */
                public methods: vmw.pscoe.hints.IMethod[];

                /** Class events. */
                public events: vmw.pscoe.hints.IEvent[];

                /** Class codeSnippets. */
                public codeSnippets: string[];

                /**
                 * Creates a new Class instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Class instance
                 */
                public static create(properties?: vmw.pscoe.hints.IClass): vmw.pscoe.hints.Class;

                /**
                 * Encodes the specified Class message. Does not implicitly {@link vmw.pscoe.hints.Class.verify|verify} messages.
                 * @param message Class message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IClass, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Class message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Class.verify|verify} messages.
                 * @param message Class message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IClass, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Class message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Class
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.Class;

                /**
                 * Decodes a Class message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Class
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.Class;

                /**
                 * Verifies a Class message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Class message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Class
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.Class;

                /**
                 * Creates a plain object from a Class message. Also converts values to other types if specified.
                 * @param message Class
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.Class, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Class to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Type. */
            interface IType {

                /** Type name */
                name?: (string|null);

                /** Type description */
                description?: (string|null);

                /** Type scriptName */
                scriptName?: (string|null);

                /** Type propertyNames */
                propertyNames?: (string[]|null);
            }

            /** Represents a Type. */
            class Type implements IType {

                /**
                 * Constructs a new Type.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IType);

                /** Type name. */
                public name: string;

                /** Type description. */
                public description: string;

                /** Type scriptName. */
                public scriptName: string;

                /** Type propertyNames. */
                public propertyNames: string[];

                /**
                 * Creates a new Type instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Type instance
                 */
                public static create(properties?: vmw.pscoe.hints.IType): vmw.pscoe.hints.Type;

                /**
                 * Encodes the specified Type message. Does not implicitly {@link vmw.pscoe.hints.Type.verify|verify} messages.
                 * @param message Type message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IType, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Type message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Type.verify|verify} messages.
                 * @param message Type message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IType, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Type message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Type
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.Type;

                /**
                 * Decodes a Type message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Type
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.Type;

                /**
                 * Verifies a Type message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Type message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Type
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.Type;

                /**
                 * Creates a plain object from a Type message. Also converts values to other types if specified.
                 * @param message Type
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.Type, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Type to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a FunctionSet. */
            interface IFunctionSet {

                /** FunctionSet name */
                name?: (string|null);

                /** FunctionSet description */
                description?: (string|null);

                /** FunctionSet stage */
                stage?: (vmw.pscoe.hints.ScriptingApi.Stage|null);

                /** FunctionSet codeSnippets */
                codeSnippets?: (string[]|null);

                /** FunctionSet methods */
                methods?: (vmw.pscoe.hints.IMethod[]|null);
            }

            /** Represents a FunctionSet. */
            class FunctionSet implements IFunctionSet {

                /**
                 * Constructs a new FunctionSet.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IFunctionSet);

                /** FunctionSet name. */
                public name: string;

                /** FunctionSet description. */
                public description: string;

                /** FunctionSet stage. */
                public stage: vmw.pscoe.hints.ScriptingApi.Stage;

                /** FunctionSet codeSnippets. */
                public codeSnippets: string[];

                /** FunctionSet methods. */
                public methods: vmw.pscoe.hints.IMethod[];

                /**
                 * Creates a new FunctionSet instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns FunctionSet instance
                 */
                public static create(properties?: vmw.pscoe.hints.IFunctionSet): vmw.pscoe.hints.FunctionSet;

                /**
                 * Encodes the specified FunctionSet message. Does not implicitly {@link vmw.pscoe.hints.FunctionSet.verify|verify} messages.
                 * @param message FunctionSet message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IFunctionSet, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified FunctionSet message, length delimited. Does not implicitly {@link vmw.pscoe.hints.FunctionSet.verify|verify} messages.
                 * @param message FunctionSet message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IFunctionSet, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a FunctionSet message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns FunctionSet
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.FunctionSet;

                /**
                 * Decodes a FunctionSet message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns FunctionSet
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.FunctionSet;

                /**
                 * Verifies a FunctionSet message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a FunctionSet message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns FunctionSet
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.FunctionSet;

                /**
                 * Creates a plain object from a FunctionSet message. Also converts values to other types if specified.
                 * @param message FunctionSet
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.FunctionSet, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this FunctionSet to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an Enumeration. */
            interface IEnumeration {

                /** Enumeration name */
                name?: (string|null);

                /** Enumeration description */
                description?: (string|null);

                /** Enumeration stage */
                stage?: (vmw.pscoe.hints.ScriptingApi.Stage|null);

                /** Enumeration possibleValues */
                possibleValues?: (vmw.pscoe.hints.Enumeration.IPossibleValue[]|null);
            }

            /** Represents an Enumeration. */
            class Enumeration implements IEnumeration {

                /**
                 * Constructs a new Enumeration.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IEnumeration);

                /** Enumeration name. */
                public name: string;

                /** Enumeration description. */
                public description: string;

                /** Enumeration stage. */
                public stage: vmw.pscoe.hints.ScriptingApi.Stage;

                /** Enumeration possibleValues. */
                public possibleValues: vmw.pscoe.hints.Enumeration.IPossibleValue[];

                /**
                 * Creates a new Enumeration instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Enumeration instance
                 */
                public static create(properties?: vmw.pscoe.hints.IEnumeration): vmw.pscoe.hints.Enumeration;

                /**
                 * Encodes the specified Enumeration message. Does not implicitly {@link vmw.pscoe.hints.Enumeration.verify|verify} messages.
                 * @param message Enumeration message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IEnumeration, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Enumeration message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Enumeration.verify|verify} messages.
                 * @param message Enumeration message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IEnumeration, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Enumeration message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Enumeration
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.Enumeration;

                /**
                 * Decodes an Enumeration message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Enumeration
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.Enumeration;

                /**
                 * Verifies an Enumeration message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Enumeration message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Enumeration
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.Enumeration;

                /**
                 * Creates a plain object from an Enumeration message. Also converts values to other types if specified.
                 * @param message Enumeration
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.Enumeration, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Enumeration to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace Enumeration {

                /** Properties of a PossibleValue. */
                interface IPossibleValue {

                    /** PossibleValue name */
                    name?: (string|null);

                    /** PossibleValue description */
                    description?: (string|null);
                }

                /** Represents a PossibleValue. */
                class PossibleValue implements IPossibleValue {

                    /**
                     * Constructs a new PossibleValue.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: vmw.pscoe.hints.Enumeration.IPossibleValue);

                    /** PossibleValue name. */
                    public name: string;

                    /** PossibleValue description. */
                    public description: string;

                    /**
                     * Creates a new PossibleValue instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PossibleValue instance
                     */
                    public static create(properties?: vmw.pscoe.hints.Enumeration.IPossibleValue): vmw.pscoe.hints.Enumeration.PossibleValue;

                    /**
                     * Encodes the specified PossibleValue message. Does not implicitly {@link vmw.pscoe.hints.Enumeration.PossibleValue.verify|verify} messages.
                     * @param message PossibleValue message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: vmw.pscoe.hints.Enumeration.IPossibleValue, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PossibleValue message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Enumeration.PossibleValue.verify|verify} messages.
                     * @param message PossibleValue message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: vmw.pscoe.hints.Enumeration.IPossibleValue, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PossibleValue message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PossibleValue
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.Enumeration.PossibleValue;

                    /**
                     * Decodes a PossibleValue message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PossibleValue
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.Enumeration.PossibleValue;

                    /**
                     * Verifies a PossibleValue message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PossibleValue message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PossibleValue
                     */
                    public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.Enumeration.PossibleValue;

                    /**
                     * Creates a plain object from a PossibleValue message. Also converts values to other types if specified.
                     * @param message PossibleValue
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: vmw.pscoe.hints.Enumeration.PossibleValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PossibleValue to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Properties of a Primitive. */
            interface IPrimitive {

                /** Primitive name */
                name?: (string|null);

                /** Primitive description */
                description?: (string|null);
            }

            /** Represents a Primitive. */
            class Primitive implements IPrimitive {

                /**
                 * Constructs a new Primitive.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IPrimitive);

                /** Primitive name. */
                public name: string;

                /** Primitive description. */
                public description: string;

                /**
                 * Creates a new Primitive instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Primitive instance
                 */
                public static create(properties?: vmw.pscoe.hints.IPrimitive): vmw.pscoe.hints.Primitive;

                /**
                 * Encodes the specified Primitive message. Does not implicitly {@link vmw.pscoe.hints.Primitive.verify|verify} messages.
                 * @param message Primitive message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IPrimitive, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Primitive message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Primitive.verify|verify} messages.
                 * @param message Primitive message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IPrimitive, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Primitive message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Primitive
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.Primitive;

                /**
                 * Decodes a Primitive message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Primitive
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.Primitive;

                /**
                 * Verifies a Primitive message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Primitive message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Primitive
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.Primitive;

                /**
                 * Creates a plain object from a Primitive message. Also converts values to other types if specified.
                 * @param message Primitive
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.Primitive, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Primitive to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an Event. */
            interface IEvent {

                /** Event name */
                name?: (string|null);

                /** Event description */
                description?: (string|null);

                /** Event stage */
                stage?: (vmw.pscoe.hints.ScriptingApi.Stage|null);

                /** Event examples */
                examples?: (vmw.pscoe.hints.IExample[]|null);
            }

            /** Represents an Event. */
            class Event implements IEvent {

                /**
                 * Constructs a new Event.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IEvent);

                /** Event name. */
                public name: string;

                /** Event description. */
                public description: string;

                /** Event stage. */
                public stage: vmw.pscoe.hints.ScriptingApi.Stage;

                /** Event examples. */
                public examples: vmw.pscoe.hints.IExample[];

                /**
                 * Creates a new Event instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Event instance
                 */
                public static create(properties?: vmw.pscoe.hints.IEvent): vmw.pscoe.hints.Event;

                /**
                 * Encodes the specified Event message. Does not implicitly {@link vmw.pscoe.hints.Event.verify|verify} messages.
                 * @param message Event message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IEvent, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Event message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Event.verify|verify} messages.
                 * @param message Event message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IEvent, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Event message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Event
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.Event;

                /**
                 * Decodes an Event message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Event
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.Event;

                /**
                 * Verifies an Event message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Event message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Event
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.Event;

                /**
                 * Creates a plain object from an Event message. Also converts values to other types if specified.
                 * @param message Event
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.Event, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Event to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Property. */
            interface IProperty {

                /** Property name */
                name?: (string|null);

                /** Property description */
                description?: (string|null);

                /** Property stage */
                stage?: (vmw.pscoe.hints.ScriptingApi.Stage|null);

                /** Property readOnly */
                readOnly?: (boolean|null);

                /** Property returnType */
                returnType?: (vmw.pscoe.hints.IReturnType|null);

                /** Property examples */
                examples?: (vmw.pscoe.hints.IExample[]|null);
            }

            /** Represents a Property. */
            class Property implements IProperty {

                /**
                 * Constructs a new Property.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IProperty);

                /** Property name. */
                public name: string;

                /** Property description. */
                public description: string;

                /** Property stage. */
                public stage: vmw.pscoe.hints.ScriptingApi.Stage;

                /** Property readOnly. */
                public readOnly: boolean;

                /** Property returnType. */
                public returnType?: (vmw.pscoe.hints.IReturnType|null);

                /** Property examples. */
                public examples: vmw.pscoe.hints.IExample[];

                /**
                 * Creates a new Property instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Property instance
                 */
                public static create(properties?: vmw.pscoe.hints.IProperty): vmw.pscoe.hints.Property;

                /**
                 * Encodes the specified Property message. Does not implicitly {@link vmw.pscoe.hints.Property.verify|verify} messages.
                 * @param message Property message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IProperty, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Property message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Property.verify|verify} messages.
                 * @param message Property message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IProperty, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Property message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Property
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.Property;

                /**
                 * Decodes a Property message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Property
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.Property;

                /**
                 * Verifies a Property message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Property message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Property
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.Property;

                /**
                 * Creates a plain object from a Property message. Also converts values to other types if specified.
                 * @param message Property
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.Property, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Property to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Constructor. */
            interface IConstructor {

                /** Constructor description */
                description?: (string|null);

                /** Constructor stage */
                stage?: (vmw.pscoe.hints.ScriptingApi.Stage|null);

                /** Constructor parameters */
                parameters?: (vmw.pscoe.hints.IParameter[]|null);

                /** Constructor examples */
                examples?: (vmw.pscoe.hints.IExample[]|null);
            }

            /** Represents a Constructor. */
            class Constructor implements IConstructor {

                /**
                 * Constructs a new Constructor.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IConstructor);

                /** Constructor description. */
                public description: string;

                /** Constructor stage. */
                public stage: vmw.pscoe.hints.ScriptingApi.Stage;

                /** Constructor parameters. */
                public parameters: vmw.pscoe.hints.IParameter[];

                /** Constructor examples. */
                public examples: vmw.pscoe.hints.IExample[];

                /**
                 * Creates a new Constructor instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Constructor instance
                 */
                public static create(properties?: vmw.pscoe.hints.IConstructor): vmw.pscoe.hints.Constructor;

                /**
                 * Encodes the specified Constructor message. Does not implicitly {@link vmw.pscoe.hints.Constructor.verify|verify} messages.
                 * @param message Constructor message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IConstructor, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Constructor message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Constructor.verify|verify} messages.
                 * @param message Constructor message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IConstructor, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Constructor message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Constructor
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.Constructor;

                /**
                 * Decodes a Constructor message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Constructor
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.Constructor;

                /**
                 * Verifies a Constructor message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Constructor message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Constructor
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.Constructor;

                /**
                 * Creates a plain object from a Constructor message. Also converts values to other types if specified.
                 * @param message Constructor
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.Constructor, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Constructor to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Method. */
            interface IMethod {

                /** Method name */
                name?: (string|null);

                /** Method description */
                description?: (string|null);

                /** Method stage */
                stage?: (vmw.pscoe.hints.ScriptingApi.Stage|null);

                /** Method parameters */
                parameters?: (vmw.pscoe.hints.IParameter[]|null);

                /** Method returnType */
                returnType?: (vmw.pscoe.hints.IReturnType|null);

                /** Method examples */
                examples?: (vmw.pscoe.hints.IExample[]|null);
            }

            /** Represents a Method. */
            class Method implements IMethod {

                /**
                 * Constructs a new Method.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IMethod);

                /** Method name. */
                public name: string;

                /** Method description. */
                public description: string;

                /** Method stage. */
                public stage: vmw.pscoe.hints.ScriptingApi.Stage;

                /** Method parameters. */
                public parameters: vmw.pscoe.hints.IParameter[];

                /** Method returnType. */
                public returnType?: (vmw.pscoe.hints.IReturnType|null);

                /** Method examples. */
                public examples: vmw.pscoe.hints.IExample[];

                /**
                 * Creates a new Method instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Method instance
                 */
                public static create(properties?: vmw.pscoe.hints.IMethod): vmw.pscoe.hints.Method;

                /**
                 * Encodes the specified Method message. Does not implicitly {@link vmw.pscoe.hints.Method.verify|verify} messages.
                 * @param message Method message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IMethod, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Method message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Method.verify|verify} messages.
                 * @param message Method message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IMethod, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Method message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Method
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.Method;

                /**
                 * Decodes a Method message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Method
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.Method;

                /**
                 * Verifies a Method message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Method message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Method
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.Method;

                /**
                 * Creates a plain object from a Method message. Also converts values to other types if specified.
                 * @param message Method
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.Method, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Method to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ReturnType. */
            interface IReturnType {

                /** ReturnType type */
                type?: (string|null);

                /** ReturnType description */
                description?: (string|null);

                /** ReturnType enumeration */
                enumeration?: (string|null);
            }

            /** Represents a ReturnType. */
            class ReturnType implements IReturnType {

                /**
                 * Constructs a new ReturnType.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IReturnType);

                /** ReturnType type. */
                public type: string;

                /** ReturnType description. */
                public description: string;

                /** ReturnType enumeration. */
                public enumeration: string;

                /**
                 * Creates a new ReturnType instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ReturnType instance
                 */
                public static create(properties?: vmw.pscoe.hints.IReturnType): vmw.pscoe.hints.ReturnType;

                /**
                 * Encodes the specified ReturnType message. Does not implicitly {@link vmw.pscoe.hints.ReturnType.verify|verify} messages.
                 * @param message ReturnType message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IReturnType, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ReturnType message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ReturnType.verify|verify} messages.
                 * @param message ReturnType message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IReturnType, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ReturnType message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ReturnType
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.ReturnType;

                /**
                 * Decodes a ReturnType message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ReturnType
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.ReturnType;

                /**
                 * Verifies a ReturnType message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ReturnType message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ReturnType
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.ReturnType;

                /**
                 * Creates a plain object from a ReturnType message. Also converts values to other types if specified.
                 * @param message ReturnType
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.ReturnType, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ReturnType to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Parameter. */
            interface IParameter {

                /** Parameter name */
                name?: (string|null);

                /** Parameter type */
                type?: (string|null);

                /** Parameter description */
                description?: (string|null);

                /** Parameter enumeration */
                enumeration?: (string|null);
            }

            /** Represents a Parameter. */
            class Parameter implements IParameter {

                /**
                 * Constructs a new Parameter.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IParameter);

                /** Parameter name. */
                public name: string;

                /** Parameter type. */
                public type: string;

                /** Parameter description. */
                public description: string;

                /** Parameter enumeration. */
                public enumeration: string;

                /**
                 * Creates a new Parameter instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Parameter instance
                 */
                public static create(properties?: vmw.pscoe.hints.IParameter): vmw.pscoe.hints.Parameter;

                /**
                 * Encodes the specified Parameter message. Does not implicitly {@link vmw.pscoe.hints.Parameter.verify|verify} messages.
                 * @param message Parameter message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IParameter, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Parameter message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Parameter.verify|verify} messages.
                 * @param message Parameter message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IParameter, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Parameter message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Parameter
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.Parameter;

                /**
                 * Decodes a Parameter message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Parameter
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.Parameter;

                /**
                 * Verifies a Parameter message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Parameter message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Parameter
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.Parameter;

                /**
                 * Creates a plain object from a Parameter message. Also converts values to other types if specified.
                 * @param message Parameter
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.Parameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Parameter to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an Example. */
            interface IExample {

                /** Example description */
                description?: (string|null);

                /** Example codeSnippet */
                codeSnippet?: (string|null);
            }

            /** Represents an Example. */
            class Example implements IExample {

                /**
                 * Constructs a new Example.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IExample);

                /** Example description. */
                public description: string;

                /** Example codeSnippet. */
                public codeSnippet: string;

                /**
                 * Creates a new Example instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Example instance
                 */
                public static create(properties?: vmw.pscoe.hints.IExample): vmw.pscoe.hints.Example;

                /**
                 * Encodes the specified Example message. Does not implicitly {@link vmw.pscoe.hints.Example.verify|verify} messages.
                 * @param message Example message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IExample, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Example message, length delimited. Does not implicitly {@link vmw.pscoe.hints.Example.verify|verify} messages.
                 * @param message Example message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IExample, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Example message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Example
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.Example;

                /**
                 * Decodes an Example message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Example
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.Example;

                /**
                 * Verifies an Example message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Example message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Example
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.Example;

                /**
                 * Creates a plain object from an Example message. Also converts values to other types if specified.
                 * @param message Example
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.Example, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Example to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ScriptingApiPack. */
            interface IScriptingApiPack {

                /** ScriptingApiPack version */
                version?: (number|null);

                /** ScriptingApiPack uuid */
                uuid?: (string|null);

                /** ScriptingApiPack metadata */
                metadata?: (vmw.pscoe.hints.ScriptingApiPack.IMetadata|null);

                /** ScriptingApiPack classes */
                classes?: (vmw.pscoe.hints.IClass[]|null);

                /** ScriptingApiPack types */
                types?: (vmw.pscoe.hints.IType[]|null);

                /** ScriptingApiPack functionSets */
                functionSets?: (vmw.pscoe.hints.IFunctionSet[]|null);

                /** ScriptingApiPack primitives */
                primitives?: (vmw.pscoe.hints.IPrimitive[]|null);

                /** ScriptingApiPack enums */
                enums?: (vmw.pscoe.hints.IEnumeration[]|null);
            }

            /** Represents a ScriptingApiPack. */
            class ScriptingApiPack implements IScriptingApiPack {

                /**
                 * Constructs a new ScriptingApiPack.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IScriptingApiPack);

                /** ScriptingApiPack version. */
                public version: number;

                /** ScriptingApiPack uuid. */
                public uuid: string;

                /** ScriptingApiPack metadata. */
                public metadata?: (vmw.pscoe.hints.ScriptingApiPack.IMetadata|null);

                /** ScriptingApiPack classes. */
                public classes: vmw.pscoe.hints.IClass[];

                /** ScriptingApiPack types. */
                public types: vmw.pscoe.hints.IType[];

                /** ScriptingApiPack functionSets. */
                public functionSets: vmw.pscoe.hints.IFunctionSet[];

                /** ScriptingApiPack primitives. */
                public primitives: vmw.pscoe.hints.IPrimitive[];

                /** ScriptingApiPack enums. */
                public enums: vmw.pscoe.hints.IEnumeration[];

                /**
                 * Creates a new ScriptingApiPack instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ScriptingApiPack instance
                 */
                public static create(properties?: vmw.pscoe.hints.IScriptingApiPack): vmw.pscoe.hints.ScriptingApiPack;

                /**
                 * Encodes the specified ScriptingApiPack message. Does not implicitly {@link vmw.pscoe.hints.ScriptingApiPack.verify|verify} messages.
                 * @param message ScriptingApiPack message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IScriptingApiPack, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ScriptingApiPack message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ScriptingApiPack.verify|verify} messages.
                 * @param message ScriptingApiPack message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IScriptingApiPack, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ScriptingApiPack message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ScriptingApiPack
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.ScriptingApiPack;

                /**
                 * Decodes a ScriptingApiPack message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ScriptingApiPack
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.ScriptingApiPack;

                /**
                 * Verifies a ScriptingApiPack message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ScriptingApiPack message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ScriptingApiPack
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.ScriptingApiPack;

                /**
                 * Creates a plain object from a ScriptingApiPack message. Also converts values to other types if specified.
                 * @param message ScriptingApiPack
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.ScriptingApiPack, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ScriptingApiPack to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace ScriptingApiPack {

                /** Properties of a Metadata. */
                interface IMetadata {

                    /** Metadata timestamp */
                    timestamp?: (number|Long|null);

                    /** Metadata serverName */
                    serverName?: (string|null);

                    /** Metadata serverVersion */
                    serverVersion?: (string|null);

                    /** Metadata moduleName */
                    moduleName?: (string|null);

                    /** Metadata moduleVersion */
                    moduleVersion?: (string|null);

                    /** Metadata hintingVersion */
                    hintingVersion?: (string|null);
                }

                /** Represents a Metadata. */
                class Metadata implements IMetadata {

                    /**
                     * Constructs a new Metadata.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: vmw.pscoe.hints.ScriptingApiPack.IMetadata);

                    /** Metadata timestamp. */
                    public timestamp: (number|Long);

                    /** Metadata serverName. */
                    public serverName: string;

                    /** Metadata serverVersion. */
                    public serverVersion: string;

                    /** Metadata moduleName. */
                    public moduleName: string;

                    /** Metadata moduleVersion. */
                    public moduleVersion: string;

                    /** Metadata hintingVersion. */
                    public hintingVersion: string;

                    /**
                     * Creates a new Metadata instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Metadata instance
                     */
                    public static create(properties?: vmw.pscoe.hints.ScriptingApiPack.IMetadata): vmw.pscoe.hints.ScriptingApiPack.Metadata;

                    /**
                     * Encodes the specified Metadata message. Does not implicitly {@link vmw.pscoe.hints.ScriptingApiPack.Metadata.verify|verify} messages.
                     * @param message Metadata message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: vmw.pscoe.hints.ScriptingApiPack.IMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Metadata message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ScriptingApiPack.Metadata.verify|verify} messages.
                     * @param message Metadata message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: vmw.pscoe.hints.ScriptingApiPack.IMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Metadata message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.ScriptingApiPack.Metadata;

                    /**
                     * Decodes a Metadata message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.ScriptingApiPack.Metadata;

                    /**
                     * Verifies a Metadata message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Metadata message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Metadata
                     */
                    public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.ScriptingApiPack.Metadata;

                    /**
                     * Creates a plain object from a Metadata message. Also converts values to other types if specified.
                     * @param message Metadata
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: vmw.pscoe.hints.ScriptingApiPack.Metadata, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Metadata to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Properties of a ScriptingApi. */
            interface IScriptingApi {
            }

            /** Represents a ScriptingApi. */
            class ScriptingApi implements IScriptingApi {

                /**
                 * Constructs a new ScriptingApi.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: vmw.pscoe.hints.IScriptingApi);

                /**
                 * Creates a new ScriptingApi instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ScriptingApi instance
                 */
                public static create(properties?: vmw.pscoe.hints.IScriptingApi): vmw.pscoe.hints.ScriptingApi;

                /**
                 * Encodes the specified ScriptingApi message. Does not implicitly {@link vmw.pscoe.hints.ScriptingApi.verify|verify} messages.
                 * @param message ScriptingApi message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: vmw.pscoe.hints.IScriptingApi, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ScriptingApi message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ScriptingApi.verify|verify} messages.
                 * @param message ScriptingApi message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: vmw.pscoe.hints.IScriptingApi, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ScriptingApi message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ScriptingApi
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.ScriptingApi;

                /**
                 * Decodes a ScriptingApi message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ScriptingApi
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.ScriptingApi;

                /**
                 * Verifies a ScriptingApi message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ScriptingApi message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ScriptingApi
                 */
                public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.ScriptingApi;

                /**
                 * Creates a plain object from a ScriptingApi message. Also converts values to other types if specified.
                 * @param message ScriptingApi
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: vmw.pscoe.hints.ScriptingApi, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ScriptingApi to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace ScriptingApi {

                /** Properties of a Reference. */
                interface IReference {

                    /** Reference name */
                    name?: (string|null);
                }

                /** Represents a Reference. */
                class Reference implements IReference {

                    /**
                     * Constructs a new Reference.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: vmw.pscoe.hints.ScriptingApi.IReference);

                    /** Reference name. */
                    public name: string;

                    /**
                     * Creates a new Reference instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Reference instance
                     */
                    public static create(properties?: vmw.pscoe.hints.ScriptingApi.IReference): vmw.pscoe.hints.ScriptingApi.Reference;

                    /**
                     * Encodes the specified Reference message. Does not implicitly {@link vmw.pscoe.hints.ScriptingApi.Reference.verify|verify} messages.
                     * @param message Reference message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: vmw.pscoe.hints.ScriptingApi.IReference, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Reference message, length delimited. Does not implicitly {@link vmw.pscoe.hints.ScriptingApi.Reference.verify|verify} messages.
                     * @param message Reference message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: vmw.pscoe.hints.ScriptingApi.IReference, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Reference message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Reference
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vmw.pscoe.hints.ScriptingApi.Reference;

                    /**
                     * Decodes a Reference message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Reference
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vmw.pscoe.hints.ScriptingApi.Reference;

                    /**
                     * Verifies a Reference message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Reference message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Reference
                     */
                    public static fromObject(object: { [k: string]: any }): vmw.pscoe.hints.ScriptingApi.Reference;

                    /**
                     * Creates a plain object from a Reference message. Also converts values to other types if specified.
                     * @param message Reference
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: vmw.pscoe.hints.ScriptingApi.Reference, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Reference to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Stage enum. */
                enum Stage {
                    RELEASE = 0,
                    ALPHA = 1,
                    BETA = 2,
                    DEPRECATED = 3
                }
            }
        }
    }
}
