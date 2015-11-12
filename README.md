# aws-lambda-build
Build AWS Lambda package (.zip file) including npm modules
Do the following:
1. cd function directory
2. npm update (if verbose > output)
3. zip to provided (or generated) filename.zip (if zip exists - delete it)
4. delete all from node_modules. Be careful, it will delete all unsaved changes!

## Linux shell file
Do not forget `chmod +x` on the build.sh file.
```
Usage:
build.sh
    -f | --function {PATH_TO_FUNCTION}    Function name (should be the same as function's directory)
    -n | --name {ARCHIVE_NAME}            Archive name to save the function.
    -v | --verbose                        If set - output more debug information
```

Next command will produce API_Function.zip file in the current directory.
This .zip file will contain code ready for uploading to AWS Lambda
```
$ aws-lambda-build/build.sh -f API/Function -n API-Function
Or even
$ aws-lambda-build/build.sh -f API/Function
```

## Windows batch file
Coming soon
