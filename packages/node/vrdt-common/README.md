# vrdt-common

> A package containing code shared between all components of vRDT

## Usage

1. Authenticate using a GitHub personal access token (PAT)
    1. Create `~/.npmrc` file to include your GitHub personal access token
        ```
        //npm.pkg.github.com/:\_authToken=TOKEN
        ```
    2. **_OR_** log in from the CLI using
        ```
        npm login --scope=@vmware --registry=https://npm.pkg.github.com
        ```
2. Create local `.npmrc` in your project folder:
    ```
    @vmware:registry=https://npm.pkg.github.com/
    ```
3. Install the package
    ```bash
    npm install @vmware/vrdt-common
    ```

For more information, check "[Configuring npm for use with GitHub Packages](https://docs.github.com/en/packages/guides/configuring-npm-for-use-with-github-packages)" in the GitHub docs.
