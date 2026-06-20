const { execSync } = require('child_process');
const fs = require('fs/promises');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const skillsDir = path.join(rootDir, 'skills');

function run(command, options = {}) {
  console.log(`Running: ${command}`);
  execSync(command, { stdio: 'inherit', cwd: rootDir, ...options });
}

async function main() {
  const generatedSkillsDir = path.join(rootDir, '.claude', 'skills', 'playwright-cli-patched');
  const upstreamGeneratedSkillsDir = path.join(rootDir, '.claude', 'skills', 'playwright-cli');
  const targetSkillsDir = path.join(skillsDir, 'playwright-cli-patched');

  await fs.rm(generatedSkillsDir, { recursive: true, force: true });
  await fs.rm(upstreamGeneratedSkillsDir, { recursive: true, force: true });

  // 2. Run the patched CLI install-skills
  console.log('\n=== Running playwright-cli-patched install --skills ===\n');
  run('node playwright-cli.js install --skills');

  // 3. Move generated skills into the existing skills folder
  console.log('\n=== Updating skills folder ===\n');

  try {
    await fs.access(generatedSkillsDir);
    // Remove existing skills and copy new ones
    await fs.rm(targetSkillsDir, { recursive: true, force: true });
    await fs.cp(generatedSkillsDir, targetSkillsDir, { recursive: true });
    console.log(`Copied skills from ${generatedSkillsDir} to ${targetSkillsDir}`);

    // Clean up generated skills directory
    await fs.rm(generatedSkillsDir, { recursive: true });
    await fs.rm(upstreamGeneratedSkillsDir, { recursive: true, force: true });
    console.log('Cleaned up generated skills directory');
  } catch {
    console.warn('Warning: Generated skills directory not found at', generatedSkillsDir);
  }
  console.log('\n=== Update complete! ===\n');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
