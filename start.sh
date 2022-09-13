#!/bin/bash

# Need to build when container is ran in order to pipe in 
# environment variables. Args disallow users to reuse the container.
npm run build
cp -r .next/standalone/* ./

NODE_ENV=production exec node server.js