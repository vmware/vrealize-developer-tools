Before you continue with this section validate that all of the [prerequisites](./Setup-Developer-Workstation.md) are met.

When you package a vRO/vRA project with the `-Pbundle-with-installer` Maven profile, you will get an additional artifact `***-bundle.zip` that contains your project, all its dependencies (both vRA and vRO) plus the bundle installer CLI.

You can extract the zip bundle and install all packages on a target environment.

## Use

Open a terminal and navigate inside the extracted bundle directory. Run the following:

```bash
./bin/installer
```

The command above will run the installer in interactive mode and walk you through a set of questions - credentials, flags etc. Read the questions carefully - the defaults are set according to PS CoE's best practices.

At the end of the interaction, before anything is done, you will be prompt to store all the answers to an `environment.properties` file on disk. This is helpful if you want to use the same answers for different bundles or you'd like to re-run it. **Be cautious** as the file would contain passwords, so the file needs to be well protected.

To re-use the environment.properties file you can pass its location as the only argument to the CLI:

```bash
# Example properties file
$ cat environment.properties
ignore_ssl_certificate_verification=true
ignore_ssl_host_verification=true

vro_import_packages=true
vro_server=vra-l-01a.corp.local
vro_port=443
vro_auth=basic
vro_tenant=vsphere.local
vro_username=administrator@vsphere.local
vro_password=VMware1\!


vro_import_old_versions=true
vro_import_configuration_attribute_values=false
vro_import_configuration_secure_attribute_values=false

vro_delete_old_versions=true

# Run vRO configuration workflow
vro_run_workflow=true
vro_run_workflow_id=1944423533582937823496790834565483423
# input.json contains JSON where each first class KEY represents
# the workflow input parameter name and its value will be sent as value
# Supported typs of workflow in/output parameters are limited to strings
vro_run_workflow_input_file_path=./input.json
# output.json contains JSON where each first class KEY represents
# the workflow output parameter name and its value is a pretty printed value as JSON
vro_run_workflow_output_file_path=./output.json
vro_run_workflow_timeout=300

vcd_import_packages=false

vra_import_packages=false
vra_delete_old_versions=false

$ ./bin/installer environment.properties
```
