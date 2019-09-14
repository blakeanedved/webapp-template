const execSync = require('child_process').execSync
const fs = require('fs')
execSync('npm install --save prompt')
const prompt = require('prompt')

prompt.start()

prompt.message = ''
prompt.delimiter = ''

console.log('What is your new repository?')

prompt.get({
	properties: {
		githubusername: {
			description: 'Github Username:'
		},
		githubrepo: {
			description: 'Github Repository:'
		}
	}
}, function(err, results){

	execSync(`git remote rm origin && git remote add origin https://github.com/${results.githubusername}/${results.githubrepo} && git config master.remote origin && git config master.merge refs/head/master`)

	execSync(`npm init && npm install --save-dev webpack webpack-cli webpack-dev-server css-loader sass-loader node-sass extract-loader file-loader material-components-web`)

	fs.unlink('init.js', () => {})

})
