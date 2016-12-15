#!/usr/bin/env node

'use strict'

// Import dependencies.
const cheerio = require('cheerio')
const fs = require('fs')
const glob = require('glob')
const path = require('path')

const args = process.argv
// Path to the SVG icons after SVGO cleaning.
const src = args[2]
// Path for storing the React components.
const dist = args[3]

if (args.length !== 4) {
  process.stderr.write(`Usage: ${args[1]} input_glob output_dir\n`)
  process.exit(1)
}

// Generate a React component for each SVG file.
glob(src, (err, icons) => {
  'use strict'
  if (err) throw new Error(err)

  try {
    const exports = icons.reduce((prev, curr) => {
      // Load the HTML.
      const $ = cheerio.load(fs.readFileSync(curr, 'utf-8'), {
        normalizeWhitespace: true,
        xmlMode: true
      })
      const iconSvg = $('svg').html()
      // Generate the React component name.
      let iconName = (path.basename(curr, '.svg')).replace(/(\-\w)/g, m => m[1].toUpperCase())
      iconName = iconName.replace(/^./, iconName[0].toUpperCase()) + 'Icon'

      // Add the React component to the index as an import.
      // Generate the React component template.
      const template = `import React from 'react'

const ${iconName} = props => <svg viewBox="0 0 512 512" {...props}>${iconSvg}</svg>

export default ${iconName}
`

      // Save the template.
      fs.writeFileSync(path.join(dist, iconName + '.jsx'), template, 'utf-8')
      prev.push(`export ${iconName} from './${dist}${iconName}'`)

      return prev
    }, [])

  } catch (e) {
    throw new Error(e)
  }
})
