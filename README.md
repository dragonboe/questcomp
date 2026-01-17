# Discord Quest Completer

Simple console script to help complete active Discord quests faster - supports play/stream/activity spoofing on the **desktop client**.

**Important notes:**
- Works best in **Discord Desktop app** (stable / PTB / Canary). Browser only handles video quests reliably now.
- Non-video quests (play/stream) **require** the real desktop app — webpack hooks + Flux events are blocked in browser.
- Risk = ToS violation. Historically low ban rate for careful single-account use, but **zero guarantee**. Use alt if paranoid.
- Script gets broken every few big Discord updates — check issues / forks for patches.

## How to use

1. Accept one or more quests in Discord → **Quests**
2. Open Discord desktop app
3. Press **Ctrl + Shift + I** → go to **Console** tab
4. If paste is blocked → type `allow pasting` and Enter
5. Paste the content of [`quest-completer.js`](./quest-completer.js) and hit Enter
6. Watch console logs — it auto-picks active quests and starts spoofing progress
7. For **stream** quests → join VC with at least 1 other person (friend/alt) and stream **any** window
8. Wait — progress shows in console (`Quest progress: X/Y`) and usually in quests tab too
9. Claim reward manually when done

Video quests usually finish in ~5–15 min depending on target seconds. Game/stream ones take the full advertised time.

## FAQ

**Q: Doesn't work / syntax error?**  
A: Use real Discord desktop app. Disable translator extensions. Copy raw script carefully.

**Q: DevTools shortcut screenshots instead?**  
A: Disable AMD Radeon / GPU overlay hotkeys.

**Q: Vesktop / custom client says browser?**  
A: Vesktop = wrapped browser → won't work for non-video. Use official desktop.

**Q: Can it auto-accept / auto-claim?**  
A: No — those endpoints often trigger captcha. Manual clicks are safer.

**Q: Expired quests?**  
A: Impossible — server rejects them.

**Q: Ban risk?**  
A: Always exists. Nobody publicly mass-banned yet for this style of spoofing (unlike nitro emoji bypass floods), but Discord can change detection anytime.

**Q: Vencord / BetterDiscord plugin version?**  
A: Some forks exist (search "QuestComplete" or "discord-quest" on Vencord plugins). Main script needs fast updates so standalone is better.

**Q: Multiple quests?**  
A: Script processes sequentially (one → next when done).

## Legal / License

Released under **GNU GPL-3.0** → see [LICENSE](./LICENSE)

**This is for educational / personal research purposes.** Automating progress simulation violates Discord ToS (section on integrity of service). Use at your own risk — no warranties.

No affiliation with Discord Inc.

Made with ♥ by emy for tech tinkerers.
