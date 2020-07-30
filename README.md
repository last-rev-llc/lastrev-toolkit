# LastRev Toolkit

This is a mono-repo with individually versioned packages for the tools and libraries used in LastRev projects.

## Packages

### @last-rev/adapter-contentful

The [LastRev Contentful Adapter](packages/lastrev-adapter-contentful) takes data out of contentful and adapts it to the shape epected by most LastRev components.

### @last-rev/integration-contentful

The [LastRev Contentful Integration](packages/lastrev-integration-contentful) is an implementation of the calls we use to the contentful API.

### @last-rev/build-prefetch-content

The [LastRev Content Prefetcher](packages/lastrev-build-prefetch-content) is a build script which prefetches some data from contentful to help reduce build times and enable component lookups.

## Usage

This monorepo uses [Lerna](https://github.com/lerna/lerna) and [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) to manage the packages. Scripts are executed with [Yarn](https://yarnpkg.com/). In general, run scripts from the workspace root to run accross all packages.

### Getting Started

1. Install yarn globally

```bash
npm install -g yarn
```

2. Run yarn install on the project

```bash
yarn install
```

3. When adding new dependencies, add them to the workspace from the root, or CD into the package and add them to the package

```bash
yarn workspace @last-rev/integration-contentful add lodash
# or
cd packages/lastrev-integration-contentful
yarn add lodash
```

### How it works

yarn workspaces ensures that all modules are installed at the package root, and that package references are linked, meaning that if package-a depends on package-b, and you make changes to package-b, locally, package-a can see those changes immediately.

Lerna ensures that all packages that changed, plus those depending on them are versioned and published. Versions are independent.

### commands

- `yarn run build` - Cleans and builds each package in dependency order. We use [Typescript](https://www.typescriptlang.org/) to build the projects, as it allows for much safer code, and improved [intellisense in VS Code](https://code.visualstudio.com/docs/editor/intellisense)
- `yarn run test` - Runs all of the tests across all projects. We use [Jest](https://jestjs.io/) as our testing library.
- `yarn run test:watch` - Runs tests in watch mode.
- `yarn run pub:patch` - Determines which packages have changed, increments the patch version number, and publishes to NPM.
- `yarn run pub:minor` - Determines which packages have changed, increments the minor version number, and publishes to NPM.
- `yarn run pub:major` - Determines which packages have changed, increments the major version number, and publishes to NPM.

## Testing CLIs locally

To test a CLI locally, simply build the monorepo as usual, and instead of calling the global executable, call node with the path of the local executable:

```bash
cd ~/dev/lastrev-toolkit
yarn run build
cd ../SomeOtherProject
node ../lastrev-toolkit/packages/lastrev-build-prefetch-content/bin/lr-prefetch
```
