/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */


import * as fs from "fs-extra"
import * as request from "request-promise-native"
import { BaseConfiguration } from "../platform"
import { Auth, VraNGAuth } from "./auth"
import * as vscode from "vscode"
import { Logger } from ".."


export interface Blueprint {
    id: string
    createdAt: Date
    createdBy: string
    updatedAt: Date
    updatedBy: string
    orgId: string
    projectId: string
    projectName: string
    selfLink: string
    name: string
    description: string
    status: string
    content: string
    valid: boolean
    validationMessages: Array<string>
    totalVersions: number
    totalReleasedVersions: number
    requestScopeOrg: boolean
    contentSourceSyncMessages: Array<string>
}

export class VraNGRestClient {
    private readonly logger = Logger.get("VraNGRestClient")
    private static ACCESS_TOKEN: string = ""
    private readonly confFile = "settings.json"
    private scope: string = "any" //TODO: if to be used, move in conf file

    constructor( private conf: BaseConfiguration, private env?: any ) {
        // empty
    }

    private get authProfile(): string {
        return this.conf.vrdev.auth.profile || ""
    }

    private get host(): string | undefined {
        return this.conf.vrdev.auth.host
    }

    private get port(): number | undefined {
        if(this.conf.vrdev.auth.port === undefined || isNaN(Number(this.conf.vrdev.auth.port))) {
            return undefined;
        }
        else {
            return parseInt(this.conf.vrdev.auth.port, 10)
        }
    }

    private get domain(): string {
        return this.conf.vrdev.auth.domain || ""
    }

    private get refreshToken(): string | undefined {
        return this.conf.vrdev.auth.refreshToken
    }
   
    /**
     * The main API for obtaining token. There are different methods to do it.
     * Which one to use is controlled by auth.profile value in settings.json
     * @returns a Promise with the access token or empty sting if it fails to get it
     */
    public getAccessToken() : Promise<string> {
        const useUpdUrl: string  = "/csp/gateway/am/idp/auth/login?access_token"
        const useRefTokUrl: string =  "/iaas/api/login"
        const baseUrl: string = "https://" + this.host + ":" + this.port

        // Use an existing access_token
        if(VraNGRestClient.ACCESS_TOKEN !== undefined && VraNGRestClient.ACCESS_TOKEN != ""){
            this.logger.info(`VraNGRestClient:getAccessToken() -- REUSING ACCESS TOKEN -- `);
            return Promise.resolve(VraNGRestClient.ACCESS_TOKEN);
        }
        
        this.logger.info(`VraNGRestClient:getAccessToken() using auth profile = ${this.authProfile}`)  
        switch (this.authProfile.toLowerCase()) {
            case "refresh-token":    
                // If refresh token does not exists in local storage, ask for usr/passwd
                if( this.refreshToken === undefined || this.refreshToken === null ) {
                    return this.getAccessTokenUPD(this.domain, baseUrl + useUpdUrl) 
                }
                else {
                    return this.getNewAccessToken(this.refreshToken, baseUrl + useRefTokUrl)
                }
                
            case "user-password-domain":
                return this.getAccessTokenUPD(this.domain, baseUrl + useUpdUrl)
                
            default:
                this.logger.error(`VraNGRestClient:getAccessToken() auth profile ${this.authProfile} not supported`)
                return Promise.reject("")
        }
    }

