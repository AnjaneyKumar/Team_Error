📋 PHASE 7 TESTING MASTER PLAN
================================
Status: READY TO TEST ✅

🚀 SYSTEMS UP & RUNNING:
✅ Backend: http://localhost:5000 (API Server)
✅ Frontend: http://localhost:5174 (React Vite App)
✅ Database: MongoDB Atlas connected
✅ WebSockets: Real-time bus tracking active

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 QUICK REFERENCE: THINGS TO TEST (In Priority Order)

🟥 CRITICAL (Must Work - App Breaks if Fails):
  1. Page loads at http://localhost:5174
  2. Map displays on screen
  3. Routes appear in sidebar
  4. Clicking route selects it (blue highlight)
  5. Buses appear on map after route selection
  6. No red errors in console (F12)

🟧 HIGH PRIORITY (Judges Will Test):
  7. Click ⭐ star on route → saves to favorites
  8. Refresh page → favorites still there ✅ PERSISTENCE TEST
  9. Switch language with 🌍 globe → UI changes instantly
  10. Refresh page → language persists
  11. Click ⚙️ settings → modal opens with 5 tabs
  12. Click 📊 Analytics → dashboard appears with charts
  13. Watch buses move smoothly on map for 30 sec
  14. Check console for any red errors during real-time updates

🟨 MEDIUM PRIORITY (Nice to Have):
  15. Verify peaking indicator 🟡 pulsing in header
  16. See popularity/frequency badges on routes
  17. Watch occupancy bar fill/change as buses update
  18. See ML confidence % on bus cards (if available)
  19. Mobile responsiveness: resize to iPhone 12 (DevTools)
  20. PWA install prompt appears (might need browser settings)

🟩 LOW PRIORITY (Polish):
  21. Animations feel smooth (not choppy)
  22. Notifications appear when buses arrive (no spam)
  23. Dark mode toggle works
  24. SearchBar finds routes
  25. Edge cases (empty routes, high delays) don't crash

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 DETAILED TESTING STEPS (Copy-Paste These)

STEP 1: LOAD TEST (2 min)
  □ Open http://localhost:5174 in Chrome
  □ Note load time (ideally < 2 sec)
  □ Press F12 to open DevTools → Console tab
  □ Look for any RED errors
  □ If errors: Read them carefully and note

STEP 2: CORE FUNCTIONALITY (5 min)
  □ Sidebar visible with 5 tabs (Routes, Stops, Buses, Nearby, Analytics)
  □ Map visible in center
  □ Routes list shows routes with colors
  □ Click any route → route highlights blue
  □ Map zooms/pans to show route
  □ Buses tab shows bus cards with:
    - Bus number
    ✓ Speed
    ✓ Occupancy %
    ✓ Status (Running/Delayed)
    ✓ Next stop info
    ✓ 🤖 ML ETA with confidence

STEP 3: FAVORITES TEST (⭐ CRITICAL - 3 min)
  □ In Routes tab, find any route
  □ Look for ⭐ star icon on the route card
  □ Click star → turns YELLOW/FILLED
  □ Route getsYELLOW BORDER highlighting
  □ "⭐ Favorites" panel at top shows this route
  □ Refresh page (F5)
  □ ⭐ CRITICAL: Star still filled? Route still in favorites?
    → If YES: Persistence works ✅✅✅
    → If NO: localStorage not working 🔴
  □ Click ⭐ again → star unfills, removed from favorites

STEP 4: LANGUAGE TEST (⭐ CRITICAL - 3 min)
  □ Find 🌍 globe icon in header (right side, next to theme toggle)
  □ Click globe → dropdown with 3 flags: 🇬🇧 🇮🇳 🇪🇸
  □ Click 🇮🇳 Hindi
  □ ALL text changes to Hindi:
    - Header: "🚌 स्मार्ट ट्रांजिट डैशबोर्ड"
    - Route cards: "रूट्स" etc
    - Sidebar: हिंदी labels
  □ CRITICAL: Refresh page (F5)
  □ Still in Hindi?
    → If YES: Language persistence works ✅✅✅
    → If NO: localStorage not reading language 🔴
  □ Switch back to English and refresh
  □ Should stay English

STEP 5: ANALYTICS TEST (3 min)
  □ Click "📊 Analytics" tab (5th tab in sidebar)
  □ Should see:
    ✓ "📊 Analytics Dashboard" header
    ✓ 🔥 Busiest Hour (some time shown)
    ✓ 🌙 Quietest Hour (some time shown)
    ✓ 📈 Occupancy by Hour (bar chart)
    ✓ Snapshots count
    ✓ Hours Tracked count
    ✓ Routes Tracked count
  □ Bar chart should animate on load
  □ (May show low data now - needs 5+ minutes to collect real data)

STEP 6: SETTINGS TEST (3 min)
  □ Click ⚙️ gear icon in header (right side)
  □ Modal opens with title "⚙️ Preferences & Settings"
  □ See 5 tabs: 🔔 Alerts | 📢 Notifications | 🎨 Display | ⭐ Favorites | ♿ Accessibility
  □ Click each tab → content changes
  □ Try toggling a switch on Notifications tab
  □ Switch animates smoothly
  □ Click "Save Changes" button
  □ See "Saved!" notification at top-right
  □ Close modal (X button)

