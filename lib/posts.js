export const POSTS = [
  {
    slug: "how-to-make-a-roblox-datastore",
    title: "How to Make a Roblox DataStore (Save Player Data)",
    description: "Learn how to save and load player data in Roblox Studio using DataStoreService. Step-by-step guide with working Luau code examples for beginners.",
    date: "2025-05-01",
    readTime: "6 min read",
    content: `
## What is a DataStore?

A DataStore is how you save player data between sessions in Roblox. Without it, everything resets when the player leaves — their cash, level, inventory, all gone. DataStores let you store that data permanently on Roblox's servers.

## Setting Up DataStoreService

First, make sure **API Services** are enabled in your game. Go to **Game Settings → Security → Enable Studio Access to API Services**.

Then in a Script inside ServerScriptService:

\`\`\`lua
local DataStoreService = game:GetService("DataStoreService")
local db = DataStoreService:GetDataStore("PlayerData_v1")
\`\`\`

The string "PlayerData_v1" is just a name — you can call it anything. Adding a version number (v1, v2) is good practice so you can reset data later if needed.

## Saving Data When the Player Leaves

\`\`\`lua
game.Players.PlayerRemoving:Connect(function(player)
    local cash = player.leaderstats and player.leaderstats:FindFirstChild("Cash")
    if cash then
        local ok, err = pcall(function()
            db:SetAsync(player.UserId, { Cash = cash.Value })
        end)
        if not ok then
            warn("Failed to save data for " .. player.Name .. ": " .. err)
        end
    end
end)
\`\`\`

Always wrap DataStore calls in **pcall**. DataStores can fail — the server might be busy, the player might disconnect mid-save, anything. If you don't use pcall, a failed save will crash your script entirely.

## Loading Data When the Player Joins

\`\`\`lua
game.Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local cash = Instance.new("IntValue")
    cash.Name = "Cash"
    cash.Value = 0
    cash.Parent = leaderstats

    local ok, data = pcall(function()
        return db:GetAsync(player.UserId)
    end)

    if ok and data then
        cash.Value = data.Cash or 0
    end
end)
\`\`\`

## Auto-Save Every 60 Seconds

Players sometimes crash or get disconnected before PlayerRemoving fires. Add a backup auto-save:

\`\`\`lua
task.spawn(function()
    while task.wait(60) do
        for _, player in ipairs(game.Players:GetPlayers()) do
            local cash = player.leaderstats and player.leaderstats:FindFirstChild("Cash")
            if cash then
                pcall(function()
                    db:SetAsync(player.UserId, { Cash = cash.Value })
                end)
            end
        end
    end
end)
\`\`\`

## Common DataStore Mistakes

**Using player.Name instead of player.UserId** — Names can change. UserId is permanent. Always use UserId as your key.

**Not using pcall** — DataStore calls can fail. Always wrap them.

**Saving too often** — DataStores have rate limits. Don't save on every coin collected or every kill. Save on PlayerRemoving and auto-save every 60 seconds.

**Not versioning your data** — If you change what you save (add a new stat), old data won't have it. Always use \`or defaultValue\` when reading: \`data.Cash or 0\`.

## Ready to Use

Want a complete working DataStore script you can drop right in? Check out our [DataStore Save & Load script](/scripts/datastore-save-load) — fully commented and tested.
    `.trim()
  },

  {
    slug: "roblox-scripting-for-beginners",
    title: "Roblox Scripting for Beginners: Complete 2025 Guide",
    description: "New to Roblox Studio scripting? This beginner guide covers Luau basics, where to put scripts, and your first working scripts with copy-paste examples.",
    date: "2025-05-03",
    readTime: "8 min read",
    content: `
## What Language Does Roblox Use?

Roblox uses **Luau** — a fast, typed dialect of Lua 5.1 developed by Roblox. If you've seen Lua tutorials online, most of it applies to Roblox scripting too.

## Where Do Scripts Go?

This is the most confusing part for beginners. There are three main places:

**ServerScriptService** — Scripts here run on the server. Use these for game logic, saving data, handling purchases, and anything security-sensitive. Players cannot see or edit these.

**StarterPlayerScripts** — LocalScripts here run on each player's computer. Use these for GUIs, input handling, and visual effects.

**StarterGui** — LocalScripts for your GUI elements go here.

**Inside Parts** — You can put a Script directly inside a Part in the workspace. Good for simple things like kill bricks.

## Your First Script: Make a Part Glow

Put a Script inside a Part in the workspace:

\`\`\`lua
local part = script.Parent
local light = Instance.new("PointLight")
light.Brightness = 5
light.Range = 20
light.Parent = part
\`\`\`

\`script.Parent\` refers to whatever the script is inside — in this case, the Part.

## Variables and Data Types

\`\`\`lua
local playerName = "Alex"        -- string
local score = 100                -- number
local isAlive = true             -- boolean
local nothing = nil              -- nil (empty/no value)
\`\`\`

Always use \`local\` for variables. Global variables in Roblox can cause hard-to-find bugs.

## If Statements

\`\`\`lua
local score = 50

if score >= 100 then
    print("You win!")
elseif score >= 50 then
    print("Almost there!")
else
    print("Keep going!")
end
\`\`\`

## Functions

\`\`\`lua
local function greetPlayer(player)
    print("Welcome, " .. player.Name .. "!")
end

game.Players.PlayerAdded:Connect(greetPlayer)
\`\`\`

\`...\` joins strings together. \`:Connect()\` wires an event to a function — so every time a player joins, \`greetPlayer\` runs.

## Loops

\`\`\`lua
-- Repeat 5 times
for i = 1, 5 do
    print("Count: " .. i)
end

-- Loop forever (use task.wait to avoid lag)
while true do
    task.wait(1)
    print("One second passed")
end
\`\`\`

**Always use task.wait() in while loops.** A loop without a wait will freeze Roblox Studio instantly.

## Getting Services

Almost everything in Roblox goes through services:

\`\`\`lua
local Players       = game:GetService("Players")
local TweenService  = game:GetService("TweenService")
local DataStoreService = game:GetService("DataStoreService")
\`\`\`

## Common Beginner Mistakes

**Lowercase API names** — Roblox APIs are case-sensitive. \`findFirstChild\` won't work, \`FindFirstChild\` will.

**Missing nil checks** — Always check if something exists before using it. \`if player.Character then\` before accessing the character.

**Script in the wrong place** — If your script isn't working, check where it is. A LocalScript in ServerScriptService won't run. A regular Script in StarterGui won't work either.

## Next Steps

Once you're comfortable with the basics, check out our free [script library](/). Copy working scripts, read through them, and modify them for your game. Learning by editing real code is faster than any tutorial.
    `.trim()
  },

  {
    slug: "how-to-make-a-roblox-shop-system",
    title: "How to Make a Roblox Shop System (Buy Items with Cash)",
    description: "Build a working Roblox shop system from scratch. Players spend in-game cash to buy tools and items. Includes server-side validation to prevent exploits.",
    date: "2025-05-05",
    readTime: "7 min read",
    content: `
## Overview

A shop system in Roblox has two parts: a **GUI** the player clicks, and a **server script** that handles the purchase securely. Never process purchases on the client — exploiters can fire RemoteEvents with any values they want.

## The Golden Rule: Validate on the Server

Everything that changes game state (cash, inventory, items) must be validated server-side. The client sends a request, the server checks it, the server acts on it. Never trust the client.

## Setting Up the RemoteEvent

In ServerScriptService, create the RemoteEvent that the shop GUI will fire:

\`\`\`lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local buyEvent = Instance.new("RemoteEvent")
buyEvent.Name = "BuyItem"
buyEvent.Parent = ReplicatedStorage
\`\`\`

## Defining Your Items

\`\`\`lua
local ITEMS = {
    Sword  = { price = 50  },
    Shield = { price = 100 },
    Bow    = { price = 75  },
}
\`\`\`

Keep your item definitions on the server. Never put prices in the client-side GUI code — an exploiter can read and modify client-side Lua.

## Handling the Purchase (Server)

\`\`\`lua
local ServerStorage = game:GetService("ServerStorage")

buyEvent.OnServerEvent:Connect(function(player, itemId)
    -- Validate item exists
    local item = ITEMS[itemId]
    if not item then return end

    -- Validate player has enough cash
    local cash = player.leaderstats and player.leaderstats:FindFirstChild("Cash")
    if not cash or cash.Value < item.price then return end

    -- Validate tool exists in ServerStorage
    local tool = ServerStorage:FindFirstChild(itemId)
    if not tool then return end

    -- Process purchase
    cash.Value -= item.price
    tool:Clone().Parent = player.Backpack
    print(player.Name .. " bought " .. itemId)
end)
\`\`\`

Notice how every step validates before acting. If anything is wrong, we just \`return\` — no error, no crash.

## The Client GUI (LocalScript)

In a LocalScript inside your shop GUI:

\`\`\`lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local buyEvent = ReplicatedStorage:WaitForChild("BuyItem")

-- Wire up your buy buttons
local buyButton = script.Parent:WaitForChild("BuyButton")
buyButton.MouseButton1Click:Connect(function()
    buyEvent:FireServer("Sword")
end)
\`\`\`

Use \`WaitForChild\` to get the RemoteEvent — it might not exist yet when the LocalScript runs.

## Putting Tools in ServerStorage

Your tools need to live in **ServerStorage**, not the workspace. Drag your Tool objects into ServerStorage in the Explorer. Name them exactly as they appear in your ITEMS table — "Sword", "Shield", etc.

## Preventing Duplicate Purchases

Add a check so players can't buy a tool they already have:

\`\`\`lua
-- Inside the OnServerEvent handler, before cloning:
if player.Backpack:FindFirstChild(itemId) or
   (player.Character and player.Character:FindFirstChild(itemId)) then
    return  -- already owns it
end
\`\`\`

## Ready-Made Script

Don't want to build this from scratch? Grab our complete [Shop System script](/scripts/shop-system) — fully working, exploit-safe, with comments explaining every line.
    `.trim()
  },

  {
    slug: "roblox-npc-scripting-guide",
    title: "Roblox NPC Scripting Guide: Pathfinding, Dialogue & More",
    description: "Learn how to script Roblox NPCs that walk around, talk to players, and react to the world. Complete guide with Luau code examples using PathfindingService.",
    date: "2025-05-07",
    readTime: "7 min read",
    content: `
## Types of NPCs in Roblox

NPCs (Non-Player Characters) are one of the most requested scripting topics for Roblox developers. There are a few main types:

**Wandering NPCs** — walk around randomly using PathfindingService
**Dialogue NPCs** — stand still and talk when a player interacts
**Enemy NPCs** — chase and attack players
**Vendor NPCs** — open a shop when approached

This guide covers the first two, which are the foundation for everything else.

## Setting Up Your NPC Model

Your NPC needs:
- A **HumanoidRootPart** (the main part Roblox uses for movement)
- A **Humanoid** (controls movement speed, health, etc.)
- A **Head** with a face (optional but standard)
- An **Animator** inside the Humanoid

The easiest way is to use a Roblox dummy: **Avatar → Insert → Dummy** in the toolbar.

## NPC Pathfinding (Random Wander)

PathfindingService makes NPCs navigate around obstacles automatically. Without it your NPC walks into walls.

\`\`\`lua
-- Script inside the NPC Model
local PathfindingService = game:GetService("PathfindingService")
local npc      = script.Parent
local humanoid = npc:WaitForChild("Humanoid")
local root     = npc:WaitForChild("HumanoidRootPart")

local WANDER_RADIUS = 30

local function getRandomTarget()
    local p = root.Position
    return Vector3.new(
        p.X + math.random(-WANDER_RADIUS, WANDER_RADIUS),
        p.Y,
        p.Z + math.random(-WANDER_RADIUS, WANDER_RADIUS)
    )
end

local function walkTo(target)
    local path = PathfindingService:CreatePath({
        AgentRadius = 2,
        AgentHeight = 5,
    })

    local ok = pcall(function()
        path:ComputeAsync(root.Position, target)
    end)

    if not ok or path.Status ~= Enum.PathStatus.Success then return end

    for _, waypoint in ipairs(path:GetWaypoints()) do
        if waypoint.Action == Enum.PathWaypointAction.Jump then
            humanoid.Jump = true
        end
        humanoid:MoveTo(waypoint.Position)
        humanoid.MoveToFinished:Wait()
    end
end

while task.wait(3) do
    if humanoid.Health > 0 then
        walkTo(getRandomTarget())
    end
end
\`\`\`

## NPC Dialogue with ProximityPrompt

ProximityPrompt is the cleanest way to trigger NPC interaction — no custom detection needed.

First, add a **ProximityPrompt** inside the NPC's Head in the Explorer. Set its ActionText to "Talk".

Then in a LocalScript in StarterPlayerScripts:

\`\`\`lua
local Players = game:GetService("Players")
local player = Players.LocalPlayer
local gui    = player.PlayerGui:WaitForChild("DialogueGui")
local frame  = gui:WaitForChild("Frame")
local label  = frame:WaitForChild("TextLabel")

local LINES = {
    "Hello, traveler.",
    "Have you seen the lost sword?",
    "It was last seen in the Dark Forest...",
}

local function typewrite(text)
    label.Text = ""
    for i = 1, #text do
        label.Text = text:sub(1, i)
        task.wait(0.04)
    end
end

local function runDialogue()
    frame.Visible = true
    for _, line in ipairs(LINES) do
        typewrite(line)
        task.wait(2.5)
    end
    frame.Visible = false
end

-- Find the NPC's ProximityPrompt and connect it
local npc    = workspace:WaitForChild("NPC")
local prompt = npc:FindFirstChildOfClass("ProximityPrompt", true)
if prompt then
    prompt.Triggered:Connect(runDialogue)
end
\`\`\`

## Tips for Better NPCs

**Make them look at the player** — When dialogue starts, use CFrame.lookAt to rotate the NPC toward the player. Much more immersive.

**Add idle animations** — A standing NPC with no animation looks dead. Use an AnimationController to play a looping idle animation.

**Limit wander range** — Set your WANDER_RADIUS based on the size of the area. Too large and the NPC wanders off the map.

**Use pcall on pathfinding** — PathfindingService can fail if the target is unreachable. Always wrap ComputeAsync in pcall.

## Ready-Made Scripts

Grab our complete scripts for both systems: [NPC Wander (Pathfinding)](/scripts/npc-wander-pathfinding) and [NPC Typewriter Dialogue](/scripts/npc-typewriter-dialogue).
    `.trim()
  },

  {
    slug: "how-to-fix-roblox-script-errors",
    title: "How to Fix Common Roblox Script Errors (With Examples)",
    description: "Stuck on a Roblox Studio script error? This guide covers the most common Luau errors — nil values, wrong casing, infinite loops — and how to fix them fast.",
    date: "2025-05-09",
    readTime: "6 min read",
    content: `
## Reading the Error Output

When a script errors in Roblox Studio, the Output window shows something like:

\`\`\`
ServerScriptService.MyScript:12: attempt to index nil with 'Value'
\`\`\`

This tells you three things: the script name (**MyScript**), the line number (**12**), and what went wrong (**attempt to index nil with 'Value'**). Always check the Output window first — it tells you exactly where to look.

## Error: "attempt to index nil"

This is the most common Roblox error. It means you're trying to access a property on something that doesn't exist.

**Bad:**
\`\`\`lua
local cash = player.leaderstats.Cash  -- crashes if leaderstats doesn't exist yet
cash.Value = 100
\`\`\`

**Good:**
\`\`\`lua
local leaderstats = player:FindFirstChild("leaderstats")
if leaderstats then
    local cash = leaderstats:FindFirstChild("Cash")
    if cash then
        cash.Value = 100
    end
end
\`\`\`

Always check if something exists before using it. Use **FindFirstChild** instead of dot notation when the object might not exist.

## Error: "attempt to call nil"

You're calling something as a function when it's nil — usually a wrong method name.

**Bad:**
\`\`\`lua
local part = workspace:findFirstChild("KillBrick")  -- lowercase, won't work
\`\`\`

**Good:**
\`\`\`lua
local part = workspace:FindFirstChild("KillBrick")  -- correct casing
\`\`\`

Roblox APIs are **case-sensitive**. \`findFirstChild\`, \`getService\`, \`waitForChild\` — all wrong. Use \`FindFirstChild\`, \`GetService\`, \`WaitForChild\`.

## Error: Script Freezes Studio (Infinite Loop)

\`\`\`lua
-- BAD - freezes Studio immediately
while true do
    print("hello")
end

-- GOOD - runs every second without freezing
while true do
    task.wait(1)
    print("hello")
end
\`\`\`

**Always put task.wait() inside while loops.** Without it, the loop runs millions of times per second and freezes everything.

## Error: "X is not a valid member of Y"

You're accessing a property or child that doesn't exist on that object.

\`\`\`lua
-- Error: 'Health' is not a valid member of Player
player.Health = 0  -- wrong, Health is on the Humanoid

-- Correct
local humanoid = player.Character and player.Character:FindFirstChild("Humanoid")
if humanoid then humanoid.Health = 0 end
\`\`\`

## Error: LocalScript Not Running

LocalScripts only run in certain places:
- StarterPlayerScripts ✓
- StarterGui ✓
- StarterCharacterScripts ✓
- Inside a Tool ✓
- ServerScriptService ✗ (won't run here)
- Workspace ✗ (won't run here)

If your LocalScript isn't doing anything, check where it is.

## Error: RemoteEvent Not Found

\`\`\`lua
-- BAD - might run before the RemoteEvent exists
local myEvent = ReplicatedStorage.MyEvent

-- GOOD - waits until it exists
local myEvent = ReplicatedStorage:WaitForChild("MyEvent")
\`\`\`

Use \`WaitForChild\` in LocalScripts when getting things from ReplicatedStorage. The server creates them, but the client might load before they're ready.

## Deprecated: wait() and spawn()

Old Roblox tutorials use \`wait()\` and \`spawn()\`. These are deprecated — use the modern versions:

\`\`\`lua
wait(1)         -- old, avoid
task.wait(1)    -- correct

spawn(myFunc)   -- old, avoid
task.spawn(myFunc)  -- correct
\`\`\`

## Still Stuck?

If you've got a broken script and can't figure out what's wrong, try our [AI Script Fixer](/fixer). Paste your script and it'll identify the exact issues and return a corrected version.
    `.trim()
  },
];
