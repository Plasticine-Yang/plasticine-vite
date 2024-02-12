# node-monorepo-boilerplate

A boilerplate for developing node.js applications or libraries with monorepo.

## Usage

```shell
# install
pnpm i

# dev
pnpm dev

# build
pnpm build

# changeset add - create a change item of CHANGELOG
pnpm changeset add

# changeset version - consume all changes and generate new CHANGELOG
pnpm changeset version

# release - containing build and publish subprocess
pnpm release
```

### Add package

```shell
# add a clean package
pnpm turbo gen workspace

# add a package from other existing package
pnpm turbo gen workspace --copy
```