STEP 7: REAL-TIME STABILITY (10 min)
  □ Stay on Buses tab or Map view
  □ Watch buses for 30 seconds:
    ✓ Buses move smoothly (not jumping)
    ✓ Update every ~1-2 seconds
    ✓ Occupancy % changes gradually (not random jumps)
    ✓ ETA counts down (1m → 30s → 20s)
    ✓ If a bus reaches 0 next stop ETA:
      - New stop becomes next
      - ETA resets for new stop
  □ Watch console (should be silent, no spam)
  □ If console shows errors:
    - Take screenshot
    - Note the exact error text
    - This is critical for debugging

STEP 8: MOBILE TEST (5 min)
  □ Press F12 to open DevTools
  □ Press Ctrl+Shift+M to toggle device toolbar
  □ Select "iPhone 12 Pro" from device list
  □ Check layout on mobile:
    ✓ Header takes full width (not cutoff)
    ✓ Menu burger button visible and clickable
    ✓ Map visible below header
    ✓ Cards stack properly (not side-by-side)
    ✓ No scroll bars (except for content)
    ✓ Text readable (not too small)
  □ Rotate to landscape (Ctrl+Shift+M again shows rotation option)
  □ Layout should adapt

STEP 9: CONSOLE & ERROR CHECK (Final - 5 min)
  □ With DevTools still open (F12 → Console tab)
  □ Go through Steps 2-8 again
  □ THIS TIME: Watch console for any errors
  □ ACCEPTABLE (ignore):
    - "Vite client connected"
    - "Socket.io connection established"
    - Service Worker messages
  □ RED ERRORS (INVESTIGATE):
    - "Cannot read property X"
    - "undefined is not a function"
    - "Failed to fetch"
    - Any error with "ERROR" in red
  □ If you see red errors:
    - Note exact text
    - Try to reproduce (click what caused it)
    - Check if reload fixes it

STEP 10: DEMO MODE (Simulate 3-5 min pitch)
  □ Close DevTools (F12)
  □ Reload page (Ctrl+R)
  □ Time the load
  □ Narrate what you see:
    "This is the Smart Transit Dashboard. It shows real-time bus tracking with AI-powered predictions."
  □ Point to map: "Here are live buses updating every second"
  □ Select a route: "We recommend the best route based on occupancy and delays"
  □ Show favorites: "Users can save their routes with one click"
  □ Show language: "We support multiple languages"
  □ Show analytics: "Historical data predicts future crowding"
  □ Smooth? No lag?
    → Ready for judges ✅
    → Needs polish 🔧

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 IF SOMETHING FAILS:

Error: "Cannot load" or blank page
  → Check: Backend running? (localhost:5000 in Network tab)
  → Fix: Restart backend if needed
  → Check: Frontend URL correct? (should be 5174)

Error: Routes don't load
  → Check: Network tab → api/routes
  → Should see green 200 response
  → If red/error: Backend issue or wrong CORS

Error: Favorites don't persist
  → Check: DevTools → Application tab → Local Storage
  → Look for "favorites" key
  → See JSON data there?
  → If NO: localStorage issue
  → If YES: But not showing: stores.js issue

Error: Language doesn't persist
  → Check: DevTools → Application → Local Storage
  → Look for "language" key
  → Should have value "en" or "hi" or "es"
  → If missing: setLanguage() not called

Error: Red errors in console
  → Copy exact error text
  → Search for function name in codebase
  → Check imports are correct
  → May need: npm install or npm run build

Performance Slow (> 3 sec load):
  → Check: Network tab file sizes
  → Check: Lazy loading components
  → Try: Hard refresh (Ctrl+Shift+R)
  → Try: Clear cache (DevTools → Application → Clear Storage)

Buses not updating:
  → Check: Network tab → WebSocket connection
  → Should show "ws://localhost:5000/socket.io"
  → If disconnected: Backend crashed or CORS issue
  → Try: Reload page to reconnect

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ FINAL CHECKLIST (Print This Before Testing):

🟢 Before Starting:
  □ Both servers running (5000 + 5174)
  □ No other apps using these ports
  □ Browser cache cleared
  □ Console open and ready (F12)

🟢 During Testing:
  □ Check console after EVERY major action
  □ Note any red errors immediately
  □ Watch for laggy animations
  □ Verify persistence (refresh page)
  □ Test on mobile (DevTools)

🟢 Success Criteria:
  ✅ All CRITICAL tests pass (step 1-6)
  ✅ No RED errors in console
  ✅ Smooth animations/real-time updates
  ✅ Mobile looks good
  ✅ Can demo in 5 minutes

If you get to "SUCCESS CRITERIA": 🎉 YOUR APP IS PRODUCTION-READY!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questions While Testing? Check these files:
  - Frontend: e:\Dev_Sprint\transport-dashboard\frontend\src\
  - Backend: e:\Dev_Sprint\transport-dashboard\backend\
  - This guide: TESTING_GUIDE.js (detailed explanations)
  - DevTools Console: Red errors show exactly what failed

Good luck! 🚀
