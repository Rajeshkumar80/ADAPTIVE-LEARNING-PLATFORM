# CI History Check

## Current Status: ALL 32 runs failing

Every CI run on `main` has `conclusion: "failure"`. The failing step is always **"Run backend tests"** (step 8).

## Root Cause

Jest 30 with `--passWithNoTests` but **without `--forceExit`** fails on Linux CI runners. The "worker process has failed to exit gracefully" warning (caused by open handles from timers/ioredis/socket.io imports) becomes a non-zero exit on Linux, while Windows treats it as a warning.

All prior steps (install, prisma generate, prisma db push) succeed. The tests themselves all pass — the issue is Jest's process cleanup.

## CI Status per Commit

| Run | Commit | Status | Duration |
|-----|--------|--------|----------|
| #32 | `c06a074` (V3 final) | FAIL | 1m 5s |
| #31 | `549ec64` (README) | FAIL | 1m 0s |
| #30 | `7796195` (env config) | FAIL | 1m 2s |
| #29 | `447b6d0` (deploy plan) | FAIL | 1m 2s |
| #28 | `ad64807` (rate limits) | FAIL | — |
| #27 | `9ead1fe` (error tracking) | FAIL | — |
| ... | all 32 runs | FAIL | ~1m |

## Fix

Add `--forceExit` to jest command in package.json. This forces Jest to exit after all tests complete, even if there are open handles.
