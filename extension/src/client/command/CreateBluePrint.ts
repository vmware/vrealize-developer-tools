/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger } from "vrealize-common"
import * as vscode from "vscode"
import { Commands } from "../constants"
import { Command } from "./Command"
import { ConfigurationManager, EnvironmentManager } from "../system"
import * as path from "path"; 


@AutoWire
export class CreateBluePrint extends Command {
    private readonly logger = Logger.get("CreateBluePrint")
    private env: EnvironmentManager
    
    get commandId(): string {
        return Commands.CreateBluePrint
    }

    constructor(environment: EnvironmentManager, config: ConfigurationManager) {
        super()
        this.env = environment
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        var self = this;
        this.logger.info("Executing command CreateBluePrint");        
        
        let name: vscode.InputBoxOptions = {
            prompt: "Enter a Blueprint name: ",
            placeHolder: "(BLUEPRINT NAME)"
        };

        var blueprintName = await vscode.window.showInputBox(name);
        if (!blueprintName) {
            self.logger.info("CreateBluePrint:exec() blueprintName does not exist");
            return Promise.reject("Invalid Blueprint Name");
        }
        vscode.window.showInformationMessage('Start editing this file to create your blueprint!');

        //create a new file in the user's current VScode directory with the name they have provided
        const newFile = vscode.Uri.parse('untitled:' + path.join(this.env.workspaceFolders[0].uri.path, blueprintName + '.yaml'));
        
        var document = await vscode.workspace.openTextDocument(newFile);
        const edit = new vscode.WorkspaceEdit();
        
        //insert necessities of a BP in yaml file for increased chances of validation (name, version, formatVersion, inputs, resources)
        edit.insert(newFile, new vscode.Position(0, 0), "name: " + blueprintName + "\ninputs: {}\nresources:\n");

        var retVal = await vscode.workspace.applyEdit(edit);
        if(retVal){
            vscode.window.showTextDocument(document);
        }
        else{
            self.logger.info("CreateBluePrint:exec() Error whuile showing text doc");
            vscode.window.showInformationMessage('Error!');
        }
    } //execute
}
