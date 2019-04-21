/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, uri, VroRestClient } from "vrealize-common"
import URI from "vscode-uri"

import { remote } from "../../public"
import { ConnectionLocator, Environment, Settings } from "../core"

@AutoWire
export class SourceProvider {
    private readonly restClient: VroRestClient

    constructor(settings: Settings, environment: Environment, connectionLocator: ConnectionLocator) {
        connectionLocator.connection.onRequest(remote.server.giveEntitySource, this.giveEntitySource.bind(this))

        this.restClient = new VroRestClient(settings, environment)
    }

    async giveEntitySource(location: string): Promise<string> {
        const uriTokens = uri.uriToLocation(URI.parse(location))
        const id = uriTokens.id ? uriTokens.id : `${uriTokens.path}/${uriTokens.name}`

        const inParams = this.prepareInputParams(id, uriTokens.type)
        const outParams = await this.restClient.executeWorkflow("96b1099c-697e-48ed-999f-7a9d73453b4a", ...inParams)
        const sourceParam = !!outParams && outParams.length > 0 ? outParams[0] : undefined

        if (
            !sourceParam ||
            sourceParam.name !== "source" ||
            !sourceParam.value ||
            !sourceParam.value.string ||
            !sourceParam.value.string.value
        ) {
            throw new Error("Missing output parameter: source")
        }

        return sourceParam.value.string.value
    }

    private prepareInputParams(id: string, type: string) {
        return [
            {
                name: "type",
                type: "string",
                value: {
                    string: { value: type }
                }
            },
            {
                name: "id",
                type: "string",
                value: {
                    string: { value: id }
                }
            }
        ]
    }
}
