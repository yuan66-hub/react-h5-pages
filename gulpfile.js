const { src, dest } = require('gulp');
const through = require('through2');
const Prerenderer = require('@prerenderer/prerenderer')
const path = require('path')
// const JSDOMRenderer = require('@prerenderer/renderer-jsdom')

function defaultTask() {
    return src('dist/*.html').pipe(through.obj(async function (file, enc, cb) {
        const prerenderer = new Prerenderer({
            staticDir: path.join(__dirname, 'dist'),
        })
        prerenderer.hookServer((server) => {
            const express = server.getExpressServer();
            express.get('*', (req, res) => {
                res.send('6666');
            });
        });
        await prerenderer.initialize().then(() => {
            return prerenderer.renderRoutes(['/home.html'])
        }).then(renderedRoutes => {
            console.log('renderedRoutes',renderedRoutes);
            renderedRoutes.forEach(renderedRoute => {
                try {
                    console.log('renderedRoute.html.trim()', renderedRoute.html.trim());
                } catch (e) {
                    // Handle errors.
                }
            })
            return prerenderer.destroy()
        });
        cb()
    }))
}

exports.default = defaultTask