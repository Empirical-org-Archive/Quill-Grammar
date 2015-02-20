#!/bin/bash
firebase deploy --firebase quillgrammar --public dist/ -m `git rev-parse --short HEAD`