    /**
     * Get access token by given: user, password, domain
     * @param usr 
     * @param psswd 
     * @param domain 
     * @param uri
     * @return resolved promise with the token or empty string on failure
     */
    private async getAccessTokenUPD(domain: string, uri: string) : Promise<string> {
        this.logger.info(`getAccessTokenUPD() url=${uri}`);
        let userName: vscode.InputBoxOptions = {
			prompt: "Enter User Name to Authenticate with " + this.host + ": ",
			placeHolder: "(USER NAME)",
        };
        var user = await vscode.window.showInputBox(userName)

        let passWord: vscode.InputBoxOptions = {
			prompt: "Enter Password: ",
			placeHolder: "(PASSWORD)",
        };
        var passw = await vscode.window.showInputBox(passWord)

        interface Token {
            token_type: string
            expires?: number
            access_token: string
            refresh_token: string
        }
        try {
            const options = {
                simple: true, 
                resolveWithFullResponse: false,
                rejectUnauthorized: false,
                headers: {
                    Accept: "application/json"
                },
                json: true,
                method: "POST",
                uri,
                body: { 
                        "domain": this.domain,
                        "password": passw,
                        "scope": this.scope,
                        "username": user
                      }
            }          
            const aToken: Token = await request(options);
            this.logger.info(`getAccessTokenUPD() refresh_token found ${aToken.refresh_token}`);
            VraNGRestClient.ACCESS_TOKEN = aToken.access_token;
            if( this.refreshToken === undefined || this.refreshToken === null ) {
                // TODO: For now store refresh token in stettings.json 
                // Perhaps use node-localstorage or token-file in .o11n/tokens
                let settingsPath = this.env.workspaceFolders[0].uri.path + "/.vscode/" + this.confFile;
                const settingsContent = fs.readFileSync(settingsPath)
                const settingsJson = JSON.parse(settingsContent.toString("utf8"))
                settingsJson["vrdev.auth.refreshToken"] = aToken.refresh_token
                fs.writeFileSync(settingsPath, JSON.stringify(settingsJson))
            }
        }
        catch(err){
            this.logger.error(`getAccessTokenUPD() exception thrown, excp= ${err.toString()}`);
            return Promise.reject(err.toString());
        }
        this.logger.debug(`getAccessTokenUPD() Access Token ${VraNGRestClient.ACCESS_TOKEN}`);
        return Promise.resolve(VraNGRestClient.ACCESS_TOKEN);
    }

    /**
     * By given refresh token, fetch new access token from the Auth Server
     * @param refreshToken 
     * @param uri - URI of Auth Server
     * @return resolved promise with the access token on success or an empty string on failure
     */
    private async getNewAccessToken(refreshToken: string, uri: string) : Promise<string> {    
        this.logger.info(`getNewAccessToken() url=${uri}, refTok=${refreshToken}`);
        var accessToken: string = "";
        interface Token {
            tokenType: string;
            token: string;
        }
        try {
            const options = {
                simple: true, 
                resolveWithFullResponse: false,
                rejectUnauthorized: false,
                headers: {
                    Accept: "application/json"
                },
                json: true,
                method: "POST",
                uri,
                body: {"refreshToken": refreshToken}
            }
            const tok: Token = await request(options);
            accessToken = tok.token;
        }
        catch(err){
            this.logger.error(`getNewAccessToken() exception thrown, excp= ${err.toString()}`);
            return Promise.reject(err.toString());
        }
        this.logger.debug(`getNewAccessToken() Access Token ${accessToken}`);
        return Promise.resolve(accessToken);
    }

    // -----------------------------------------------------------
    // BluePrint related APIs ------------------------------------
    // -----------------------------------------------------------
       

    /**
     * Fetch Blueprint file from VRA by given blueprint GUID and write its content into filePath
     * @param uri 
     * @param filePath 
     * @param accessToken 
     */
    async getBlueprintById(uri: string, filePath: string, accessToken: string): Promise<void> {
        let au: Auth = new VraNGAuth(accessToken)
        const options = {
            simple: true,
            resolveWithFullResponse: false,
            rejectUnauthorized: false,
            headers: {
                Accept: "application/json"
            },
            json: false,
            method: "GET",
            uri,
            auth: au.toRequestJson()
        }
        this.logger.info(`getBluePrintById: Sending GET to ${uri}`)
        const rt: Blueprint = await request(options).then( res => { return JSON.parse(res)})
        this.logger.info(`getBluePrintById: content =  ${rt.content}`)
        return fs.writeFile(filePath, rt.content)
    }

    /**
     * Return the blueprint GUID by given Blueprint Name
     * @param uri 
     * @param accessToken 
     * @returns resolved Promise with blueprint id or empty string on failure  
     */
    async getBlueprintByName(uri: string,  accessToken: string): Promise<string> {
        let au: Auth = new VraNGAuth(accessToken)

        interface Sort {sorted: boolean, unsorted: boolean, empty: boolean }

        interface AllBps {
            content?: Array<Blueprint>
            pageable?: { sort: Sort, offset: number, pageSize: number, pageNumber: number, unpaged: boolean, paged: boolean}
            totalElements?: number
            totalPages?: number
            last?: boolean
            first?: boolean
            size?: number
            number?: number
            sort?: Sort
            numberOfElements: number
            empty?: boolean
        }

        const options = {
            simple: true,
            resolveWithFullResponse: false,
            rejectUnauthorized: false,
            headers: {
                Accept: "application/json"
            },
            json: false,
            method: "GET",
            uri,
            auth: au.toRequestJson()
        }
        
        this.logger.info(`getBluePrintByName: Sending GET to ${uri}`)
        var abp = await request(options)
        var ret: AllBps = JSON.parse(abp)
        return new Promise((resolve,reject) => {
            if(ret != null && typeof ret.content != "undefined" && ret.content.length > 0){
                this.logger.info(`getBluePrintByName: number-Of-Elements=${ret.numberOfElements} Id=${ret.content[0].id}`)
                // Normally array is sorted and latest Blueprint will be arr[0]
                // TODO: if array not sorted (ret.sort.sorted == false), traverse and sort by Date to return latest doc
                resolve(ret.content[0].id)
                
            }
            else reject("")
        })
    }

