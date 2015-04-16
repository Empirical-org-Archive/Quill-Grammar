gulp --env=production
git commit -am 'make dist/'
npm version patch
sh super-release.sh
