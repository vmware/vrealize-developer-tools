/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

export function jestSpy(object: any, prop: string) {
  const oldValue = object[prop]
  const spy = jest.fn()
  spy["restore"] = () => {
    object[prop] = oldValue
  }

  object[prop] = spy

  return spy
}
