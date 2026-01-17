# Discord Quest Completer (with optional auto-claim)

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Join Discord](https://img.shields.io/badge/Join%20Discord-5865F2?logo=discord&logoColor=white&style=flat)](https://discord.gg/XarwTmZ3dW)

If this helped you farm some orbs - drop a ⭐ so others find it easier.

**What is this?**  
This is a tiny JavaScript code you paste into Discord's hidden developer console.  
It helps you finish Discord's "Quests" (those limited-time tasks like "watch 30 minutes of video" or "play X game for 2 hours") way faster - or at least without actually doing the boring parts.

**What it actually does (in simple words):**
- For **video watching quests** → it fakes that you've been watching the whole time → usually finishes in 5–15 minutes instead of waiting real time
- For **play a game** quests → it tricks Discord into thinking you're running the game right now (even if you're not)
- For **stream a game** quests → it pretends you're streaming in voice chat (you still need to actually start a stream though)
- For **embedded activity** quests (like play something inside Discord) → it sends fake "I'm playing" signals every ~20 seconds
- When 100% done → it can automatically click "Claim reward" for you (but see warnings below!)

You **must** accept the quest yourself in the app first.  
You **must** wait the real advertised time for non-video quests (script just keeps the progress ticking without you playing/streaming).

**Current status (January 17, 2026):**  
Still working on official Discord desktop app (stable, PTB, Canary).  
Browser / Vesktop / ArmCord → only video quests usually work. Game/stream/activity need real desktop client.

## ⚠️ VERY IMPORTANT WARNINGS – READ BEFORE USING ⚠️

**This is against Discord's rules**  
Faking activity / automating progress = violation of ToS (section on "integrity of service" and automation).  
If Discord catches you → permanent ban possible (especially on main account).

**Ban risk reality check (2026):**
- Single account, 1–3 quests per week → almost nobody banned yet
- Mass farming (10+ quests/day), nitro abuse, public bragging → much higher risk
- No big ban waves reported for this exact script yet - but Discord can add detection any Tuesday

**Auto-claim is extra risky**
The script now tries to auto-claim rewards when finished.  
**Problems this can cause:**
- Triggers CAPTCHA → claim fails → you have to do it manually anyway
- Makes your account look more automated → slightly higher ban chance
- Sometimes the claim endpoint just silently fails

**Safe option for your main account:**  
Open the script file → find the 3 lines that contain `/claim-reward` → put `//` in front of each one → save → now it only finishes progress, you claim by hand.

**Best practice:**  
- Use an alt account for testing / farming
- Don't do more than 2–4 quests per day
- Never post screenshots of rewards from this script publicly

## How to use (step-by-step – no coding knowledge needed)

1. Download and open the **official Discord desktop app**  
   → https://discord.com/download (Windows / Mac / Linux)

2. In Discord go to left sidebar → **Discover** tab → **Quests** section  
   → accept the quest(s) you want to complete

3. Press these keys at the same time: **Ctrl + Shift + I**  
   → a developer tools window pops up (black/dark background)

4. Click the **Console** tab (usually top row, looks like a black box)

5. If you see a message like "pasting is disabled" → type exactly this and press Enter:  
   `allow pasting`

6. Copy **all** the code from one of these files:  
   - Basic version (manual claim only): [`quest-completer.js`](./quest-completer.js)  
   - Version with auto-claim (riskier): [`quest-completer-with-auto-claim.js`](./quest-completer-with-auto-claim.js)

7. Right-click inside the Console window → Paste → press Enter

8. The script starts working immediately - watch the messages it prints  
   Example:  
   → Starting "Watch 30 min of video" - 0/1800s  
   → Play progress: 1245/3600  
   → Finished video quest → Auto-claimed (or Claim failed)

9. Special case - **stream** quests only:  
   - Join any voice channel that has **at least 1 other real person** (friend or your alt)  
   - Click "Screen" or "Application" and stream **any window** (even notepad)  
   - Script will count the time while you stream

10. Wait until it says "done" or "completed"  
    → Go to Quests tab → see if reward is claimed  
    → If not (or CAPTCHA appeared) → just click the Claim button yourself

Video quests → fast (5–20 min)  
Game / stream / activity → takes the **exact time** shown in the quest (10 min = ~10 min wait)

## FAQ – real questions people ask

**Q: Why doesn't it work / I get red error text?**  
A: 99% of time: not using official desktop app, or copy-paste went wrong. Restart Discord, try again. Use PTB/Canary if stable is broken.

**Q: Ctrl+Shift+I opens screenshot tool instead?**  
A: Your GPU software (AMD Radeon, NVIDIA GeForce Experience) stole the shortcut. Disable hotkeys in that program.

**Q: I'm using Vesktop / custom client – why does it say browser?**  
A: Vesktop etc. are fancy wrappers but miss important parts → game/stream won't work. Switch to official Discord.

**Q: Auto-claim gave me CAPTCHA / didn't work?**  
A: Expected. Just claim manually. That's why manual claim is safer on main.

**Q: Can it start/accept quests automatically?**  
A: No – accepting almost always shows CAPTCHA now. Too risky anyway.

**Q: Expired quest – can I finish it?**  
A: No. Server says no.

**Q: How many quests can I do?**  
A: Script does one after another automatically. But don't do 20/day – looks suspicious.

**Q: Is there a plugin version (Vencord / BetterDiscord)?**  
A: Yes – search GitHub for "Discord Quest Completer Vencord" or "QuestAuto". But plugins update slower – this raw script is fastest to fix when Discord breaks it.

**Q: Will Discord detect this in 2026?**  
A: Possible anytime. No mass bans yet for this method, but keep it low-key.

**Disclaimer:**  
This is shared for **educational purposes only**.  
Using it violates Discord's Terms of Service.  
If you get banned, flagged, or lose your account → that's 100% your responsibility.  
No warranties. No guarantees it keeps working tomorrow.

No affiliation with Discord Inc. whatsoever.

Made with ❤️ by emy who likes to poke at how software works :)

**Stay safe, use alts, don't get greedy.**  
Happy questing (responsibly).
