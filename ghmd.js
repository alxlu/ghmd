#! /usr/bin/env node

var program = require('commander');
var marked = require('marked');

var fs = require('fs');
var path = require('path');

program
  .version('0.0.1')
  .usage('<input markdown file>')
  .option('-o, --outfile', 'Put output in custom location')
  .option('-t, --testing', 'For testing only')
  .parse(process.argv);

if (program.testing) {
  console.log(__dirname);
  return;
}
if (!program.args.length) {
  program.help();
} else {
  var dir = program.args[0];
  var content = fs.readFileSync(dir, 'utf8');
  marked.setOptions({
    highlight: function (code) {
      return require('highlight.js').highlightAuto(code).value;
    }
  });
  var output = marked(content);
  var filename = dir;
  if (dir.split('.').pop() === 'md') {
    dir = dir.slice(0, -2) + 'html';
  } else {
    dir = dir + 'html';
  }

  var head = '<!docype html>\n<html>\n<head>\n<meta charset="utf-8" />\n<style>\n';

  var githubcss = fs.readFileSync(
    path.join(__dirname, 'node_modules/github-markdown-css/github-markdown.css'),
    'utf8') + '\n';

  var highlightcss = fs.readFileSync(
    path.join(__dirname, 'node_modules/highlight.js/styles/github.css'),
    'utf8') + '\n</style>\n</head>\n' +
    '<body style="min-width: 200px; max-width: 790px; margin: 0 auto; paddig: 30px;"' +
    'class="markdown-body">\n';

  var foot = '\n</body>\n</html>';

  output = head + githubcss + highlightcss + output + foot;

  fs.writeFileSync(dir, output);
}
