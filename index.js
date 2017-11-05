/* jshint node: true */
'use strict'
const path = require('path')
const mergeTrees = require('broccoli-merge-trees')
const Funnel = require('broccoli-funnel')

const UnwatchedDir = require('broccoli-source').UnwatchedDir

module.exports = {
  name: 'ember-pdf-js',
  included (app, parentAddon) {
    this._super.included(...arguments)
    while (app.app) {
      app = app.app
    }

    const rs = require.resolve('pdfjs-dist')
    let pdfjsPath = path.dirname(path.dirname(rs))
    this.pdfjsNode = new UnwatchedDir(pdfjsPath)

    app.import('vendor/pdfjs-dist/build/pdf.js')
    app.import('vendor/pdfjs-dist/web/pdf_viewer.js')
    app.import('vendor/pdfjs-dist/web/pdf_viewer.css')
  },


  treeForPublic (tree) {
    let pdfJsImagesTree = new Funnel(this.pdfjsNode, {
      srcDir: 'web/images',
      destDir: '/assets/images'
    })
    let pdfJsFilesTree = new Funnel(this.pdfjsNode, {
      srcDir: 'build',
      include: ['pdf.worker.js'],
      destDir: '/'
    })

    if (tree) {
      return mergeTrees([
        tree,
        pdfJsFilesTree,
        pdfJsImagesTree
      ])
    } else {
      return mergeTrees([
        pdfJsFilesTree,
        pdfJsImagesTree
      ])
    }
  },

  treeForVendor (vendorTree) {
    let trees = []

    if (vendorTree) {
      trees.push(vendorTree)
    }
    trees.push(
      Funnel(this.pdfjsNode, {
        srcDir: 'build',
        include: ['pdf.js', 'pdf.js.map'],
        destDir: 'pdfjs-dist/build',
      })
    )

    trees.push(
      Funnel(this.pdfjsNode, {
        srcDir: 'web',
        include: ['pdf_viewer.js', 'pdf_viewer.css', 'pdf_viewer.js.map'],
        destDir: 'pdfjs-dist/web',
      })
    )

    return mergeTrees(trees)
  }
}
