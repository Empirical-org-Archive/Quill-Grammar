#!/bin/bash

./node_modules/.bin/grunt lint && \
gulp --env=production
