import App from './app/App'
import implementations from './impl'
import Tree from './cases/Tree'
import SierpinskiTriangle from './cases/SierpinskiTriangle'

import React from 'react'
import ReactDOM from 'react-dom'

const packageNames = Object.keys(implementations)

const createTestBlock = fn => {
  return packageNames.reduce((testSetups, packageName) => {
    const { name, components } = implementations[packageName]
    const {
      Component,
      getComponentProps,
      sampleCount,
      Provider,
      benchmarkType
    } = fn(components)

    testSetups[packageName] = {
      Component,
      getComponentProps,
      sampleCount,
      Provider,
      benchmarkType,
      name
    }
    return testSetups
  }, {})
}

const tests = {
  'Mount deep tree': createTestBlock(components => ({
    benchmarkType: 'mount',
    Component: Tree,
    getComponentProps: () => ({
      breadth: 2,
      components,
      depth: 7,
      id: 0,
      wrap: 1
    }),
    Provider: components.Provider,
    sampleCount: 50
  })),
  'Mount wide tree': createTestBlock(components => ({
    benchmarkType: 'mount',
    Component: Tree,
    getComponentProps: () => ({
      breadth: 6,
      components,
      depth: 3,
      id: 0,
      wrap: 2
    }),
    Provider: components.Provider,
    sampleCount: 50
  })),
  'Update dynamic styles': createTestBlock(components => ({
    benchmarkType: 'update',
    Component: SierpinskiTriangle,
    getComponentProps: ({ cycle }) => {
      return { components, s: 200, renderCount: cycle, x: 0, y: 0 }
    },
    Provider: components.Provider,
    sampleCount: 100
  }))
}

let root = document.querySelector('.root')

if (!root) {
  // to appease flow
  throw new Error('could not find root')
}

ReactDOM.render(<App tests={tests} />, root)