    /**
     * Save blueprint file to VRA.
     * @param inBody - content and projectId passed here
     * @param accessToken 
     * @returns promise with the id of the newly created blueprint
     */
    async saveBlueprint(inBody: any, accessToken?: string): Promise<string> { 
        if(accessToken === undefined){
            accessToken = await this.getAccessToken();
        }    
        let au: Auth = new VraNGAuth(accessToken) 
        const uri = `https://${this.host}/blueprint/api/blueprints`
        const options = {
            simple: true, 
            resolveWithFullResponse: false,
            rejectUnauthorized: false,
            headers: {
                Accept: "application/json"
            },
            json: true,
            method: "POST",
            uri,
            body: inBody,
            auth: au.toRequestJson()
        }
        const execResponse = await request(options)
        this.logger.info(`saveBluePrint: ${execResponse}`)
        
        if(execResponse === null || execResponse === undefined){
            return Promise.reject("Failed to save Blueprint File on vRA");
        }
        else {
            this.logger.info(`saveBluePrint: newly crerated Id= ${execResponse.id}`)
            return Promise.resolve(execResponse.id);
        }
    }

    /**
     * Deploy given blueprint. It is not necessary to exist on VRA beforehand.
     * @param inBody - contains deployment name, content, project Id, etc.
     * @param accessToken 
     */
    async deployBlueprint(inBody: any, accessToken?: string) : Promise<void> {
        this.logger.info("deployBlueprint --- started ---");
        if(accessToken === undefined){
            accessToken = await this.getAccessToken();
        }
        let au: Auth = new VraNGAuth(accessToken) 
        const uri = `https://${this.host}/blueprint/api/blueprint-requests`
        const options = {
            simple: true, 
            resolveWithFullResponse: false,
            rejectUnauthorized: false,
            headers: {
                Accept: "application/json"
            },
            json: true,
            method: "POST",
            uri,
            body: inBody,
            auth: au.toRequestJson()
        }
        const execResponse = await request(options)
        if(execResponse == null || execResponse === undefined || execResponse.status !== "STARTED"){
            return Promise.reject()
        }
        this.logger.info(`deployBluePrint: deployed=${execResponse.deploymentName}, status=${execResponse.status}`)
        return Promise.resolve()
    }


    /**
     * Get VRA project Id by given project Name
     * @param projectName 
     * @param accessToken 
     * @returns Promise  with project GUID or error message on failure
     */
    async getProjectId( projectName: string, accessToken?: string) : Promise<string>{
        this.logger.info("getProjectId: -- started --");
        if(accessToken === undefined){
            accessToken = await this.getAccessToken();
        }
       
        let au: Auth = new VraNGAuth(accessToken) 
        const baseUrl: string = "https://" + this.host + ":" + this.port
        const projFilterUrl = "/iaas/api/projects?%24filter=name+eq+%27";
        const uri = baseUrl + projFilterUrl + encodeURIComponent(projectName) + "%27";

        const options = {
            simple: true,
            resolveWithFullResponse: false,
            rejectUnauthorized: false,
            headers: {
                Accept: "application/json"
            },
            json: true,
            method: "GET",
            uri,
            auth: au.toRequestJson()
        }
        
        try{
            this.logger.info(`getProjectId: Sending GET to ${uri}`)
            var resp = await request(options)
            this.logger.info(`getProjectId: elements=${resp.totalElements}, projId=${resp.content[0].id}`)
        }
        catch(err){
            this.logger.error(`getProjectId: excp=${err.toString()}`)  
            return Promise.reject("Getting vRAProject Id failed")
        }

        return Promise.resolve(resp.content[0].id)
    }
}
