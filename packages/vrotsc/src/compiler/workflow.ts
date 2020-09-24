/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const xmldoc: typeof import("xmldoc") = require("xmldoc");

    export interface WorkflowDescriptor {
        id?: string;
        version?: string;
        description?: string;
        "object-name"?: string;
        "root-name"?: string;
        "api-version"?: string;
        "allowed-operations"?: string;
        "display-name"?: string;
        restartMode?: number;
        resumeFromFailedMode?: number;
        position?: WorkflowPosition;
        input?: {
            param?: WorkflowParameter[];
        };
        output?: {
            param?: WorkflowParameter[];
        };
        attrib?: WorkflowAttribute[];
        "workflow-item"?: WorkflowItem[];
        presentation?: WorkflowPresentation;
        "workflow-note"?: WorkflowNote[];
        "error-handler"?: WorkflowErrorHandler[];
    }

    export interface WorkflowAttribute {
        name: string;
        description?: string;
        type?: string;
        value?: string;
    }

    export interface WorkflowPosition {
        x: number;
        y: number;
    }

    export interface WorkflowParameter {
        name: string;
        description?: string;
        type?: string;
    }

    export interface WorkflowItem {
        name?: string;
        description?: string;
        "out-name"?: string;
        "catch-name"?: string;
        "throw-bind-name"?: string;
        "alt-out-name"?: string;
        type?: string;
        comparator?: number;
        "end-mode"?: number;
        "display-name"?: string;
        "linked-workflow-id"?: string;
        script?: WorkflowItemScript;
        "in-binding"?: {
            bind: WorkflowItemBinding[];
        };
        "out-binding"?: {
            bind: WorkflowItemBinding[];
        };
        "workflow-subelements-list"?: WorkflowItemSubelementList,
        reference?: {
            id: string;
            type: string;
        };
        position?: WorkflowPosition;
        presentation?: WorkflowPresentation;
        condition?: WorkflowItemSwitchCondition[];
    }

    export interface WorkflowItemSubelementList {
        "workflow-subelement": WorkflowItem[];
    }

    export interface WorkflowErrorHandler {
        name: string;
        position?: WorkflowPosition;
        "throw-bind-name"?: string;
    }

    export interface WorkflowItemScript {
        value?: string;
        encoded?: boolean;
    }

    export interface WorkflowItemBinding {
        name: string;
        type?: string;
        "export-name"?: string;
        "explicitly-not-bound"?: boolean;
        description?: string;
    }

    export interface WorkflowItemSwitchCondition {
        name: string;
        type?: string;
        label?: string;
        value?: string;
        comparator?: number;
    }

    export interface WorkflowPresentation {
        desc?: string;
        "p-param"?: WorkflowPresentationParameter[];
        "p-step"?: WorkflowPresentationStep[];
    }

    export interface WorkflowPresentationParameter {
        name?: string;
        desc?: string;
        "p-qual"?: WorkflowPresentationParameterProperty[];
    }

    export interface WorkflowPresentationParameterProperty {
        name?: string;
        type?: string;
        kind?: string;
        value?: string;
    }

    export interface WorkflowPresentationStep {
        title?: string;
        desc?: string;
        "p-group"?: WorkflowPresentationGroup[];
        "p-param"?: WorkflowPresentationParameter[];
    }

    export interface WorkflowPresentationGroup {
        title?: string;
        desc?: string;
        "p-param"?: WorkflowPresentationParameter[];
    }

    export interface WorkflowNote {
        description?: string;
        color?: string;
        x?: number;
        y?: number;
        w?: number;
        h?: number;
    }

    export function parseWorkflowXml(xmlString: string): WorkflowDescriptor {
        const xmlDoc = new xmldoc.XmlDocument(xmlString);
        const workflow: WorkflowDescriptor = {
            input: {
                param: [],
            },
            output: {
                param: [],
            },
            attrib: [],
            "workflow-item": [],
        };

        Object.keys(xmlDoc.attr || {}).forEach(attName => {
            workflow[attName] = xmlDoc.attr[attName];
        });

        elements(xmlDoc).forEach(childEle => {
            switch (childEle.name) {
                case "display-name":
                    workflow["display-name"] = cdata(childEle);
                    break;
                case "position":
                    workflow.position = getPosition(childEle);
                    break;
                case "input":
                    workflow.input.param = parseParameters(childEle);
                    break;
                case "output":
                    workflow.output.param = parseParameters(childEle);
                    break;
                case "attrib":
                    workflow.attrib.push(parseAttribute(childEle));
                    break;
                case "workflow-item":
                    workflow["workflow-item"].push(parseItem(childEle));
                    break;
                case "presentation":
                    workflow.presentation = parsePresentation(childEle);
                    break;
            }
        });

        return workflow;

        function parseAttribute(ele: XmlElement): WorkflowAttribute {
            const att: WorkflowAttribute = {
                name: ele.attr["name"],
                type: ele.attr["type"],
            };
            elements(ele).forEach(childEle => {
                switch (childEle.name) {
                    case "description":
                        att.description = cdata(childEle);
                        break;
                    case "value":
                        att.value = cdata(childEle);
                        break;
                }
            });
            return att;
        }

        function parseParameters(ele: XmlElement): WorkflowParameter[] {
            return elements(ele)
                .filter(childEle => childEle.name === "param")
                .map(paramEle => {
                    const param = <WorkflowParameter>{
                        name: paramEle.attr["name"],
                        type: paramEle.attr["type"]
                    };
                    elements(paramEle).forEach(childEle => {
                        switch (childEle.name) {
                            case "description":
                                param.description = cdata(childEle);
                                break;
                        }
                    });
                    return param;
                });
        }

        function parseItem(ele: XmlElement): WorkflowItem {
            const item: WorkflowItem = {};

            Object.keys(ele.attr || {}).forEach(attName => {
                item[attName] = ele.attr[attName];
            });

            elements(ele).forEach(childEle => {
                switch (childEle.name) {
                    case "display-name":
                        item["display-name"] = cdata(childEle);
                        break;
                    case "position":
                        item.position = getPosition(childEle);
                        break;
                    case "script":
                        item.script = parseItemScript(childEle)
                        break;
                    case "in-binding":
                        item["in-binding"] = {
                            bind: parseItemBinding(childEle),
                        };
                        break;
                    case "out-binding":
                        item["out-binding"] = {
                            bind: parseItemBinding(childEle),
                        };
                        break;
                }
            });

            return item;
        }

        function parseItemBinding(ele: XmlElement): WorkflowItemBinding[] {
            return elements(ele)
                .filter(childEle => childEle.name === "bind")
                .map(bindEle => {
                    const bind = <WorkflowItemBinding>{
                        name: bindEle.attr["name"],
                        type: bindEle.attr["type"],
                        "export-name": bindEle.attr["export-name"],
                    };
                    elements(bindEle).forEach(childEle => {
                        switch (childEle.name) {
                            case "description":
                                bind.description = cdata(childEle);
                                break;
                        }
                    });
                    return bind;
                });
        }

        function parseItemScript(ele: XmlElement): WorkflowItemScript {
            return {
                encoded: ele.attr["encoded"] === "true",
                value: cdata(ele),
            };
        }

        function parsePresentation(ele: XmlElement): WorkflowPresentation {
            const presentation: WorkflowPresentation = {
                "p-param": [],
                "p-step": [],
            };

            Object.keys(ele.attr || {}).forEach(attName => {
                presentation[attName] = ele.attr[attName];
            });

            elements(ele).forEach(childEle => {
                switch (childEle.name) {
                    case "desc":
                        presentation.desc = cdata(childEle);
                        break;
                    case "p-param":
                        presentation["p-param"].push(parsePresentationParam(childEle));
                        break;
                    case "p-step":
                        presentation["p-step"].push(parsePresentationStep(childEle));
                        break;
                }
            });

            return presentation;
        }

        function parsePresentationParam(ele: XmlElement): WorkflowPresentationParameter {
            const param: WorkflowPresentationParameter = {
                "p-qual": [],
            };

            Object.keys(ele.attr || {}).forEach(attName => {
                param[attName] = ele.attr[attName];
            });

            elements(ele).forEach(childEle => {
                switch (childEle.name) {
                    case "desc":
                        param.desc = cdata(childEle);
                        break;
                    case "p-qual":
                        param["p-qual"].push(parsePresentationParamProp(childEle));
                        break;
                }
            });

            return param;
        }

        function parsePresentationParamProp(ele: XmlElement): WorkflowPresentationParameterProperty {
            const prop: WorkflowPresentationParameterProperty = {};

            Object.keys(ele.attr || {}).forEach(attName => {
                prop[attName] = ele.attr[attName];
            });

            prop.value = cdata(ele);

            return prop;
        }

        function parsePresentationStep(ele: XmlElement): WorkflowPresentationStep {
            const step: WorkflowPresentationStep = {
                "p-group": [],
                "p-param": [],
            };

            Object.keys(ele.attr || {}).forEach(attName => {
                step[attName] = ele.attr[attName];
            });

            elements(ele).forEach(childEle => {
                switch (childEle.name) {
                    case "title":
                        step.title = cdata(childEle);
                        break;
                    case "desc":
                        step.desc = cdata(childEle);
                        break;
                    case "p-group":
                        step["p-group"].push(parsePresentationGroup(childEle));
                        break;
                    case "p-param":
                        step["p-param"].push(parsePresentationParam(childEle));
                        break;
                }
            });

            return step;
        }

        function parsePresentationGroup(ele: XmlElement): WorkflowPresentationGroup {
            const group: WorkflowPresentationGroup = {
                "p-param": [],
            };

            Object.keys(ele.attr || {}).forEach(attName => {
                group[attName] = ele.attr[attName];
            });

            elements(ele).forEach(childEle => {
                switch (childEle.name) {
                    case "title":
                        group.title = cdata(childEle);
                        break;
                    case "desc":
                        group.desc = cdata(childEle);
                        break;
                    case "p-param":
                        group["p-param"].push(parsePresentationParam(childEle));
                        break;
                }
            });

            return group;
        }

        function elements(ele: XmlElement): XmlElement[] {
            return (ele.children || []).filter(node => node.type === "element") as XmlElement[];
        }

        function cdata(ele: XmlElement): string {
            const cdataNode = (ele.children || []).find(node => node.type === "cdata") as XmlCDataNode;
            if (cdataNode) {
                return cdataNode.cdata;
            }
        }

        function getPosition(ele: XmlElement): WorkflowPosition {
            return {
                x: parseFloat(ele.attr["x"] || "0"),
                y: parseFloat(ele.attr["y"] || "0"),
            };
        }
    }

    export function printWorkflowXml(workflow: WorkflowDescriptor): string {
        const builder = createStringBuilder("", "");

        builder.append(`<?xml version='1.0' encoding='UTF-8'?>`).appendLine();
        builder.append(`<workflow xmlns="http://vmware.com/vco/workflow"`);
        builder.append(` xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`);
        builder.append(` xsi:schemaLocation="http://vmware.com/vco/workflow`);
        builder.append(` http://vmware.com/vco/workflow/Workflow-v4.xsd"`);
        builder.append(` root-name="${workflow["root-name"]}"`);
        builder.append(` object-name="${workflow["object-name"]}"`);
        builder.append(` id="${workflow.id}"`);
        builder.append(` version="${workflow.version || "1.0.0"}"`);
        builder.append(` api-version="${workflow["api-version"] || "6.0.0"}"`);
        builder.append(` allowed-operations="${getAllowedOperations(workflow["allowed-operations"])}"`);
        if (workflow["icon-id"]) {
            builder.append(` icon-id="${workflow["icon-id"]}"`);
        }
        if (workflow.restartMode != null) {
            builder.append(` restartMode="${workflow.restartMode.toString()}"`);
        }
        if (workflow.resumeFromFailedMode != null) {
            builder.append(` resumeFromFailedMode="${workflow.resumeFromFailedMode.toString()}">`)
        }
        builder.appendLine();
        builder.indent();

        builder.append(`<display-name><![CDATA[${workflow["display-name"] || ""}]]></display-name>`).appendLine();

        if (workflow.description) {
            builder.append(`<description><![CDATA[${workflow.description}]]></description>`).appendLine();
        }

        if ((workflow["error-handler"] || []).length) {
            buildErrorHandlers(workflow["error-handler"]);
        }

        if (workflow.position) {
            buildPosition(workflow.position);
        }

        if (workflow.input) {
            buildParameters(workflow.input.param, "input");
        }

        if (workflow.output) {
            buildParameters(workflow.output.param, "output");
        }

        if (workflow.attrib) {
            buildAttributes(workflow.attrib);
        }

        if ((workflow["workflow-note"] || []).length) {
            buildNotes(workflow["workflow-note"]);
        }

        buildItems(workflow["workflow-item"]);
        buildPresentation(workflow.presentation, true);

        builder.unindent();
        builder.append(`</workflow>`);

        return builder.toString();

        function buildErrorHandlers(errorHandlers: WorkflowErrorHandler[]) {
            errorHandlers.forEach(errorHandler => {
                builder.append(`<error-handler name="${errorHandler.name}" throw-bind-name="${errorHandler["throw-bind-name"]}">`).appendLine();
                builder.indent();
                if (errorHandler.position) {
                    buildPosition(errorHandler.position);
                }
                builder.unindent();
                builder.append("</error-handler>").appendLine();
            });
        }

        function buildPosition(position: WorkflowPosition) {
            builder.append(`<position y="${formatNumber(position.y)}" x="${formatNumber(position.x)}"/>`).appendLine();
        }

        function buildParameters(parameters: WorkflowParameter[], elementName: string) {
            builder.append(`<${elementName}>`).appendLine();
            builder.indent();

            parameters.forEach(param => {
                builder.append(`<param name="${param.name}" type="${param.type}"`);
                if (param.description) {
                    builder.append(`>`).appendLine();
                    builder.indent();
                    builder.append(`<description><![CDATA[${param.description}]]></description>`).appendLine();
                    builder.unindent();
                    builder.append(`</param>`).appendLine();
                }
                else {
                    builder.append(`/>`).appendLine();
                }
            });

            builder.unindent();
            builder.append(`</${elementName}>`).appendLine();
        }

        function buildAttributes(attributes: WorkflowAttribute[]) {
            attributes.forEach(att => {
                buildAttribute(att);
            });
        }

        function buildAttribute(att: WorkflowAttribute) {
            builder.append(`<attrib name="${att.name}" type="${att.type}" read-only="false"`);
            builder.append(`>`).appendLine();
            builder.indent();

            const attValue = (att.type === "string" || att.type === "SecureString") ? "" : "__NULL__";
            builder.append(`<value encoded="n"><![CDATA[${attValue}]]></value>`).appendLine();

            if (att.description) {
                builder.append(`<description><![CDATA[${att.description}]]></description>`).appendLine();
            }

            if (att.value != null) {
                builder.append(`<value encoded="n"><![CDATA[${att.value}]]></value>`).appendLine();
            }

            builder.unindent();
            builder.append(`</attrib>`).appendLine();
        }

        function buildNotes(notes: WorkflowNote[]) {
            notes.forEach(note => {
                builder.append(`<workflow-note x="${formatNumber(note.x)}"`);
                builder.append(` y="${formatNumber(note.y)}"`);
                builder.append(` w="${formatNumber(note.w)}"`);
                builder.append(` h="${formatNumber(note.h)}"`);
                if (note.color) {
                    builder.append(` color="${note.color}"`);
                }
                builder.append(">").appendLine();
                builder.indent();
                builder.append(`<description><![CDATA[${note.description || ""}]]></description>`).appendLine();
                builder.unindent();
                builder.append(`</workflow-note>`).appendLine();
            });
        }

        function buildItems(items: WorkflowItem[]) {
            items.forEach(item => {
                buildItem(item);
            });
        }

        function buildItem(item: WorkflowItem) {
            builder.append(`<workflow-item`);
            buildItemAttibute(item, "name");
            buildItemAttibute(item, "prototype-id");
            buildItemAttibute(item, "out-name");
            buildItemAttibute(item, "catch-name");
            buildItemAttibute(item, "throw-bind-name");
            buildItemAttibute(item, "content-mode");
            buildItemAttibute(item, "type");
            buildItemAttibute(item, "interaction");
            buildItemAttibute(item, "launched-workflow-id");
            buildItemAttibute(item, "linked-workflow-id");
            buildItemAttibute(item, "alt-out-name");
            buildItemAttibute(item, "comparator");
            buildItemAttibute(item, "end-mode");
            builder.append(">").appendLine();
            builder.indent();
            if (item["display-name"]) {
                builder.append(`<display-name><![CDATA[${item["display-name"]}]]></display-name>`).appendLine();
            }
            if (item["workflow-subelements-list"]) {
                buildWorkflowItemSubelementList(item["workflow-subelements-list"]);
            }
            if (item.script && item.script.value != null) {
                builder.append(`<script encoded="${item.script.encoded ? "true" : "false"}">`);
                builder.append(`<![CDATA[${item.script.value || ""}]]></script>`).appendLine();
            }
            buildItemBindings((item["in-binding"] || { bind: [] }).bind || [], "in-binding",
                item.type === "task" ||
                item.type === "condition" ||
                item.type === "custom-condition" ||
                item.type === "decision-activity" ||
                item.type === "link" ||
                item.type === "input" ||
                item.type === "foreach" ||
                item.type === "switch" ||
                item.type === "waiting-event" ||
                item.type === "waiting-timer");
            buildItemBindings((item["out-binding"] || { bind: [] }).bind || [], "out-binding",
                item.type === "task" ||
                item.type === "link" ||
                item.type === "input" ||
                item.type === "foreach" ||
                item.type === "condition" ||
                item.type === "waiting-event");
            if (item.reference) {
                builder.append(`<reference type="${item.reference.type}" id="${item.reference.id}"/>`).appendLine();
            }
            if (item.description) {
                builder.append(`<description><![CDATA[${item.description}]]></description>`).appendLine();
            }
            if (item.condition) {
                buildWorkflowItemSwitchConditions(item.condition);
            }
            buildPresentation(item.presentation);
            if (item.position) {
                buildPosition(item.position);
            }
            builder.unindent();
            builder.append(`</workflow-item>`).appendLine();
        }

        function buildWorkflowItemSwitchConditions(conditions: WorkflowItemSwitchCondition[]) {
            conditions.forEach(condition => {
                builder.append(`<condition`);
                builder.append(` name="${condition.name}"`);
                builder.append(` type="${condition.type}"`);
                builder.append(` comparator="${condition.comparator}"`);
                builder.append(` label="${condition.label != null ? condition.label : "null"}"`);
                if (condition.value) {
                    builder.append(`>${condition.value}</condition>`).appendLine();
                }
                else {
                    builder.append(`/>`).appendLine();
                }
            });
        }

        function buildWorkflowItemSubelementList(list: WorkflowItemSubelementList) {
            builder.append("<workflow-subelements-list>").appendLine();
            builder.indent();
            const workflowSubelements = <WorkflowItem[]>(list["workflow-subelement"] || []);
            workflowSubelements.forEach(wfSub => {
                builder.append(`<workflow-subelement name="${wfSub.name}" linked-workflow-id="${wfSub["linked-workflow-id"]}">`).appendLine();
                builder.indent();
                if (wfSub["display-name"]) {
                    builder.append(`<display-name><![CDATA[${wfSub["display-name"]}]]></display-name>`).appendLine();
                }
                buildItemBindings((wfSub["in-binding"] || { bind: [] }).bind || [], "in-binding", true);
                buildItemBindings((wfSub["out-binding"] || { bind: [] }).bind || [], "out-binding", true);
                builder.unindent();
                builder.append(`</workflow-subelement>`).appendLine();
            });
            builder.unindent();
            builder.append("</workflow-subelements-list>").appendLine();
        }

        function buildItemAttibute(item: WorkflowItem, name: string) {
            if (item[name] != null) {
                builder.append(` ${name}="${item[name]}"`);
            }
        }

        function buildItemBindings(bindings: WorkflowItemBinding[], elementName: string, writeEmptyElement?: boolean) {
            if (bindings.length) {
                const bindingByName: Record<string, WorkflowItemBinding> = {};
                builder.append(`<${elementName}>`).appendLine();
                builder.indent();
                bindings.filter(binding => !bindingByName[binding.name]).forEach(binding => {
                    bindingByName[binding.name] = binding;
                    builder.append(`<bind name="${binding.name}"`);
                    builder.append(` type="${binding.type}"`);
                    if (binding["explicitly-not-bound"]) {
                        builder.append(` explicitly-not-bound="${binding["explicitly-not-bound"]}"`);
                    }
                    if (binding["export-name"]) {
                        builder.append(` export-name="${binding["export-name"]}"`);
                    }
                    if (binding.description) {
                        builder.append(`>`).appendLine();
                        builder.indent();
                        builder.append(`<description><![CDATA[${binding.description}]]></description>`).appendLine();
                        builder.unindent();
                        builder.append(`</bind>`).appendLine();
                    }
                    else {
                        builder.append(`/>`).appendLine();
                    }
                });
                builder.unindent();
                builder.append(`</${elementName}>`).appendLine();
            }
            else if (writeEmptyElement) {
                builder.append(`<${elementName}/>`).appendLine();
            }
        }

        function buildPresentation(presentation: WorkflowPresentation, writeEmptyElement?: boolean) {
            if (presentation && Object.keys(presentation).length) {
                builder.append(`<presentation>`).appendLine();
                builder.indent();
                if (presentation.desc) {
                    builder.append(`<desc><![CDATA[${presentation.desc}]]></desc>`).appendLine();
                }
                (presentation["p-param"] || []).forEach(param => buildPresentationParam(param));
                (presentation["p-step"] || []).forEach(step => buildPresentationStep(step));
                builder.unindent();
                builder.append(`</presentation>`).appendLine();
            }
            else if (writeEmptyElement) {
                builder.append(`<presentation/>`).appendLine();
            }
        }

        function buildPresentationParam(param: WorkflowPresentationParameter) {
            builder.append(`<p-param name="${param.name}">`).appendLine();
            builder.indent();
            if (param.desc) {
                builder.append(`<desc><![CDATA[${param.desc}]]></desc>`).appendLine();
            }
            (param["p-qual"] || []).forEach(prop => {
                builder.append(`<p-qual kind="${prop.kind}" name="${prop.name}" type="${prop.type}"><![CDATA[${prop.value}]]></p-qual>`).appendLine();
            });
            builder.unindent();
            builder.append(`</p-param>`).appendLine();
        }

        function buildPresentationStep(step: WorkflowPresentationStep) {
            builder.append(`<p-step>`).appendLine();
            builder.indent();
            builder.append(`<title><![CDATA[${step.title}]]></title>`).appendLine();
            if (step.desc) {
                builder.append(`<desc><![CDATA[${step.desc}]]></desc>`).appendLine();
            }
            (step["p-param"] || []).forEach(param => buildPresentationParam(param));
            (step["p-group"] || []).forEach(group => buildPresentationGroup(group));
            builder.unindent();
            builder.append(`</p-step>`).appendLine();
        }

        function buildPresentationGroup(group: WorkflowPresentationGroup) {
            builder.append(`<p-group>`).appendLine();
            builder.indent();
            builder.append(`<title><![CDATA[${group.title}]]></title>`).appendLine();
            if (group.desc) {
                builder.append(`<desc><![CDATA[${group.desc}]]></desc>`).appendLine();
            }
            (group["p-param"] || []).forEach(param => buildPresentationParam(param));
            builder.unindent();
            builder.append(`</p-group>`).appendLine();
        }

        function getAllowedOperations(op: string): string {
            switch (op || "") {
                case "vef":
                    return "evf";
                default:
                    return op || "vef";
            }
        }

        function formatNumber(num: number): string {
            let s = num.toString();
            if (s.lastIndexOf(".") < 0) {
                s += ".0";
            }
            return s;
        }
    }
}