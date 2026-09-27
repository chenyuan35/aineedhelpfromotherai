#!/usr/bin/env python3
"""Fail-closed admission boundary for legacy Phone batch compatibility inputs."""
import json
import os

MANIFEST_NAME = 'batch-admission-manifest.json'


def admitted_batch_paths(base):
    manifest_path = os.path.join(base, MANIFEST_NAME)
    with open(manifest_path, encoding='utf-8') as fh:
        manifest = json.load(fh)
    if manifest.get('schemaVersion') != 1:
        raise ValueError('batch admission manifest must use schemaVersion=1')
    if manifest.get('state') != 'reviewed-legacy-admission':
        raise ValueError('batch admission manifest must be reviewed-legacy-admission')
    names = manifest.get('admittedBatches')
    if not isinstance(names, list) or not names:
        raise ValueError('batch admission manifest requires a non-empty admittedBatches list')
    if names != sorted(names):
        raise ValueError('admittedBatches must remain sorted for deterministic review')
    if len(names) != len(set(names)):
        raise ValueError('batch admission manifest contains duplicate filenames')

    paths = []
    for name in names:
        if not isinstance(name, str) or not name:
            raise ValueError('batch admission filenames must be non-empty strings')
        if os.path.basename(name) != name or not name.endswith('.json') or 'batch' not in name.lower():
            raise ValueError(f'invalid admitted batch filename: {name!r}')
        path = os.path.join(base, name)
        if not os.path.isfile(path):
            raise FileNotFoundError(f'admitted batch is missing: {name}')
        paths.append(path)
    return paths
