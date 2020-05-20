const path = require('path')
const fs = require('fs')
const PKG = require('../package.json')
const README_LOCATION = path.resolve(__dirname, '..', 'README.md')

function cleanReadme(file) {
  const lines = file.split('\n')
  const lastLine = lines.indexOf('------>')
  const readme = lines.slice(0, lastLine + 1).join('\n')

  return readme
}

function getContributorText() {
  let text = '\n\n## Contributors\n\n'
  const contributors = Object.keys(PKG.contributors).map(
    con => PKG.contributors[con]
  )

  contributors.forEach(contributor => {
    if (contributor.url) {
      text += `+ [${contributor.name}](${contributor.url})\n`
    } else {
      text += `+ ${contributor.name}\n`
    }
  })

  return text
}

const readmeFile = fs.readFileSync(README_LOCATION, { encoding: 'utf8' })
let readme = cleanReadme(readmeFile)

const contributorText = getContributorText()

readme += contributorText

fs.writeFileSync(README_LOCATION, readme)
