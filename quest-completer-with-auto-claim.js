// Quick Discord quest completer - video / play / stream spoof w/ auto-claim (risky!)
// Use: Accept quest(s) > Desktop app > DevTools Console > Paste > Enter
// For stream: Join VC w/ 1+ person & stream any window
// Auto-claim added - check for captcha/ban after

delete window.$;  // just in case

const chunks = window.webpackChunkdiscord_app;
const originalPush = chunks.push;

let reqCache;
chunks.push = ([, , factory]) => {
    reqCache = factory;
    return originalPush(arguments[0]);
};

const wp = reqCache.c;
chunks.pop();

const findStore = (test) => Object.values(wp).find(m => m?.exports && test(m.exports))?.exports;

const Flux       = findStore(e => e?.Z?.flushWaitQueue)?.Z;
const API        = findStore(e => e?.tn?.get)?.tn;
const Quests     = findStore(e => e?.Z?.getQuest)?.Z;
const Games      = findStore(e => e?.ZP?.getRunningGames)?.ZP;
const Streaming  = findStore(e => e?.Z?.getStreamerActiveStreamMetadata)?.Z;
const Channels   = findStore(e => e?.Z?.getAllThreadsForParent)?.Z;
const GuildChans = findStore(e => e?.ZP?.getSFWDefaultChannel)?.ZP;

const isDesktop  = typeof DiscordNative !== 'undefined';

const TASK_TYPES = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"];

const activeQuests = [...Quests.quests.values()]
    .filter(q => 
        q.userStatus?.enrolledAt &&
       !q.userStatus?.completedAt &&
        new Date(q.config.expiresAt) > new Date() &&
        TASK_TYPES.some(t => (q.config.taskConfig ?? q.config.taskConfigV2)?.tasks?.[t])
    );

if (!activeQuests.length) {
    console.log("No active quests found.");
    return;
}

