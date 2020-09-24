/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const yaml: typeof import("js-yaml") = require("js-yaml");

    const SAGA_PREFIX = "__saga";
    const PARAM_INPUT_DATA = `${SAGA_PREFIX}In`;
    const PARAM_INPUT_ROLL = `${SAGA_PREFIX}Roll`;
    const PARAM_OUT_DATA = `${SAGA_PREFIX}Out`;
    const ATT_STATE = `${SAGA_PREFIX}State`;
    const ATT_ERROR = `${SAGA_PREFIX}Error`;
    const ATT_TRUE = `${SAGA_PREFIX}True`;
    const ATT_FALSE = `${SAGA_PREFIX}False`;

    interface SagaDescriptor {
        id: string;
        name: string;
        path: string;
        version: string;
        imports: string[];
        input: Record<string, InputParameter>;
        output: Record<string, OutputParameter>;
        tasks: Record<string, TaskDescriptor>;
    }

    interface InputParameter {
        type: string;
    }

    interface OutputParameter {
        type: string;
        source: string;
    }

    interface TaskDescriptor {
        execute: string;
        rollback: string;
        workflow: string;
    }

    export function getSagaTransformer(file: FileDescriptor, context: FileTransformationContext) {
        return transform;

        function transform() {
            const saga = loadSaga();
            const xmlTemplateFilePath = system.changeFileExt(file.filePath, ".xml");
            const xmlTemplate = system.fileExists(xmlTemplateFilePath) ? system.readFile(xmlTemplateFilePath).toString() : undefined;
            const workflow: WorkflowDescriptor = xmlTemplate ? mergeWorkflow(parseWorkflowXml(xmlTemplate), saga) : buildWorkflow(saga);
            const workflowXml = printWorkflowXml(workflow);
            const targetFilePath = system.changeFileExt(
                system.resolvePath(context.outputs.workflows, saga.path, saga.name),
                "",
                [".saga.yaml"]);
            context.writeFile(`${targetFilePath}.xml`, workflowXml);
            context.writeFile(`${targetFilePath}.element_info.xml`, printElementInfo({
                categoryPath: saga.path.replace(/(\\|\/)/g, "."),
                name: saga.name,
                type: "Workflow",
                id: saga.id,
            }));
        }

        function loadSaga(): SagaDescriptor {
            const saga: SagaDescriptor = yaml.safeLoad(system.readFile(file.filePath).toString());
            saga.name = saga.name || system.changeFileExt(file.fileName, "", [".saga.yaml"]);
            saga.path = saga.path || system.joinPath(context.workflowsNamespace || "", system.dirname(file.relativeFilePath));
            saga.id = saga.id || generateElementId(FileType.Workflow, `${saga.path}/${saga.name}`);
            saga.tasks = saga.tasks || {};

            saga.input = Object.keys(saga.input || {}).reduce((obj, key) => {
                if (typeof obj[key] === "string") {
                    obj[key] = <InputParameter>{
                        type: <any>obj[key],
                    };
                }
                return obj;
            }, saga.input || {});

            saga.output = Object.keys(saga.output || {}).reduce((obj, key) => {
                if (typeof obj[key] === "string") {
                    obj[key] = <OutputParameter>{
                        type: <any>obj[key],
                    };
                }
                return obj;
            }, saga.output || {});

            return saga;
        }

        function buildWorkflow(saga: SagaDescriptor): WorkflowDescriptor {
            const workflow: WorkflowDescriptor = {
                id: saga.id,
                "object-name": "workflow:name=generic",
                "display-name": saga.name,
                version: "1.0.0",
                "allowed-operations": "vef",
                restartMode: 1,
                resumeFromFailedMode: 0,
                position: {
                    x: 105,
                    y: 45.90909090909091,
                },
            };

            const hasWorkflowTasks = Object.values(saga.tasks).some(t => !!t.workflow);

            buildWorkflowInput(workflow, saga.input);
            buildWorkflowOutput(workflow, saga.output);
            buildWorkflowAttributes(workflow, hasWorkflowTasks);
            buildWorkflowTasks(workflow, saga);
            buildWorkflowPresentation(workflow, saga);

            return workflow;
        }

        function buildWorkflowInput(workflow: WorkflowDescriptor, input?: Record<string, InputParameter>): void {
            const workflowInput = workflow.input || (workflow.input = {});
            const params = workflowInput.param || (workflowInput.param = []);

            addParameter(params, {
                name: PARAM_INPUT_DATA,
                type: "Any",
            });

            addParameter(params, {
                name: PARAM_INPUT_ROLL,
                type: "boolean",
            });

            if (input) {
                Object.keys(input).forEach(name => {
                    const param = input[name];
                    addParameter(params, {
                        name: name,
                        type: param.type,
                    });
                });
            }
        }

        function buildWorkflowOutput(workflow: WorkflowDescriptor, output?: Record<string, OutputParameter>): void {
            const workflowOutput = workflow.output || (workflow.output = {});
            const params = workflowOutput.param || (workflowOutput.param = []);

            addParameter(params, {
                name: PARAM_OUT_DATA,
                type: "Any",
            });


            if (output) {
                Object.keys(output).forEach(name => {
                    const param = output[name];
                    addParameter(params, {
                        name: name,
                        type: param.type,
                    });
                });
            }
        }

        function buildWorkflowAttributes(workflow: WorkflowDescriptor, hasBoolAttributes?: boolean): void {
            const attributes = workflow.attrib || (workflow.attrib = []);

            addAttribute(attributes, {
                name: ATT_STATE,
                type: "Any",
            });

            addAttribute(attributes, {
                name: ATT_ERROR,
                type: "string",
            });

            if (hasBoolAttributes) {
                addAttribute(attributes, {
                    name: ATT_TRUE,
                    type: "boolean",
                    value: "true"
                });

                addAttribute(attributes, {
                    name: ATT_FALSE,
                    type: "boolean",
                    value: "false"
                });
            }
        }

        function addParameter(params: WorkflowParameter[], param: WorkflowParameter): boolean {
            if (!params.some(p => p.name === param.name)) {
                params.push(param);
            }
            return false;
        }

        function addAttribute(atts: WorkflowAttribute[], att: WorkflowAttribute): boolean {
            if (!atts.some(a => a.name === att.name)) {
                atts.push(att);
            }
            return false;
        }

        function buildWorkflowTasks(workflow: WorkflowDescriptor, saga: SagaDescriptor): void {
            const items = workflow["workflow-item"] = [];
            const taskCount = Object.keys(saga.tasks).length;

            let nextItemId = 0;
            let startItemId: number;
            let finishSuccessItemId: number;
            let finishRollbackItemId: number;

            buildPrologueItems();
            buildItems(saga);

            workflow["root-name"] = getItemName(startItemId);

            function buildPrologueItems(): void {
                // End with success
                const endSuccessItemId = nextItemId;
                items.push({
                    name: getItemName(nextItemId++),
                    type: "end",
                    "end-mode": 0,
                    position: {
                        x: 585 + (taskCount + 1) * 160,
                        y: 45.40909090909091
                    },
                });

                // End rollback with success
                const endRollbackWithSuccessItemId = nextItemId;
                items.push({
                    name: getItemName(nextItemId++),
                    type: "end",
                    "end-mode": 0,
                    position: {
                        x: 265.0,
                        y: 190.86363636363635
                    },
                });

                // End rollback with error
                const endRollbackWithFailureItemId = nextItemId;
                items.push({
                    name: getItemName(nextItemId++),
                    type: "end",
                    "end-mode": 1,
                    "throw-bind-name": ATT_ERROR,
                    position: {
                        x: 105,
                        y: 118.13636363636363
                    },
                });

                // Finish
                finishSuccessItemId = nextItemId;
                items.push({
                    name: getItemName(nextItemId++),
                    type: "task",
                    "display-name": "Finish",
                    "out-name": getItemName(endSuccessItemId),
                    position: {
                        x: 545 + taskCount * 160,
                        y: 55.40909090909091
                    },
                    script: {
                        value: buildFinishScript(saga),
                    },
                    "in-binding": {
                        bind: [
                            {
                                name: ATT_STATE,
                                type: "Any",
                                "export-name": ATT_STATE,
                            }
                        ],
                    },
                    "out-binding": {
                        bind: [
                            {
                                name: PARAM_OUT_DATA,
                                type: "Any",
                                "export-name": PARAM_OUT_DATA,
                            },
                            ...Object.keys(saga.output).map(name => <WorkflowItemBinding>{
                                name: name,
                                type: saga.output[name].type,
                                "export-name": name,
                            }),
                        ]
                    }
                });

                // Is Not Rollback error?
                const isNotRollbackErrorItemId = nextItemId;
                items.push({
                    name: getItemName(nextItemId++),
                    type: "custom-condition",
                    "display-name": "Is Not Rollback?",
                    "out-name": getItemName(endRollbackWithFailureItemId),
                    "alt-out-name": getItemName(endRollbackWithSuccessItemId),
                    position: {
                        x: 225.0,
                        y: 118.13636363636363
                    },
                    script: {
                        value: `return !${PARAM_INPUT_ROLL};`
                    },
                    "in-binding": {
                        bind: [
                            {
                                name: PARAM_INPUT_ROLL,
                                type: "boolean",
                                "export-name": PARAM_INPUT_ROLL,
                            }
                        ],
                    },
                });

                // Finish rollback
                finishRollbackItemId = nextItemId;
                items.push({
                    name: getItemName(nextItemId++),
                    type: "task",
                    "display-name": "Finish rollback",
                    "out-name": getItemName(isNotRollbackErrorItemId),
                    position: {
                        x: 385.0,
                        y: 128.13636363636363
                    },
                    script: {
                        value: `${PARAM_OUT_DATA} = ${ATT_STATE};`
                    },
                    "in-binding": {
                        bind: [
                            {
                                name: ATT_STATE,
                                type: "Any",
                                "export-name": ATT_STATE,
                            }
                        ],
                    },
                    "out-binding": {
                        bind: [
                            {
                                name: PARAM_OUT_DATA,
                                type: "Any",
                                "export-name": PARAM_OUT_DATA,
                            }
                        ]
                    }
                });

                // Is Not Rollback start?
                const isRollbackItem: WorkflowItem = {
                    name: getItemName(nextItemId++),
                    type: "custom-condition",
                    "display-name": "Is Not Rollback?",
                    position: {
                        x: 385.0,
                        y: 45.40909090909091
                    },
                    script: {
                        value: `return !${PARAM_INPUT_ROLL};`
                    },
                    "in-binding": {
                        bind: [
                            {
                                name: PARAM_INPUT_ROLL,
                                type: "boolean",
                                "export-name": PARAM_INPUT_ROLL,
                            }
                        ],
                    },
                };
                items.push(isRollbackItem);

                // Start
                startItemId = nextItemId;
                items.push({
                    name: getItemName(nextItemId++),
                    type: "task",
                    "display-name": "Start",
                    "out-name": isRollbackItem.name,
                    position: {
                        x: 225.0,
                        y: 55.40909090909091
                    },
                    script: {
                        value: buildStartScript(),
                    },
                    "in-binding": {
                        bind: [
                            {
                                name: PARAM_INPUT_DATA,
                                type: "Any",
                                "export-name": PARAM_INPUT_DATA,
                            }
                        ],
                    },
                    "out-binding": {
                        bind: [
                            {
                                name: ATT_STATE,
                                type: "Any",
                                "export-name": ATT_STATE,
                            }
                        ]
                    }
                });

                isRollbackItem["out-name"] = getItemName(items.length);
                isRollbackItem["alt-out-name"] = getItemName(items.length + (taskCount * 2) - 1);
            }

            function buildItems(saga: SagaDescriptor): void {
                Object.keys(saga.tasks).forEach((taskName, i) => {
                    buildItem(saga, taskName, saga.tasks[taskName], i);
                });
            }

            function buildItem(saga: SagaDescriptor, taskName: string, task: TaskDescriptor, index: number): void {
                const isFirst = index === 0;
                const isLast = taskCount - 1 === index;
                const executeItemId = nextItemId++;
                const rollbackItemId = nextItemId++;
                const posX = 545 + index * 160;

                if (task.workflow) {
                    // Execute
                    items.push({
                        name: getItemName(executeItemId),
                        type: "link",
                        "display-name": taskName,
                        "linked-workflow-id": task.workflow,
                        "out-name": isLast ? getItemName(finishSuccessItemId) : getItemName(nextItemId),
                        "catch-name": isFirst ? getItemName(finishRollbackItemId) : getItemName(executeItemId - 1),
                        "throw-bind-name": ATT_ERROR,
                        position: {
                            x: posX,
                            y: 55.40909090909091,
                        },
                        "in-binding": {
                            bind: [
                                {
                                    name: PARAM_INPUT_DATA,
                                    type: "Any",
                                    "export-name": ATT_STATE,
                                },
                                {
                                    name: PARAM_INPUT_ROLL,
                                    type: "boolean",
                                    "export-name": ATT_FALSE,
                                }
                            ],
                        },
                        "out-binding": {
                            bind: [
                                {
                                    name: PARAM_OUT_DATA,
                                    type: "Any",
                                    "export-name": ATT_STATE,
                                }
                            ]
                        }
                    });

                    // Rollback
                    items.push({
                        name: getItemName(rollbackItemId),
                        type: "link",
                        "display-name": `${taskName} rollback`,
                        "linked-workflow-id": task.workflow,
                        "out-name": isFirst ? getItemName(finishRollbackItemId) : getItemName(executeItemId - 1),
                        position: {
                            x: posX,
                            y: 128.13636363636363,
                        },
                        "in-binding": {
                            bind: [
                                {
                                    name: PARAM_INPUT_DATA,
                                    type: "Any",
                                    "export-name": ATT_STATE,
                                },
                                {
                                    name: PARAM_INPUT_ROLL,
                                    type: "boolean",
                                    "export-name": ATT_TRUE,
                                }
                            ],
                        },
                        "out-binding": {
                            bind: [
                                {
                                    name: PARAM_OUT_DATA,
                                    type: "Any",
                                    "export-name": ATT_STATE,
                                }
                            ]
                        }
                    });
                }
                else {
                    // Execute
                    items.push({
                        name: getItemName(executeItemId),
                        type: "task",
                        "display-name": taskName,
                        "out-name": isLast ? getItemName(finishSuccessItemId) : getItemName(nextItemId),
                        "catch-name": isFirst ? getItemName(finishRollbackItemId) : getItemName(executeItemId - 1),
                        "throw-bind-name": ATT_ERROR,
                        position: {
                            x: posX,
                            y: 55.40909090909091,
                        },
                        script: {
                            value: buildExecuteScript(saga, taskName, task),
                        },
                        "in-binding": {
                            bind: [
                                {
                                    name: ATT_STATE,
                                    type: "Any",
                                    "export-name": ATT_STATE,
                                }
                            ],
                        },
                        "out-binding": {
                            bind: [
                                {
                                    name: ATT_STATE,
                                    type: "Any",
                                    "export-name": ATT_STATE,
                                }
                            ]
                        }
                    });

                    // Rollback
                    items.push({
                        name: getItemName(rollbackItemId),
                        type: "task",
                        "display-name": `${taskName} rollback`,
                        "out-name": isFirst ? getItemName(finishRollbackItemId) : getItemName(executeItemId - 1),
                        position: {
                            x: posX,
                            y: 128.13636363636363,
                        },
                        script: {
                            value: buildRollbackScript(saga, taskName, task)
                        },
                        "in-binding": {
                            bind: [
                                {
                                    name: ATT_STATE,
                                    type: "Any",
                                    "export-name": ATT_STATE,
                                }
                            ],
                        },
                        "out-binding": {
                            bind: [
                                {
                                    name: ATT_STATE,
                                    type: "Any",
                                    "export-name": ATT_STATE,
                                }
                            ]
                        }
                    });
                }
            }

            function getItemName(itemId: number): string {
                return `item${itemId}`;
            }
        }

        function buildStartScript(): string {
            const builder = createStringBuilder();
            builder.append(`function notInternalName(name) {`).appendLine();
            builder.indent();
            builder.append(`return name.indexOf("${SAGA_PREFIX}") !== 0;`).appendLine();
            builder.unindent();
            builder.append(`}`).appendLine();
            builder.append(`${ATT_STATE} = ${PARAM_INPUT_DATA} || {};`).appendLine();
            builder.append(`var systemContext = System.getContext();`).appendLine();
            builder.append(`if (systemContext) {`).appendLine();
            builder.indent();
            builder.append(`(systemContext.parameterNames() || []).filter(notInternalName).forEach(function (name) { ${ATT_STATE}[name] = systemContext.getParameter(name); });`).appendLine();
            builder.unindent();
            builder.append(`}`).appendLine();
            builder.append(`if (workflow) {`).appendLine();
            builder.indent();
            builder.append(`var attributes = workflow.getAttributes();`).appendLine();
            builder.append(`(attributes.keys || []).filter(notInternalName).forEach(function (name) { ${ATT_STATE}[name] = attributes.get(name); });`).appendLine();
            builder.append(`var inputParameters = workflow.getInputParameters();`).appendLine();
            builder.append(`(inputParameters.keys || []).filter(notInternalName).forEach(function (name) { ${ATT_STATE}[name] = inputParameters.get(name); });`).appendLine();
            builder.unindent();
            builder.append(`}`).appendLine();
            return builder.toString();
        }

        function buildFinishScript(saga: SagaDescriptor): string {
            const builder = createStringBuilder();
            builder.append(`function getValue(ognl) {`).appendLine();
            builder.indent();
            builder.append(`return ognl.split(".").reduce(function(obj,name) { return (obj || {})[name] },  ${ATT_STATE});`).appendLine();
            builder.unindent();
            builder.append(`}`).appendLine();
            builder.append(`${PARAM_OUT_DATA} = ${ATT_STATE};`).appendLine();

            Object.keys(saga.output).forEach(name => {
                const param = saga.output[name];
                if (param.source) {
                    builder.append(`${name} = getValue("${param.source}");`).appendLine();
                }
            });

            return builder.toString();
        }

        function buildExecuteScript(saga: SagaDescriptor, taskName: string, task: TaskDescriptor): string {
            const builder = createStringBuilder();
            builder.append(`System.log("Executing '${taskName}'...");`).appendLine();
            if (task.execute) {
                buildRequireModuleScript(builder, saga, task.execute);
                builder.append(`var action = requireModule();`).appendLine();
                builder.append(`try {`).appendLine();
                builder.indent();
                builder.append(`(action.execute || action.default)(${ATT_STATE});`).appendLine();
                builder.unindent();
                builder.append(`}`).appendLine();
                builder.append(`catch (e) {`).appendLine();
                builder.indent();
                builder.append(`System.error(e);`).appendLine();
                builder.append(`throw e;`).appendLine();
                builder.unindent();
                builder.append(`}`).appendLine();
            }
            return builder.toString();
        }

        function buildRollbackScript(saga: SagaDescriptor, taskName: string, task: TaskDescriptor): string {
            const builder = createStringBuilder();
            builder.append(`System.log("Rolling back '${taskName}'...");`).appendLine();
            if (task.rollback) {
                buildRequireModuleScript(builder, saga, task.rollback);
                builder.append(`try {`).appendLine();
                builder.indent();
                builder.append(`var action = requireModule();`).appendLine();
                builder.append(`(action.rollback || action.default)(${ATT_STATE});`).appendLine();
                builder.unindent();
                builder.append(`}`).appendLine();
                builder.append(`catch (e) {`).appendLine();
                builder.indent();
                builder.append(`System.error(e.toString() + ". Failed to rollback  '${taskName}'.");`).appendLine();
                builder.unindent();
                builder.append(`}`).appendLine();
            }
            return builder.toString();
        }

        function buildRequireModuleScript(builder: StringBuilder, saga: SagaDescriptor, taskName: string): void {
            builder.append(`function requireModule() {`).appendLine();
            builder.indent();
            if (taskName.indexOf(".") > -1) {
                builder.append(`var VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();`).appendLine();
                builder.append(`return VROES.require("${taskName}");`).appendLine();
            }
            else {
                builder.append(`var actionName = "${taskName}"`).appendLine();
                builder.append(`var imports = [${saga.imports.map(x => `"${x}"`).join(", ")}];`).appendLine();
                builder.append(`for (var i = 0; i < imports.length; i++) {`).appendLine();
                builder.indent();
                builder.append(`var moduleName = imports[i];`).appendLine();
                builder.append(`var mod = System.getModule(moduleName);`).appendLine();
                builder.append(`for (var j = 0; j < mod.actionDescriptions.length; j++) {`).appendLine();
                builder.indent();
                builder.append(`var action = mod.actionDescriptions[j];`).appendLine();
                builder.append(`if (action.name === actionName) {`).appendLine();
                builder.indent();
                builder.append(`var VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();`).appendLine();
                builder.append(`return VROES.require(moduleName + "." + actionName);`).appendLine();
                builder.unindent();
                builder.append(`}`).appendLine();
                builder.unindent();
                builder.append(`}`).appendLine();
                builder.unindent();
                builder.append(`}`).appendLine();
                builder.append(`throw new Error("Unable to resolve action '" + actionName + "'");`).appendLine();
            }
            builder.unindent();
            builder.append(`}`).appendLine();
        }

        function buildWorkflowPresentation(workflow: WorkflowDescriptor, saga: SagaDescriptor): void {
            workflow.presentation = workflow.presentation || {};
            const params = workflow.presentation["p-param"] || (workflow.presentation["p-param"] = []);
            params.push({
                name: PARAM_INPUT_DATA,
                "p-qual": [{
                    name: "notVisible",
                    type: "boolean",
                    kind: "ognl",
                    value: "true",
                }]
            });

            params.push({
                name: PARAM_INPUT_ROLL,
                "p-qual": [{
                    name: "notVisible",
                    type: "boolean",
                    kind: "ognl",
                    value: "true",
                }]
            });
        }

        function mergeWorkflow(workflow: WorkflowDescriptor, saga: SagaDescriptor): WorkflowDescriptor {
            workflow.id = saga.id;
            workflow["display-name"] = saga.name;
            workflow.position = {
                x: 105,
                y: 45.90909090909091,
            };

            workflow["workflow-item"] = [];
            const hasWorkflowTasks = Object.values(saga.tasks).some(t => !!t.workflow);

            buildWorkflowInput(workflow, saga.input);
            buildWorkflowOutput(workflow, saga.output);
            buildWorkflowAttributes(workflow, hasWorkflowTasks);
            buildWorkflowTasks(workflow, saga);
            buildWorkflowPresentation(workflow, saga);

            return workflow;
        }
    }
}
