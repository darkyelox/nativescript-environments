#!/usr/bin/env node

const process = require('process')
const spawnSync = require('child_process').spawnSync

const prevdir = process.cwd()
process.chdir('../demo-ng')
spawnSync('npm', ['uninstall', 'nativescript-environments'])
spawnSync('npm', ['install', '--save', '../src'])
spawnSync('tns', ['install'])
process.chdir(prevdir)