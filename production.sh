#!/bin/bash
firebase deploy --firebase quillgrammarpartner --public dist/ -m `git describe --always`
