/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

export interface HierarchicalNode<T> {
    name: string
    path: string
    value?: T
    parent?: HierarchicalNode<T>
    children?: Map<string, HierarchicalNode<T>>
}

export function makeHierarchical<T>(
    values: T[],
    splitPath: (i: T) => string[],
    joinPath: (...paths: string[]) => string,
    shouldMerge?: (child: HierarchicalNode<T>) => boolean,
    compact: boolean = false
): HierarchicalNode<T> {
    const initial: HierarchicalNode<T> = {
        name: "<root>",
        path: "<root>",
        children: new Map()
    }

    const hierarchy = values.reduce((root: HierarchicalNode<T>, value: T) => {
        let folder = root

        let path = ""
        for (const folderName of splitPath(value)) {
            path = joinPath(path, folderName)

            if (folder.children === undefined) {
                folder.children = new Map()
            }

            let f = folder.children.get(folderName)
            if (f === undefined) {
                f = {
                    name: folderName,
                    path,
                    parent: folder,
                    children: undefined
                }
                folder.children.set(folderName, f)
            }

            folder = f
        }

        folder.value = value
        return root
    }, initial)

    if (compact) {
        if (!shouldMerge) {
            shouldMerge = child => child.value === undefined
        }

        return compactHierarchy(hierarchy, joinPath, shouldMerge, true)
    }

    return hierarchy
}

export function compactHierarchy<T>(
    root: HierarchicalNode<T>,
    joinPath: (...paths: string[]) => string,
    shouldMerge: (child: HierarchicalNode<T>) => boolean,
    isRoot: boolean = true
): HierarchicalNode<T> {
    if (root.children === undefined) {
        return root
    }

    const children = [...root.children.values()]
    for (const child of children) {
        compactHierarchy(child, joinPath, shouldMerge, false)
    }

    if (!isRoot && children.length === 1) {
        const child = children[0]
        if (shouldMerge(child)) {
            root.name = joinPath(root.name, child.name)
            root.path = child.path
            root.children = child.children
            root.value = child.value
        }
    }

    return root
}
