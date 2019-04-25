/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

/* eslint-disable @typescript-eslint/no-non-null-assertion */

export interface HierarchicalNode<T> {
    name: string
    path: string
    value?: T
    parent?: HierarchicalNode<T>
    children: { [key: string]: HierarchicalNode<T> } | undefined
}

export function makeHierarchical<T>(
    values: T[],
    splitPath: (i: T) => string[],
    joinPath: (...paths: string[]) => string,
    compact: boolean = false
): HierarchicalNode<T> {
    const initial: HierarchicalNode<T> = {
        name: "",
        path: "",
        children: Object.create(null)
    }

    const hierarchy = values.reduce((root: HierarchicalNode<T>, value: T) => {
        let folder = root

        let path = ""
        for (const folderName of splitPath(value)) {
            path = joinPath(path, folderName)

            if (folder.children === undefined) {
                folder.children = Object.create(null)
            }

            let f = folder.children![folderName]
            if (f === undefined) {
                folder.children![folderName] = f = {
                    name: folderName,
                    path,
                    parent: folder,
                    children: undefined
                }
            }

            folder = f
        }

        folder.value = value
        return root
    }, initial)

    if (compact) {
        return compactHierarchy(hierarchy, joinPath, true)
    }

    return hierarchy
}

export function compactHierarchy<T>(
    root: HierarchicalNode<T>,
    joinPath: (...paths: string[]) => string,
    isRoot: boolean = true
): HierarchicalNode<T> {
    if (root.children === undefined) {
        return root
    }

    const children = Object.values(root.children)
    for (const child of children) {
        compactHierarchy(child, joinPath, false)
    }

    if (!isRoot && children.length === 1) {
        const child = children[0]
        if (child.value === undefined) {
            root.name = joinPath(root.name, child.name)
            root.path = child.path
            root.children = child.children
        }
    }

    return root
}
