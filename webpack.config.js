const autoprefixer = require('autoprefixer');
const HTMLWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const CSSBUNDLE = 'bundle.css'
const JSBUNDLE = 'bundle.js'

function tryResolve_(url, sourceFilename) {
	// Put require.resolve in a try/catch to avoid node-sass failing with cryptic libsass errors
	// when the importer throws
	try {
		return require.resolve(url, { paths: [path.dirname(sourceFilename)] });
	} catch (e) {
		return '';
	}
}

function tryResolveScss(url, sourceFilename) {
	// Support omission of .scss and leading _
	const normalizedUrl = url.endsWith('.scss') ? url : `${url}.scss`;
	return tryResolve_(normalizedUrl, sourceFilename) ||
		tryResolve_(path.join(path.dirname(normalizedUrl), `_${path.basename(normalizedUrl)}`),
			sourceFilename);
}

function materialImporter(url, prev) {
	if (url.startsWith('@material')) {
		const resolved = tryResolveScss(url, prev);
		return { file: resolved || url };
	}
	return { file: url };
}

module.exports = {
	mode: 'development',
	entry: ['./src/app.scss', './src/app.ts'],
	output: {
		filename: JSBUNDLE,
		path: path.resolve(__dirname, 'public')
	},
	resolve: {
		extensions: ['.ts', '.js', '.scss']
	},
	devServer: {
		publicPath: '/',
		contentBase: './public',
		hot: true
	},
	plugins: [
		new HTMLWebpackPlugin({
			css: CSSBUNDLE,
			template: './src/index.html'
		})
	],
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: CSSBUNDLE,
						},
					},
					{ loader: 'extract-loader' },
					{ loader: 'css-loader' },
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [autoprefixer()]
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								importer: materialImporter
							}
						}
					}
				]
			}
		]
	}
}