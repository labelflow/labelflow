#!/usr/bin/env bash

../../.venv/bin/watchmedo shell-command \
  --patterns="*.py" \
  --recursive \
  --command='python "${watch_src_path}"' \
  .


# ../../.venv/bin/watchmedo shell-command \
#   --patterns="*.py" \
#   --recursive \
#   --command='echo "${watch_src_path}"' \
#   .
