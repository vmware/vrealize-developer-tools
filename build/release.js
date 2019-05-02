/*
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

const gulp = require("gulp")
const log = require("fancy-log")
const publishRelease = require("gulp-github-release")
const { ReleaseNotes } = require("pull-release-notes")

const REPO_OWNER = "vmware"
const REPO_NAME = "vrealize-developer-tools"

function createRelease(releaseVersion, releaseSha, notes) {
    log.info(`Creating GitHub release v${releaseVersion}`)
    const stream = gulp.src("./*.vsix").pipe(
        publishRelease({
            token: process.env.GITHUB_SECRET,
            owner: REPO_OWNER,
            repo: REPO_NAME,
            name: releaseVersion,
            notes: `## Notable changes\n${notes}`,
            tag: `v${releaseVersion}`,
            target_commitish: releaseSha,
            draft: true,
            reuseDraftOnly: true,
            skipIfPublished: true
        })
    )

    return toPromise(stream)
}

function getReleaseNotes(fromTag, toSha) {
    log.info(`Pulling release notes between tag v${fromTag} and SHA ${toSha}`)
    const releaseNotes = new ReleaseNotes({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        fromTag: "v" + fromTag,
        toTag: toSha,
        formatter: ReleaseNotes.defaultFormatter
    })

    return releaseNotes.pull(process.env.GITHUB_SECRET)
}

function toPromise(stream) {
    return new Promise(function(resolve, reject) {
        stream.on("finish", resolve).on("error", reject)
    })
}

module.exports = function() {
    if (!process.env.GITHUB_SECRET) {
        throw new Error("Missing GitHub secret")
    }

    if (!process.env.PREV_RELEASE_VERSION) {
        throw new Error("Missing previous release version")
    }

    if (!process.env.RELEASE_COMMIT_SHA) {
        throw new Error("Missing release commit SHA")
    }

    const currentVersion = process.env.PREV_RELEASE_VERSION
    const releaseVersion = require("../package.json").version
    const releaseSha = process.env.RELEASE_COMMIT_SHA

    return Promise.resolve()
        .then(() => getReleaseNotes(currentVersion, releaseSha))
        .then(notes => createRelease(releaseVersion, releaseSha, notes))
        .catch(error => {
            log.error(error)
            throw new Error("Could not release in GitHub")
        })
}
