/*
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

const Octokit = require("@octokit/rest")
const log = require("fancy-log")
const fs = require("fs-extra")

const REPO_OWNER = "vmware"
const REPO_NAME = "vrealize-developer-tools"
const MASTER_REF = "heads/master"

module.exports = async function() {
    if (!process.env.GITHUB_SECRET) {
        throw new Error("Missing GitHub secret")
    }

    if (!process.env.RELEASE_VERSION) {
        throw new Error("Missing release version")
    }

    const octokit = new Octokit({
        auth: `token ${process.env.GITHUB_SECRET}`
    })

    const packageJson = require("../package.json")
    const releaseVersion = process.env.RELEASE_VERSION

    // update version in package.json
    log.info(`Setting version to ${releaseVersion}...`)
    packageJson.version = releaseVersion
    const content = JSON.stringify(packageJson, null, 2)
    fs.writeFileSync("../package.json", content, { encoding: "utf8" })

    // commit changes
    log.info("Committing changes...")
    const repo = { owner: REPO_OWNER, repo: REPO_NAME }

    const blob = await octokit.git.createBlob({ ...repo, content, encoding: "utf8" }).then(result => result.data.sha)
    const commit = await octokit.git.getRef({ ...repo, ref: MASTER_REF }).then(result => result.data.object.sha)
    const tree = await octokit.git.getCommit({ ...repo, commit_sha: commit }).then(result => result.data.tree.sha)

    const newTree = await octokit.git
        .createTree({
            ...repo,
            tree: [{ path: "package.json", mode: "100644", type: "blob", sha: blob }],
            base_tree: tree
        })
        .then(result => result.data.sha)

    const newCommit = await octokit.git
        .createCommit({
            ...repo,
            message: `Release v${releaseVersion} [skip ci]`,
            tree: newTree,
            parents: [commit]
        })
        .then(result => result.data.sha)

    const ref = await octokit.git.updateRef({ ...repo, ref: MASTER_REF, sha: newCommit })
    console.log(`##vso[task.setvariable variable=ReleaseCommitSha]${ref.data.object.sha}`)
}
