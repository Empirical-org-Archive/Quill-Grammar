gulp --env=production
git add .
git commit -am 'make dist/'
npm version patch
sh super-release.sh
