# aws-lambda-build
Build AWS Lambda package (.zip file) including npm modules.
The most lightweight builder, no external dependencies except *archiver*.
Easy to use!

Windows Mac and Linux tested.

It does the following:
1. cd function directory
2. npm install (if verbose > output)
3. zip to provided (or generated) filename.zip (if zip exists - delete it)

```
Usage:
lambda-build
    --function=functionName    |    -f functionName    |    Required. Path to directory that contains Lambda function
    --archive=archiveName      |    -a archiveName     |    Zip archive where it will be packed. If not set - Function name will be used
    --verbose                  |    -v                 |    Output more debug info. Useful for redirect it to log
    --quiet                    |    -q                 |    No output at all. Watch the exit code
```

Next command will produce API_Function.zip file in the current directory.
This .zip file will contain code that is ready for uploading to AWS Lambda

```
$ lambda-build/build.sh -f API/Function -n API-Function.zip
Or
$ lambda-build/build.sh -f API/Function -n API-Function
Or even
$ lambda-build/build.sh -f API/Function
```

Check out my [aws-lambda-local](https://www.npmjs.com/package/aws-lambda-local "https://github.com/Max-Kolodezniy/aws-lambda-local") package!
