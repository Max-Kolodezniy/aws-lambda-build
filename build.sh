#!/bin/bash
# @see http://stackoverflow.com/questions/192249/how-do-i-parse-command-line-arguments-in-bash

VERBOSE="0"

function run {
    RES=`${1} 2>&1`
    RET=$?
    if [[ "$RET" != "0" ]]; then
        echo "Failed with code ${RET}"
    else
        echo OK
    fi
    if [[ "$RET" != "0" ]] || [[ "$VERBOSE" != "0" ]]; then
        echo "${RES}"
    fi
    if [[ "$RET" != "0" ]]; then
        exit 1
    fi
    echo
}

function usage {
    echo "Usage:"
    echo $(basename "$0")
    echo "    -f | --function {PATH_TO_FUNCTION}    Function name (should be the same as function's directory)"
    echo "    -n | --name {ARCHIVE_NAME}            Archive name to save the function."
    echo "    -v | --verbose                        If set - outputs mode debug information"
}

while [[ $# > 0 ]]
do
    key="$1"

    case $key in
        -f|--function)
            DIRECTORY="$2"
            shift ;;
        -n|--name)
            NAME="$2"
            NAME=${NAME//.zip/}
            shift ;;
        -v|--verbose)
            VERBOSE="1"
            shift ;;
        *)
            usage
            exit 1 ;;
    esac
    shift # past argument or value
done

if [ -z "${DIRECTORY}" ]; then
    echo "Error: Function Name (directory with Lambda function package) is required"
    echo
    usage
    exit 1
fi

if [ -z "${NAME}" ]; then
    NAME=${DIRECTORY//\//-}
fi

# @see http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
# THIS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null && pwd )"
THIS_DIR=`pwd`
cd "${THIS_DIR}"

if [ ! -d "${DIRECTORY}" ]; then
    echo "Error: directory ${DIRECTORY} doesn't exist. Search path: ${THIS_DIR}"
    exit 127
fi

# cd dir
# npm update (if verbose > output)
# zip to THIS_DIR (if zip exists - delete it)
# Delete all from node_modules
# OK

cd "${DIRECTORY}"

echo Update NPM package dependencies...
run "npm update"

echo Packing...
if [ -f "${THIS_DIR}/${NAME}.zip" ]; then
    rm ${THIS_DIR}/${NAME}.zip
fi
run "zip -r ${THIS_DIR}/${NAME} *"

echo Cleaning...
run "rm -rf node_modules"

echo "Building of ${DIRECTORY} Lambda function done. Packed to ${THIS_DIR}/${NAME}.zip"
