'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { baseInput, run, mkTmpGit: mkTmpGitRaw } = require('./helpers.js');

function mkTmpGit(branch) {
  return mkTmpGitRaw(`ref: refs/heads/${branch}\n`, 'csl-wt-');
}

test('matching worktree branch — 󰘬 hidden', async () => {
  const dir = mkTmpGit('worktree-reader-text-size');
  try {
    const i = baseInput();
    i.workspace.project_dir = dir;
    i.worktree = { name: 'reader-text-size' };
    assert.ok(!(await run(i)).includes('󰘬'));
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});

test('diverged branch — 󰘬 shown', async () => {
  const dir = mkTmpGit('main');
  try {
    const i = baseInput();
    i.workspace.project_dir = dir;
    i.worktree = { name: 'reader-text-size' };
    assert.ok((await run(i)).includes('󰘬 main'));
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});

test('different worktree name — 󰘬 shown', async () => {
  const dir = mkTmpGit('worktree-other-name');
  try {
    const i = baseInput();
    i.workspace.project_dir = dir;
    i.worktree = { name: 'reader-text-size' };
    assert.ok((await run(i)).includes('󰘬 worktree-other-name'));
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});

test('workspace.git_worktree fallback — 󰘯 shown, matching 󰘬 hidden', async () => {
  const dir = mkTmpGit('worktree-plain');
  try {
    const i = baseInput();
    i.workspace.project_dir = dir;
    i.workspace.git_worktree = 'plain';
    const out = await run(i);
    assert.ok(out.includes('󰘯 plain'));
    assert.ok(!out.includes('󰘬'));
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});

test('workspace.git_worktree fallback — diverged 󰘬 shown', async () => {
  const dir = mkTmpGit('main');
  try {
    const i = baseInput();
    i.workspace.project_dir = dir;
    i.workspace.git_worktree = 'plain';
    const out = await run(i);
    assert.ok(out.includes('󰘯 plain'));
    assert.ok(out.includes('󰘬 main'));
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});

test('worktree.name wins over workspace.git_worktree', async () => {
  const dir = mkTmpGit('worktree-cc');
  try {
    const i = baseInput();
    i.workspace.project_dir = dir;
    i.workspace.git_worktree = 'plain';
    i.worktree = { name: 'cc' };
    const out = await run(i);
    assert.ok(out.includes('󰘯 cc'));
    assert.ok(!out.includes('plain'));
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});

test('no worktree in input — 󰘬 shown normally', async () => {
  const dir = mkTmpGit('feature/my-branch');
  try {
    const i = baseInput();
    i.workspace.project_dir = dir;
    assert.ok((await run(i)).includes('󰘬 feature/my-branch'));
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});

test('STATUSLINE_WORKTREE_LAST_SEGMENT keeps only the part after the last dash', async () => {
  const i = baseInput();
  i.worktree = { name: 'agent-4f1c2b9e-7d3a-41b2-9c55-0e8f6a2d1b7c' };
  const out = await run(i, { STATUSLINE_WORKTREE_LAST_SEGMENT: '1' });
  assert.ok(out.includes('󰘯 0e8f6a2d1b7c'));
  assert.ok(!out.includes('agent-4f1c2b9e'));
});

test('worktree name stays whole without STATUSLINE_WORKTREE_LAST_SEGMENT', async () => {
  const i = baseInput();
  i.worktree = { name: 'statusline-update' };
  assert.ok((await run(i)).includes('󰘯 statusline-update'));
});
