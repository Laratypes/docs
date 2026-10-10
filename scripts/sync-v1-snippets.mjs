// Copy the v1 spec examples from a Laratype checkout into snippets/v1/, verbatim.
// Usage: node scripts/sync-v1-snippets.mjs <path-to-Laratype-repo> [ref=origin/master]
// Examples under */proposed/ are checked against open PRs, so pages mark them illustrative.
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const [repo, ref = 'origin/master'] = process.argv.slice(2)
if (!repo) throw new Error('usage: node scripts/sync-v1-snippets.mjs <path-to-Laratype-repo> [ref]')
const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' })

const sha = git('rev-parse', ref).trim()
const files = git('ls-tree', '-r', '--name-only', sha, 'docs/v1/examples/')
  .split('\n')
  .filter((f) => f.endsWith('.ts') && !f.endsWith('typecheck.test.ts'))

const out = 'snippets/v1'
rmSync(out, { recursive: true, force: true })
for (const f of files) {
  const dest = join(out, f.slice('docs/v1/examples/'.length))
  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, git('show', `${sha}:${f}`))
}
writeFileSync(join(out, 'SOURCE.txt'), `Laratypes/Laratype@${sha} docs/v1/examples (${files.length} files)\n`)
console.log(`synced ${files.length} files from ${sha.slice(0, 7)}`)