async function processNext() {
    const quest = activeQuests.shift();
    if (!quest) return;

    const appId   = quest.config.application.id;
    const appName = quest.config.application.name;
    const qName   = quest.config.messages.questName;

    const tasks   = quest.config.taskConfig ?? quest.config.taskConfigV2;
    const task    = TASK_TYPES.find(t => tasks.tasks[t]);
    const target  = tasks.tasks[task].target;
    let progress  = quest.userStatus?.progress?.[task]?.value ?? 0;

    console.log(`→ Starting ${qName} (${task}) — ${progress}/${target}s`);

    const pid = 10000 + Math.floor(Math.random() * 50000);

    if (task === "WATCH_VIDEO" || task === "WATCH_VIDEO_ON_MOBILE") {
        // fake video timestamp spam
        const enrolledMs = new Date(quest.userStatus.enrolledAt).getTime();
        let done = false;

        while (true) {
            const maxPossible = Math.floor((Date.now() - enrolledMs) / 1000) + 15;
            const step = 6 + Math.random() * 3;  // ~7s jumps

            if (maxPossible - progress < step) break;

            progress = Math.min(target, progress + step);
            const ts = Math.floor(progress + Math.random() * 2);

            try {
                const r = await API.post({
                    url: `/quests/${quest.id}/video-progress`,
                    body: { timestamp: ts }
                });
                if (r.body.completed_at) {
                    done = true;
                    break;
                }
            } catch {}

            await new Promise(r => setTimeout(r, 1400));
        }

        // final push
        if (!done) {
            await API.post({
                url: `/quests/${quest.id}/video-progress`,
                body: { timestamp: target }
            }).catch(()=>{});
        }

        console.log(`Finished video quest → ${qName}`);
        
        // Auto-claim (risky - captcha/ban possible)
        try {
            await API.post({ url: `/quests/${quest.id}/claim-reward`, body: {} });
            console.log(`Auto-claimed ${qName} - check app for issues`);
        } catch (e) {
            console.error(`Claim failed: ${e.message} - do manual`);
        }
        
        processNext();
    }

    else if (task === "PLAY_ON_DESKTOP" || task === "STREAM_ON_DESKTOP") {
        if (!isDesktop) {
            console.log(`Use the real Discord desktop app for ${task} quests (browser blocked)`);
            processNext();
            return;
        }

        // fetch real exe name so it looks legit lol
        const apps = await API.get(`/applications/public?application_ids=${appId}`).then(r => r.body[0]);
        const exe = apps.executables?.find(e => e.os === "win32")?.name?.replace(">", "") ?? "game.exe";

        if (task === "PLAY_ON_DESKTOP") {
            const fakeProc = {
                cmdLine: `C:\\Program Files\\${appName}\\${exe}`,
                exeName: exe,
                exePath: `c:/program files/${appName.toLowerCase()}/${exe}`,
                hidden: false,
                isLauncher: false,
                id: appId,
                name: appName,
                pid,
                pidPath: [pid],
                processName: appName,
                start: Date.now(),
            };

            const realGames = Games.getRunningGames();
            const realGetGames = Games.getRunningGames;
            const realGetPid = Games.getGameForPID;
            Games.getRunningGames = () => [fakeProc];
            Games.getGameForPID = () => fakeProc;

            Flux.dispatch({
                type: "RUNNING_GAMES_CHANGE",
                removed: realGames,
                added: [fakeProc],
                games: [fakeProc]
            });

            const onHeartbeat = (e) => {
                const cur = quest.config.configVersion === 1
                    ? e.userStatus.streamProgressSeconds
                    : Math.floor(e.userStatus.progress?.PLAY_ON_DESKTOP?.value ?? 0);

                console.log(`Play progress: ${cur}/${target}`);

                if (cur >= target) {
                    console.log(`${qName} → done`);
                    Games.getRunningGames = realGetGames;
                    Games.getGameForPID = realGetPid;
                    Flux.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [fakeProc], added: [], games: [] });
                    Flux.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", onHeartbeat);
                    
                    // !!! Auto-claim (risky - captcha/ban possible) !!!
                    try {
                        await API.post({ url: `/quests/${quest.id}/claim-reward`, body: {} });
                        console.log(`Auto-claimed ${qName} - check app for issues`);
                    } catch (e) {
                        console.error(`Claim failed: ${e.message} - do manual`);
                    }
                    
                    processNext();
                }
            };

            Flux.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", onHeartbeat);
            console.log(`Faked running ${appName} — wait ~${Math.ceil((target - progress)/60)} min`);
        }

        else {  // STREAM_ON_DESKTOP
            const realMeta = Streaming.getStreamerActiveStreamMetadata;
            Streaming.getStreamerActiveStreamMetadata = () => ({ id: appId, pid, sourceName: null });

            const onHeartbeat = (e) => {
                const cur = quest.config.configVersion === 1
                    ? e.userStatus.streamProgressSeconds
                    : Math.floor(e.userStatus.progress?.STREAM_ON_DESKTOP?.value ?? 0);

                console.log(`Stream progress: ${cur}/${target}`);

                if (cur >= target) {
                    console.log(`${qName} → done`);
                    Streaming.getStreamerActiveStreamMetadata = realMeta;
                    Flux.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", onHeartbeat);
                    
                    // Auto-claim (risky - captcha/ban possible)
                    try {
                        await API.post({ url: `/quests/${quest.id}/claim-reward`, body: {} });
                        console.log(`Auto-claimed ${qName} - check app for issues`);
                    } catch (e) {
                        console.error(`Claim failed: ${e.message} - do manual`);
                    }
                    
                    processNext();
                }
            };

            Flux.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", onHeartbeat);
            console.log(`Faked stream to ${appName} — stream ANY window in VC (~${Math.ceil((target - progress)/60)} min)`);
            console.log("Need ≥1 other person in VC or it won't count");
        }
    }

    else if (task === "PLAY_ACTIVITY") {
        // embedded activity spam
        let chanId = Channels.getSortedPrivateChannels()[0]?.id;
        if (!chanId) {
            const g = Object.values(GuildChans.getAllGuilds()).find(g => g?.VOCAL?.length);
            chanId = g?.VOCAL[0]?.channel?.id;
        }

        if (!chanId) {
            console.log("No voice channel found for PLAY_ACTIVITY");
            processNext();
            return;
        }

        const streamKey = `call:${chanId}:1`;

        console.log(`Faking activity heartbeat in ${chanId}`);

        while (true) {
            try {
                const r = await API.post({
                    url: `/quests/${quest.id}/heartbeat`,
                    body: { stream_key: streamKey, terminal: false }
                });

                const p = r.body.progress?.PLAY_ACTIVITY?.value ?? 0;
                console.log(`Activity progress: ${p}/${target}`);

                if (p >= target) {
                    await API.post({
                        url: `/quests/${quest.id}/heartbeat`,
                        body: { stream_key: streamKey, terminal: true }
                    }).catch(()=>{});
                    break;
                }
            } catch {}

            await new Promise(r => setTimeout(r, 18500));  // ~20s
        }

        console.log(`Activity quest done → ${qName}`);
        
        // !!! Auto-claim (risky - captcha/ban possible) !!!
        try {
            await API.post({ url: `/quests/${quest.id}/claim-reward`, body: {} });
            console.log(`Auto-claimed ${qName} - check app for issues`);
        } catch (e) {
            console.error(`Claim failed: ${e.message} - do manual`);
        }
        
        processNext();
    }
}

processNext();
