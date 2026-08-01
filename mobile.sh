#!/usr/bin/env bash

# Setup USB Reverse Port Forwarding
echo "🔗 Forwarding port 8080 over USB to Android..."
adb reverse tcp:8080 tcp:8080

# Launch browser on Android device
echo "📱 Opening http://localhost:8080 on Android phone..."
adb shell am start -a android.intent.action.VIEW -d "http://localhost:8080"
