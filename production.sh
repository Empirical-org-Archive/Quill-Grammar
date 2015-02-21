#!/bin/bash
firebase deploy --firebase quillgrammar --public dist/ -m `git describe --always`
