#!/bin/bash

# Start backend in background
(cd backend && npm run dev) &

# Start frontend in background
(cd frontend && npm run dev) &

# Keep script running and forward signals
trap "trap - SIGTERM && kill -- -$$"
