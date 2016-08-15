#!/bin/bash

while [ ! -d "dist" ]
do
	sleep 5
done

cp -rf backend/controller   dist
cp -rf backend/router       dist
cp -f  backend/app.js       dist
cp -f  backend/package.json dist
