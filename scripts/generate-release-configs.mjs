// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
/**
 * This script will generate configuration files for release-please.
 *
 * Usage:
 * npm run generate-release-configs <path-to-release-config-directory>
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { directoryExists, fileExists, loadJson, saveJson } from './common.mjs';

/**
 * Execute the process.
 */
async function run() {
	process.stdout.write('Generate Release Configs\n');
	process.stdout.write('========================\n');
	process.stdout.write('\n');
	process.stdout.write(`Platform: ${process.platform}\n`);

	if (process.argv.length <= 2) {
		throw new Error('No target directory specified');
	}

	process.stdout.write('\n');
	const targetDirectory = path.resolve(process.argv[2]);

	process.stdout.write(`Target Directory: ${targetDirectory}\n`);

	const packageJson = await loadJson('package.json');

	const packageNames = packageJson.workspaces;

	await generateConfig(targetDirectory, 'prod', packageNames);
	await generateConfig(targetDirectory, 'prerelease', packageNames);

	await generateManifest(targetDirectory, 'prod', packageNames);
	await generateManifest(targetDirectory, 'prerelease', packageNames);

	process.stdout.write(`\nDone.\n`);
}

/**
 * Generate the release config.
 * @param targetDirectory The target directory to store the config in.
 * @param releaseType The type of semver to generate the config for.
 * @param packageNames The package names to generate the config for.
 */
async function generateConfig(targetDirectory, releaseType, packageNames) {
	const versioning = {
		prod: 'default',
		prerelease: 'prerelease'
	};

	process.stdout.write(`\nGenerating config for ${releaseType}...\n`);

	const config = {
		$schema: 'https://raw.githubusercontent.com/googleapis/release-please/main/schemas/config.json',
		description: `Auto-Generated Release Please configuration for ${releaseType}`,
		'pull-request-title-pattern': `chore: ${releaseType} release prepared`,
		'pull-request-header': `chore: ${releaseType} release prepared`,
		'pull-request-footer': 'This PR was generated by the prepare-release GHA',
		'release-type': 'node',
		'initial-version': '0.0.1',
		versioning: versioning[releaseType]
	};

	if (releaseType === 'prerelease') {
		config.prerelease = true;
		config['prerelease-type'] = 'next';
	}

	config.packages = {};
	config.plugins = [
		'node-workspace',
		{
			type: 'linked-versions',
			groupName: 'repo',
			components: []
		}
	];

	for (const packageName of packageNames) {
		const packageNameParts = packageName.split('/');
		config.packages[packageName] = {
			'package-name': packageNameParts[1],
			'changelog-path': `docs/changelog.md`
		};

		const embeddedVersionFiles = ['src/cli.ts', 'tests/cli.spec.ts', 'src/index.ts'];

		for (const embeddedVersionFile of embeddedVersionFiles) {
			if (await fileExists(path.join(packageName, embeddedVersionFile))) {
				config.packages[packageName]['extra-files'] ??= [];
				config.packages[packageName]['extra-files'].push(embeddedVersionFile);
			}
		}

		config.plugins[1].components.push(packageNameParts[1]);
	}

	if (!(await directoryExists(targetDirectory))) {
		await mkdir(targetDirectory, { recursive: true });
	}

	await saveJson(path.join(targetDirectory, `release-please-config.${releaseType}.json`), config);
}

/**
 * Generate the manifest config.
 * @param targetDirectory The target directory to store the config in.
 * @param versionBase The type of version manifest to create.
 * @param packageNames The package names to generate the config for.
 */
async function generateManifest(targetDirectory, versionBase, packageNames) {
	process.stdout.write(`\nGenerating manifest for ${versionBase}...\n`);

	const filename = path.join(targetDirectory, `release-please-manifest.${versionBase}.json`);

	if (!(await fileExists(filename))) {
		const packageJson = await loadJson('package.json');
		const currentVersion = packageJson.version;
		const versionParts = currentVersion.split('-');

		const config = {};

		const newVersion = versionBase === 'prod' ? versionParts[0] : currentVersion;

		for (const packageName of packageNames) {
			config[packageName] = newVersion;
		}

		if (!(await directoryExists(targetDirectory))) {
			await mkdir(targetDirectory, { recursive: true });
		}

		await saveJson(filename, config);
	}
}

run().catch(err => {
	process.stderr.write(`\n${err.stack ?? err}\n`);
	// eslint-disable-next-line unicorn/no-process-exit
	process.exit(1);
});
