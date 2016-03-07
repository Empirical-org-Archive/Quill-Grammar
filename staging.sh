#!/bin/bash
firebase deploy --firebase quillgrammarstaging --public build/ -m `git describe --always`
