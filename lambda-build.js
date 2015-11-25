#!/usr/bin/env node
'use strict';

var os = require('os');

function error(string)
{
    process.stderr.write(string + os.EOL);
}

// Parse args
var args = {};
var raw = process.argv.slice(2);

if (raw.length === 0) {
    [
        'Build Lambda function: update dependencies and pack it',
        '',
        process.argv[0] + ' ' + process.argv[1],
        '    --function=functionName    |    -f functionName    |    Required. Path to directory that contains Lambda function.',
        '    --archive=archiveName      |    -a archiveName     |    Zip archive where it will be packed. If not set - Function name will be used.',
        '    --verbose                  |    -v                 |    Output more debug info. Useful for redirect it to log.',
        '    --quiet                    |    -q                 |    No output at all. Watch the exit code.'
    ].map(function(string)
        {
            process.stdout.write(string + os.EOL);
        });
    process.exit(0);
}

for (var i = 0; i < raw.length; i++) {
    if (raw[i].substr(0, 2) === '--' && raw[i].indexOf('=') !== -1) {
        raw[i] = raw[i].split('=');
        args[raw[i][0].replace('--', '')] = raw[i].slice(1).join('=');
        continue;
    }
    if (raw[i].substr(0, 2) === '--') {
        args[raw[i].replace('--', '')] = undefined;
        continue;
    }
    if (raw[i].substr(0, 1) === '-') {
        args[raw[i].replace('-', '')] = raw[++i];
        continue;
    }
    args[raw[i]] = raw[++i];
}

var quiet = 'q' in args || 'quiet' in args   || false;
var verbose = 'v' in args || 'verbose' in args || false;
verbose = verbose && !quiet;

var name = args.f || args.function;
if (typeof(name) === 'undefined') {
    if (!quiet) error('--function or -f argument is required');
    process.exit(1);
}

var path = require('path');
var fs = require('fs');

var fullPath = path.resolve(name);
if (!quiet) console.log('Function folder "' + name + '" translated to ' + fullPath + '.');
try {
    if (!fs.statSync(fullPath).isDirectory()) {
        if (!quiet) error('Function directory should exist. Given ' + name + ' translated to (' + fullPath + ') does not exist or inaccessible.');
        process.exit(1);
    }
} catch (e) {
    if (!quiet) error('Function directory does not exist. Given ' + name + ' translated to (' + fullPath + ') does not exist or inaccessible.');
    process.exit(1);
}

var archive = args.a || args.archive;
if (typeof(archive) === 'undefined') {
    archive = name.replace(/[\/\\]/g, '_');
}
archive = path.resolve(archive).replace(/.zip$/, '') + '.zip';
if (!quiet) console.log('Archive destination set to ' + archive + '.');

// Update npm
if (!quiet) console.log('Update packages with > $ npm install');
var npm = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
npm = require('child_process').spawnSync(npm, [ 'install' ], { cwd : fullPath });
if (npm.status !== 0 || verbose) {
    console.log(npm.stdout.toString());
    if (!quiet && npm.stderr.length) error(npm.stderr.toString());
    if (npm.status != 0) process.exit();
}

// Write an archive
var archiver = require('archiver');
var zip = archiver.create('zip', {});
zip.on('error', function(message){
    if (!quiet) error(message);
    process.exit(1);
});
zip.pipe(fs.createWriteStream(archive));
zip.directory(fullPath, false);
zip.finalize();

if (!quiet) {
    console.log();
    console.log('AWS Lambda function "' + name + '" build done. Check ' + archive);
}
