# 项目脚手架
该项目是choice-cli的模板文件,支持多模式构建。  
- vue模式
- react模式
- simple模式  
使用simple模式构建只会包含eslint和babel配置文件,react模式和vue模式会包含router和store的相关配置并使用webpack打包生成
## 项目结构  
```
src/ 
    ├─actions 
    ├─compoents
    ├─pages  // 页面级组件
    └─reducers 
.dev_cilent // hotreload浏览器端配置
.index.html //webpack的html模板
proxy.js   // devserver的API代理配置
server.js  // devserver
```
> meta.json文件是模板信息的配置
## webpack配置
```js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'); // webpack的日志插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');  // 将CSS单独提取的插件
const extractLESS = new ExtractTextPlugin('app.[chunkhash:8].min.css'); // less插件

module.exports = {
    entry: {
        app: ['./dev_client', path.resolve(__dirname, 'src/app.jsx')]
    },
    output: {
        path: path.resolve(__dirname, './dist'),  // 输出文件路径
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[hash:8].js',
        publicPath: '/'   // 公共资源路径
    },
    devtool: '#cheap-module-eval-source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                loader: 'eslint-loader',
                include: [path.join(__dirname, 'src')],
                enforce: 'pre',      // 强制编译前进行eslint检测
                options: {
                    formatter: require('eslint-friendly-formatter')  // 更加友好的eslint错误提示
                }
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                include: [path.join(__dirname, 'src')],
                options: {
                    presets: [
                        'react'    //  react套件
                    ]
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [path.join(__dirname, 'src')]
            },
            {
                test: /\.less$/,
                loader: extractLESS.extract([
                    'css-loader',
                    'less-loader'
                ])
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'file-loader',
                query: {
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader',
                query: {
                    name: 'font/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        extractLESS,
        new webpack.HotModuleReplacementPlugin(),   // 热替换插件
        new FriendlyErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        })
    ]
};

```
## babel配置  
```js
{
    "presets": ["es2015"],
    "plugins": ["transform-object-assign"]
}
```
## eslint配置
```js
module.exports = {
    "env": {
        "es6": true,
        "browser": true,
        "node": true
    }, 
    parser: 'babel-eslint',      // 使用babel-eslint的解析器，可以用扩展运算符的语法
    "extends": ["eslint:recommended",'plugin:react/recommended'],  // 使用react/recommended插件可以避免在使用JSX语                                                               //法必须引入reactDom的时候报错(unused)
    "rules": {
        "key-spacing": [2, {                      // enforce spacing between keys and values in object literal properties
            "beforeColon": false,
            "afterColon": true
        }],
        "comma-spacing": ["error", {              // enforce spacing before and after comma
            "before": false,
            "after": true
        }],
        "strict": ["error", "global"],            // Strict mode
        "indent": [                               // this option sets a specific tab width for your code (off by default) */
            "error",
            4
        ],
        "space-infix-ops": 2,                     // require spaces around operators
        "space-before-blocks": [2, "always"],     // require or disallow space before blocks (off by default)
        "quotes": [                               // specify whether backticks, double or single quotes should be used
            "error",
            "single"
        ],
        "semi": [                                 // require or disallow use of semicolons instead of ASI
            "error",
            "always"
        ]
    }
};
```  
## react-redux middleware  
redux-devtools-extension 可以在devtool中使用redux插件debug  
redux-thunk  可以在action中进行异步操作  
