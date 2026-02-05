/**
 * Build script for angularjs-whats-new
 * 
 * This script concatenates the source files and creates the distributable files.
 */

const fs = require('fs');
const path = require('path');

// Directories
const srcDir = path.join(__dirname, 'src', 'lib');
const distDir = path.join(__dirname, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log('Building angularjs-whats-new...');

// Read source files
const moduleJs = fs.readFileSync(path.join(srcDir, 'whats-new.module.js'), 'utf8');
const directiveJs = fs.readFileSync(path.join(srcDir, 'whats-new.directive.js'), 'utf8');
const templateHtml = fs.readFileSync(path.join(srcDir, 'whats-new.template.html'), 'utf8');
const css = fs.readFileSync(path.join(srcDir, 'whats-new.css'), 'utf8');

// Escape template HTML for JavaScript string
const escapedTemplate = templateHtml
  .replace(/\\/g, '\\\\')
  .replace(/'/g, "\\'")
  .replace(/\r?\n/g, '\\n')
  .replace(/\t/g, '\\t');

// Create template cache module
const templateCacheJs = `
/**
 * Template Cache for What's New Component
 * This module pre-loads the template into Angular's $templateCache
 */
(function() {
  'use strict';

  angular.module('whatsNew').run(['$templateCache', function($templateCache) {
    $templateCache.put('whats-new.template.html', '${escapedTemplate}');
  }]);
})();
`;

// Concatenate all JavaScript files
const bundledJs = `/**
 * AngularJS What's New Component
 * 
 * A multi-modal component for AngularJS applications to showcase new features.
 * 
 * @version 1.0.0
 * @license MIT
 */

${moduleJs}

${directiveJs}

${templateCacheJs}
`;

// Write bundled files
fs.writeFileSync(path.join(distDir, 'angularjs-whats-new.js'), bundledJs, 'utf8');
fs.writeFileSync(path.join(distDir, 'angularjs-whats-new.css'), css, 'utf8');

// Create minified versions (simple minification - remove comments and extra whitespace)
const minifiedJs = bundledJs
  .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
  .replace(/\/\/.*/g, '') // Remove single-line comments
  .replace(/\n\s*\n/g, '\n') // Remove empty lines
  .trim();

const minifiedCss = css
  .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
  .replace(/\s+/g, ' ') // Collapse whitespace
  .replace(/\s*([{}:;,>+~])\s*/g, '$1') // Remove whitespace around special characters
  .trim();

fs.writeFileSync(path.join(distDir, 'angularjs-whats-new.min.js'), minifiedJs, 'utf8');
fs.writeFileSync(path.join(distDir, 'angularjs-whats-new.min.css'), minifiedCss, 'utf8');

console.log('Build complete!');
console.log(`  - ${path.join(distDir, 'angularjs-whats-new.js')}`);
console.log(`  - ${path.join(distDir, 'angularjs-whats-new.css')}`);
console.log(`  - ${path.join(distDir, 'angularjs-whats-new.min.js')}`);
console.log(`  - ${path.join(distDir, 'angularjs-whats-new.min.css')}`);
