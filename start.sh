#!/bin/bash

# Need to build when container is ran in order to pipe in 
# environment variables. Args disallow users to reuse the container.

npm run build
npm start
