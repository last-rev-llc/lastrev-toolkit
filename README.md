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

### commands

- `yarn run build` - Cleans and builds each package in dependency order.
- `yarn run test` - Runs all of the tests across all projects. We use [Jest](https://jestjs.io/) as our testing library.
- `yarn run test:watch` - Runs tests in watch mode.
- `yarn run pub:patch` - Determines which packages have changed, increments the patch version number, and publishes to NPM.
- `yarn run pub:minor` - Determines which packages have changed, increments the minor version number, and publishes to NPM.
- `yarn run pub:major` - Determines which packages have changed, increments the major version number, and publishes to NPM.
- `yarn run install:local` - For any binaries, removes the previously installed versions, and installs the current build from your workspace. Useful for testing changes locally.
