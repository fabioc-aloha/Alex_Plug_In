# Work-Life Balance Features

> **Sustainable productivity tools for developer well-being**

Alex includes work-life balance features designed to help you work effectively while maintaining healthy habits. These aren't just productivity tools—they're designed to support sustainable, enjoyable development work.

## Philosophy

The ⚖️ Work-Life Balance features are built on these principles:

1. **Focused Work** - Deep work periods produce better results than constant multitasking
2. **Regular Breaks** - Breaks improve creativity, prevent burnout, and sustain energy
3. **Progress Visibility** - Seeing your progress motivates continued effort
4. **Streak Protection** - Gentle reminders help maintain positive habits without guilt

---

## Features

### 🍅 Focus Sessions

Pomodoro-style work sessions with automatic tracking.

#### How It Works

```
┌─────────────────────────────────────────────────┐
│  🍅 Focus (25 min) → ☕ Break (5 min) → Repeat  │
└─────────────────────────────────────────────────┘
```

1. **Start a session** via:
   - Status bar → "Start Focus Session"
   - Welcome View → ⚖️ Work-Life Balance → "Start Focus Session"
   - Command Palette → "Alex: Start Learning Session"
   - Keyboard: `Ctrl+Alt+P`

2. **Choose duration**:
   - 🍅 25 minutes (Pomodoro, recommended)
   - ⏱️ 45 minutes (Extended focus)
   - 🎯 Custom duration

3. **During the session**:
   - Status bar shows countdown: `🍅 24:32`
   - Stay focused on your current task
   - Alex tracks the session for your records

4. **When time's up**:
   - Notification with break suggestion
   - Break timer starts: `☕ 5:00`
   - Pomodoro count increments

#### Controls

| Action | How |
|--------|-----|
| Start | `Ctrl+Alt+P` or status bar menu |
| Pause/Resume | `Ctrl+Alt+Space` |
| End early | Click timer in status bar |

#### Best Practices

- **One task per session** - Decide what you'll work on before starting
- **No interruptions** - Close chat, mute notifications during focus time
- **Honor breaks** - Even 5 minutes away from the screen helps
- **Chain sessions** - After break, start another focus session

---

### 🎯 Learning Goals

Track progress toward specific learning objectives.

#### Creating Goals

1. **Via Command Palette**: "Alex: Create Learning Goal"
2. **Via Welcome View**: Click "Manage Goals"
3. **Via Chat**: `@alex /goals create`

#### Goal Structure

```
Goal: Master TypeScript Generics
├── Target: 10 practice exercises
├── Progress: 7/10 (70%)
├── Streak: 🔥 5 days
└── Status: Active
```

#### Goal Types

| Type | Example | Good For |
|------|---------|----------|
| **Count-based** | "Complete 10 code reviews" | Measurable activities |
| **Habit-based** | "Run Dream protocol daily" | Building routines |
| **Learning-based** | "Master React hooks" | Skill development |

#### Tracking Progress

- Goals appear in Welcome View with progress bars
- Update progress via `@alex /goals progress`
- Celebrate completions! 🎉

---

### 🔥 Streak Protection

Maintain momentum with daily progress tracking.

#### How Streaks Work

```
Day 1: ✅ Completed goal → Streak: 1
Day 2: ✅ Completed goal → Streak: 2
Day 3: ✅ Completed goal → Streak: 3 🔥
Day 4: ❌ Missed        → Streak: 0 😢
```

#### Streak Display

- **Status Bar**: Shows `🔥7` when you have an active streak
- **Welcome View**: Streak section with fire emoji
- **Goals Panel**: Individual goal streaks

#### Protecting Your Streak

- Alex will warn you when a streak is at risk
- Morning reminders (if enabled) help you stay on track
- Partial credit: Even small progress counts

---

### 📊 Health Dashboard

Visual overview of your cognitive architecture status.

#### Accessing

- Status bar → "Health Dashboard"
- Command Palette → "Alex: Open Health Dashboard"
- Welcome View → 🧠 Core → "Health Dashboard"

#### What You See

```
┌────────────────────────────────────────────┐
│  🏥 Alex Health Dashboard                  │
├────────────────────────────────────────────┤
│  Status: 🟢 Healthy                        │
│  Files: 42  Synapses: 156  Broken: 0       │
├────────────────────────────────────────────┤
│  📊 Session Activity                       │
│  Focus Time Today: 2h 15m                  │
│  Pomodoros: 🍅🍅🍅🍅🍅 (5)                  │
│  Current Streak: 🔥 7 days                 │
├────────────────────────────────────────────┤
│  🎯 Goals Progress                         │
│  ████████░░ 80% - TypeScript Generics      │
│  ██████░░░░ 60% - Code Review Practice     │
└────────────────────────────────────────────┘
```

---

## Quick Access Summary

| Feature | Status Bar | Welcome View | Command Palette | Keyboard |
|---------|------------|--------------|-----------------|----------|
| Focus Session | ✅ | ✅ | ✅ | `Ctrl+Alt+P` |
| Pause/Resume | ✅ | - | ✅ | `Ctrl+Alt+Space` |
| Goals | ✅ | ✅ | ✅ | - |
| Health Dashboard | ✅ | ✅ | ✅ | - |
| Streak View | Status bar | Welcome View | - | - |

---

## Integration with Alex

### Chat Commands

```
@alex /session          # Start focus session
@alex /goals            # View learning goals
@alex /goals create     # Create new goal
@alex /goals progress   # Update progress
@alex /status           # See streak and session info
```

### Automatic Tracking

Alex automatically tracks:
- Focus session completion
- Goal progress updates
- Daily activity for streaks
- Break time taken

### Meditation Integration

After a productive focus session, Alex may suggest:
> "You've completed 3 pomodoros! Want to consolidate what you learned with a quick meditation?"

---

## Customization

### Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `alex.session.defaultDuration` | 25 | Default focus session minutes |
| `alex.session.breakDuration` | 5 | Break duration after focus |
| `alex.goals.streakReminders` | true | Enable streak protection alerts |

### Notifications

- Focus session end: Always
- Break end: Optional
- Streak at risk: Configurable

---

## Tips for Success

### For Focus Sessions

1. **Start your day with a session** - Morning focus is often highest quality
2. **Match tasks to session length** - Small task? 25 min. Deep work? 45 min.
3. **Batch similar work** - Group code reviews, group documentation, etc.

### For Learning Goals

1. **Be specific** - "Learn TypeScript" is vague; "Complete 5 generic exercises" is measurable
2. **Start small** - 3 completions per week beats an abandoned "do it daily" goal
3. **Celebrate wins** - Small achievements build momentum

### For Streaks

1. **Don't obsess** - A broken streak isn't failure, it's a fresh start
2. **Set achievable daily minimums** - Even 5 minutes counts
3. **Build slowly** - Start with easy goals, increase difficulty over time

---

## Related Documentation

- [USER-MANUAL.md](USER-MANUAL.md) - Complete user guide
- [QUICK-REFERENCE.md](QUICK-REFERENCE.md) - Commands and shortcuts
- [GLOBAL-KNOWLEDGE.md](GLOBAL-KNOWLEDGE.md) - How knowledge persists

---

*Work-Life Balance features are part of Alex's commitment to sustainable, enjoyable development.* ⚖️
