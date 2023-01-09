import AdmZip from 'adm-zip'
import got from 'got'
import micromatch from 'micromatch'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import stream from 'node:stream'
import { promisify } from 'node:util'
import { Octokit } from 'octokit'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const zipName = 'open-wc.zip'
const dest = path.resolve(__dirname, `../../`)
const devSeverHmrDir = 'packages/dev-server-hmr/'
const dirPatterns = [
  'src/babel/**',
  'src/presets/**',
  'src/constants.js',
  'src/index.js',
  'src/utils.js',
  'src/wcHmrRuntime.js',
].map((v) => devSeverHmrDir + v)

const pipeline = promisify(stream.pipeline)

const octokit = new Octokit()

// clone from https://github.com/open-wc/open-wc/blob/master/packages/dev-server-hmr
const { url } = await octokit.rest.repos.downloadZipballArchive({
  owner: 'open-wc',
  repo: 'open-wc',
  ref: 'c5444f79ac863d68abdbf84e5c49d9b07223bd1c',
})

await fsp.unlink(zipName)
await pipeline(got.stream(url), fs.createWriteStream(zipName))
console.log('open-wc/open-wc downloaded.\n')

const filePath = path.resolve(__dirname, `../${zipName}`)
const zip = new AdmZip(filePath)
const entries = zip.getEntries()
entries.forEach((entry) => {
  const relativePath = entry.entryName.split('/').slice(1).join('/')
  if (micromatch.isMatch(relativePath, dirPatterns)) {
    console.log(`⏳ Saving ${relativePath}`)
    if (!entry.isDirectory) {
      zip.extractEntryTo(
        entry.entryName,
        path.resolve(dest, relativePath, '..'),
        false,
        true
      )
      console.log(`✅ ${relativePath} saved.`)
    }
  }
})
