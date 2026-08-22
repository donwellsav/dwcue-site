# DonWells Cue standalone website setup

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

Write-Host "Installing website dependencies..." -ForegroundColor Cyan
npm install

Write-Host "Building the static website..." -ForegroundColor Cyan
npm run generate

Write-Host "Website build is in .output/public" -ForegroundColor Green
