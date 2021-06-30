#!/usr/bin/env bash

../../.venv/bin/uvicorn main:app --reload --app-dir src/ --host 0.0.0.0 --port 5000 --log-level info --env-file ../../.env
