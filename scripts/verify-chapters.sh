#!/bin/bash
echo "Verifying chapters.ts..."
cd frontend
npx tsc --noEmit || { echo "FAILURE: TypeScript compilation failed"; exit 1; }
echo "SUCCESS: chapters.ts compiled correctly!"
