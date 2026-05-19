export const SNIPPETS = [
  {id:1,title:"Leaderstats Setup",slug:"leaderstats-setup",desc:"Create a leaderboard with Cash and Level values that appear above every player's head.",cat:"Leaderstats",diff:"Beginner",placement:"ServerScriptService",code:
`-- Leaderstats Setup
-- Place in ServerScriptService

game.Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local cash = Instance.new("IntValue")
    cash.Name = "Cash"
    cash.Value = 0
    cash.Parent = leaderstats

    local level = Instance.new("IntValue")
    level.Name = "Level"
    level.Value = 1
    level.Parent = leaderstats
end)`},

  {id:2,title:"DataStore: Save & Load",slug:"datastore-save-load",desc:"Persist player data across sessions with error handling and an auto-save loop.",cat:"Datastores",diff:"Intermediate",placement:"ServerScriptService",code:
`-- DataStore: Save & Load Player Data
-- Place in ServerScriptService

local DataStoreService = game:GetService("DataStoreService")
local db = DataStoreService:GetDataStore("PlayerData_v1")

game.Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local cash = Instance.new("IntValue")
    cash.Name = "Cash"
    cash.Parent = leaderstats

    local ok, data = pcall(function()
        return db:GetAsync(player.UserId)
    end)
    if ok and data then cash.Value = data.Cash or 0 end
end)

game.Players.PlayerRemoving:Connect(function(player)
    local cash = player.leaderstats.Cash.Value
    pcall(function() db:SetAsync(player.UserId, { Cash = cash }) end)
end)

task.spawn(function()
    while task.wait(60) do
        for _, p in ipairs(game.Players:GetPlayers()) do
            local cash = p.leaderstats and p.leaderstats.Cash
            if cash then
                pcall(function() db:SetAsync(p.UserId, { Cash = cash.Value }) end)
            end
        end
    end
end)`},

  {id:3,title:"Gamepass Check",slug:"gamepass-check",desc:"Check if a player owns a gamepass on join and grant a perk or reward.",cat:"Gamepasses",diff:"Intermediate",placement:"ServerScriptService",code:
`-- Gamepass Ownership Check
-- Place in ServerScriptService

local MarketplaceService = game:GetService("MarketplaceService")
local GAMEPASS_ID = 000000

game.Players.PlayerAdded:Connect(function(player)
    local ok, hasPass = pcall(function()
        return MarketplaceService:UserOwnsGamePassAsync(player.UserId, GAMEPASS_ID)
    end)
    if ok and hasPass then
        player.CharacterAdded:Connect(function(char)
            local hum = char:WaitForChild("Humanoid")
            hum.WalkSpeed = 32
        end)
    end
end)`},

  {id:4,title:"Kill Brick",slug:"kill-brick",desc:"A part that kills any player who touches it. Perfect for lava, voids, and traps.",cat:"Parts & Doors",diff:"Beginner",placement:"Script inside Part",code:
`-- Kill Brick
-- Place a Script inside the Part

local part = script.Parent

part.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChildOfClass("Humanoid")
    if humanoid and humanoid.Health > 0 then
        humanoid.Health = 0
    end
end)`},

  {id:5,title:"Proximity Prompt Door",slug:"proximity-prompt-door",desc:"Door that opens and closes on interact with a smooth TweenService animation.",cat:"Parts & Doors",diff:"Intermediate",placement:"Script inside Door Model",code:
`-- Proximity Prompt Door
local TweenService = game:GetService("TweenService")
local door   = script.Parent
local prompt = door:FindFirstChildOfClass("ProximityPrompt", true)
local isOpen = false
local debounce = false
local closedCF = door.PrimaryPart.CFrame

prompt.Triggered:Connect(function()
    if debounce then return end
    debounce = true
    isOpen = not isOpen
    TweenService:Create(
        door.PrimaryPart,
        TweenInfo.new(0.4, Enum.EasingStyle.Quad),
        { CFrame = isOpen and closedCF * CFrame.Angles(0, math.rad(90), 0) or closedCF }
    ):Play()
    prompt.ActionText = isOpen and "Close" or "Open"
    task.wait(0.5)
    debounce = false
end)`},

  {id:6,title:"Give Tool on Touch",slug:"give-tool-on-touch",desc:"Give a player a tool from ServerStorage when they step on a part.",cat:"Tools",diff:"Beginner",placement:"Script inside Part",code:
`-- Give Tool on Touch
local ServerStorage = game:GetService("ServerStorage")
local TOOL_NAME = "Sword"
local debounces = {}

script.Parent.Touched:Connect(function(hit)
    local player = game.Players:GetPlayerFromCharacter(hit.Parent)
    if not player or debounces[player.UserId] then return end
    debounces[player.UserId] = true
    local tool = ServerStorage:FindFirstChild(TOOL_NAME)
    if tool and not player.Backpack:FindFirstChild(TOOL_NAME)
       and not hit.Parent:FindFirstChild(TOOL_NAME) then
        tool:Clone().Parent = player.Backpack
    end
    task.wait(1)
    debounces[player.UserId] = nil
end)`},

  {id:7,title:"Basic Round System",slug:"basic-round-system",desc:"Loop-based round system with intermission, random map selection, and countdown timer.",cat:"Systems",diff:"Intermediate",placement:"ServerScriptService",code:
`-- Basic Round System
local ROUND_TIME   = 120
local INTERMISSION = 15
local MIN_PLAYERS  = 2
local mapsFolder   = workspace:WaitForChild("Maps")
local activeMap    = nil

local function loadMap()
    if activeMap then activeMap:Destroy() end
    local maps = mapsFolder:GetChildren()
    if #maps == 0 then return end
    activeMap = maps[math.random(1, #maps)]:Clone()
    activeMap.Parent = workspace
end

local function countdown(seconds, label)
    for i = seconds, 1, -1 do
        print(label .. i)
        task.wait(1)
    end
end

while true do
    repeat task.wait(2) until #game.Players:GetPlayers() >= MIN_PLAYERS
    countdown(INTERMISSION, "Intermission: ")
    loadMap()
    countdown(ROUND_TIME, "Time left: ")
    if activeMap then activeMap:Destroy(); activeMap = nil end
    task.wait(2)
end`},

  {id:8,title:"Checkpoint System",slug:"checkpoint-system",desc:"Save a player's respawn location when they touch a checkpoint.",cat:"Systems",diff:"Beginner",placement:"Script inside Checkpoint Part",code:
`-- Checkpoint System
local checkpoint = script.Parent
local debounces  = {}

checkpoint.Touched:Connect(function(hit)
    local player = game.Players:GetPlayerFromCharacter(hit.Parent)
    if not player or debounces[player.UserId] then return end
    debounces[player.UserId] = true
    if player.RespawnLocation ~= checkpoint then
        player.RespawnLocation = checkpoint
        local orig = checkpoint.Color
        checkpoint.Color = Color3.fromRGB(80, 227, 164)
        task.wait(0.4)
        checkpoint.Color = orig
    end
    task.wait(1)
    debounces[player.UserId] = nil
end)`},

  {id:9,title:"RemoteEvent: Client to Server",slug:"remoteevent-client-to-server",desc:"Safe template for client-to-server communication with server-side validation.",cat:"Networking",diff:"Intermediate",placement:"ServerScriptService + LocalScript",code:
`-- RemoteEvent: Client to Server
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local myEvent = Instance.new("RemoteEvent")
myEvent.Name = "MyEvent"
myEvent.Parent = ReplicatedStorage

myEvent.OnServerEvent:Connect(function(player, action, value)
    if typeof(action) ~= "string" then return end
    if typeof(value)  ~= "number"  then return end
    if action == "BuyItem" then
        local cash = player.leaderstats and player.leaderstats.Cash
        if cash and cash.Value >= value then
            cash.Value -= value
        end
    end
end)

-- CLIENT LocalScript:
-- local myEvent = ReplicatedStorage:WaitForChild("MyEvent")
-- myEvent:FireServer("BuyItem", 50)`},

  {id:10,title:"Admin Commands",slug:"admin-commands",desc:"Chat-based admin: /kick, /speed, /heal, /respawn with partial name matching.",cat:"Admin",diff:"Intermediate",placement:"ServerScriptService",code:
`-- Admin Commands
local ADMINS = { [000000000] = true }

local function findPlayer(name)
    for _, p in ipairs(game.Players:GetPlayers()) do
        if p.Name:lower():sub(1, #name) == name:lower() then return p end
    end
end

game.Players.PlayerAdded:Connect(function(player)
    if not ADMINS[player.UserId] then return end
    player.Chatted:Connect(function(msg)
        local args = msg:split(" ")
        local cmd, target = args[1]:lower(), args[2] and findPlayer(args[2])
        if cmd == "/kick" and target then
            target:Kick(args[3] or "Kicked by admin.")
        elseif cmd == "/speed" and target and args[3] then
            local hum = target.Character and target.Character:FindFirstChildOfClass("Humanoid")
            if hum then hum.WalkSpeed = tonumber(args[3]) or 16 end
        elseif cmd == "/heal" and target then
            local hum = target.Character and target.Character:FindFirstChildOfClass("Humanoid")
            if hum then hum.Health = hum.MaxHealth end
        elseif cmd == "/respawn" and target then
            target:LoadCharacter()
        end
    end)
end)`},

  {id:11,title:"Shop System",slug:"shop-system",desc:"Buy items with in-game cash via RemoteEvent. Server validates every purchase.",cat:"Economy",diff:"Intermediate",placement:"ServerScriptService + LocalScript",code:
`-- Shop System
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerStorage     = game:GetService("ServerStorage")
local ITEMS = {
    Sword  = { price = 50  },
    Shield = { price = 100 },
}
local buyEvent = Instance.new("RemoteEvent")
buyEvent.Name = "BuyItem"
buyEvent.Parent = ReplicatedStorage

buyEvent.OnServerEvent:Connect(function(player, itemId)
    local item = ITEMS[itemId]
    if not item then return end
    local cash = player.leaderstats and player.leaderstats:FindFirstChild("Cash")
    if not cash or cash.Value < item.price then return end
    local tool = ServerStorage:FindFirstChild(itemId)
    if not tool then return end
    cash.Value -= item.price
    tool:Clone().Parent = player.Backpack
end)

-- CLIENT: buyEvent:FireServer("Sword")`},

  {id:12,title:"NPC Typewriter Dialogue",slug:"npc-typewriter-dialogue",desc:"Display NPC dialogue with a classic typewriter effect.",cat:"NPC",diff:"Intermediate",placement:"LocalScript in StarterPlayerScripts",code:
`-- NPC Typewriter Dialogue
local Players = game:GetService("Players")
local player  = Players.LocalPlayer
local gui     = player.PlayerGui:WaitForChild("DialogueGui")
local frame   = gui:WaitForChild("Frame")
local label   = frame:WaitForChild("TextLabel")

local DIALOGUE   = { "Hello, traveler.", "Are you looking for the lost sword?", "Be careful out there." }
local CHAR_SPEED = 0.04
local LINE_PAUSE = 2.5
local running    = false

local function typewrite(text)
    label.Text = ""
    for i = 1, #text do
        label.Text = text:sub(1, i)
        task.wait(CHAR_SPEED)
    end
end

local function runDialogue()
    if running then return end
    running = true
    frame.Visible = true
    for _, line in ipairs(DIALOGUE) do typewrite(line); task.wait(LINE_PAUSE) end
    frame.Visible = false
    running = false
end`},

  {id:13,title:"NPC Wander (Pathfinding)",slug:"npc-wander-pathfinding",desc:"NPC that randomly wanders using PathfindingService with jump support.",cat:"NPC",diff:"Intermediate",placement:"Script inside NPC Model",code:
`-- NPC Wander with PathfindingService
local PathfindingService = game:GetService("PathfindingService")
local npc      = script.Parent
local humanoid = npc:WaitForChild("Humanoid")
local root     = npc:WaitForChild("HumanoidRootPart")
local RADIUS   = 30

local function walkTo(target)
    local path = PathfindingService:CreatePath({ AgentRadius=2, AgentHeight=5 })
    local ok = pcall(function() path:ComputeAsync(root.Position, target) end)
    if not ok or path.Status ~= Enum.PathStatus.Success then return end
    for _, wp in ipairs(path:GetWaypoints()) do
        if wp.Action == Enum.PathWaypointAction.Jump then humanoid.Jump = true end
        humanoid:MoveTo(wp.Position)
        humanoid.MoveToFinished:Wait()
    end
end

while task.wait(3) do
    if humanoid.Health > 0 then
        local p = root.Position
        walkTo(Vector3.new(
            p.X + math.random(-RADIUS, RADIUS), p.Y,
            p.Z + math.random(-RADIUS, RADIUS)
        ))
    end
end`},

  {id:14,title:"Give Cash on Kill",slug:"give-cash-on-kill",desc:"Award the killer cash when they eliminate another player.",cat:"Economy",diff:"Beginner",placement:"ServerScriptService",code:
`-- Give Cash on Kill
local CASH_REWARD = 10

game.Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function(character)
        local humanoid = character:WaitForChild("Humanoid")
        humanoid.Died:Connect(function()
            local tag = humanoid:FindFirstChild("creator")
            if not tag or not tag.Value or tag.Value == player then return end
            local cash = tag.Value.leaderstats and tag.Value.leaderstats:FindFirstChild("Cash")
            if cash then cash.Value += CASH_REWARD end
        end)
    end)
end)`},

  {id:15,title:"Day/Night Cycle",slug:"day-night-cycle",desc:"Smooth looping day/night cycle with configurable speed and start time.",cat:"Systems",diff:"Beginner",placement:"ServerScriptService",code:
`-- Day/Night Cycle
local Lighting   = game:GetService("Lighting")
local CYCLE_TIME = 600
local TICK       = 0.1
local clock      = 8

while true do
    task.wait(TICK)
    clock = clock + (24 / CYCLE_TIME) * TICK
    if clock >= 24 then clock = 0 end
    Lighting.ClockTime = clock
end`},

  {id:16,title:"GUI Slide-in Tween",slug:"gui-slide-in-tween",desc:"Animate a Frame sliding on and off screen. Great for menus and panels.",cat:"GUI",diff:"Beginner",placement:"LocalScript in StarterGui",code:
`-- GUI Slide-in / Slide-out
local TweenService = game:GetService("TweenService")
local gui        = script.Parent
local frame      = gui:WaitForChild("MenuFrame")
local openButton = gui:WaitForChild("OpenButton")
local tweenInfo  = TweenInfo.new(0.4, Enum.EasingStyle.Quint, Enum.EasingDirection.Out)
local isOpen     = false
local OPEN_POS   = UDim2.new(0.5, 0, 0.5, 0)
local CLOSED_POS = UDim2.new(0.5, 0, 1.5, 0)
frame.Position   = CLOSED_POS

openButton.MouseButton1Click:Connect(function()
    isOpen = not isOpen
    TweenService:Create(frame, tweenInfo,
        { Position = isOpen and OPEN_POS or CLOSED_POS }):Play()
end)`},

  {id:17,title:"Toast Notification",slug:"toast-notification",desc:"Pop-up toast that slides in from the bottom and auto-dismisses.",cat:"GUI",diff:"Intermediate",placement:"LocalScript in StarterGui",code:
`-- Toast Notification — call showToast() from anywhere
local TweenService = game:GetService("TweenService")
local gui = script.Parent

local function showToast(message, duration)
    duration = duration or 2.5
    local screen = Instance.new("ScreenGui", gui.Parent)
    screen.ResetOnSpawn = false; screen.IgnoreGuiInset = true
    local frame = Instance.new("Frame", screen)
    frame.Size = UDim2.new(0,260,0,48); frame.AnchorPoint = Vector2.new(0.5,1)
    frame.Position = UDim2.new(0.5,0,0.92,60); frame.BackgroundColor3 = Color3.fromRGB(20,20,40)
    frame.BorderSizePixel = 0; Instance.new("UICorner",frame).CornerRadius = UDim.new(0,10)
    local label = Instance.new("TextLabel", frame)
    label.Size = UDim2.new(1,-20,1,0); label.Position = UDim2.new(0,10,0,0)
    label.BackgroundTransparency = 1; label.Text = message
    label.TextColor3 = Color3.new(1,1,1); label.TextSize = 14
    label.Font = Enum.Font.GothamMedium; label.TextXAlignment = Enum.TextXAlignment.Left
    local info = TweenInfo.new(0.3, Enum.EasingStyle.Quint)
    TweenService:Create(frame, info, {Position=UDim2.new(0.5,0,0.92,0)}):Play()
    task.wait(duration)
    local out = TweenService:Create(frame, info, {Position=UDim2.new(0.5,0,0.92,60)})
    out:Play(); out.Completed:Wait(); screen:Destroy()
end

showToast("✓ Item purchased!")`},

  {id:18,title:"Anti-Cheat Speed Detection",slug:"anti-cheat-speed-detection",desc:"Detect and kick players moving faster than a configurable threshold.",cat:"Security",diff:"Intermediate",placement:"ServerScriptService",code:
`-- Anti-Cheat: Speed Detection
local MAX_SPEED      = 100
local CHECK_INTERVAL = 1
local prevPos        = {}

game.Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function(character)
        local root     = character:WaitForChild("HumanoidRootPart")
        local humanoid = character:WaitForChild("Humanoid")
        prevPos[player.UserId] = root.Position
        task.spawn(function()
            while character.Parent and humanoid.Health > 0 do
                task.wait(CHECK_INTERVAL)
                if not root.Parent then break end
                local dist = (root.Position - prevPos[player.UserId]).Magnitude
                if dist / CHECK_INTERVAL > MAX_SPEED then
                    player:Kick("Kicked: abnormal speed detected.")
                    return
                end
                prevPos[player.UserId] = root.Position
            end
            prevPos[player.UserId] = nil
        end)
    end)
end)`},

  {id:19,title:"RemoteFunction: Get Server Data",slug:"remotefunction-get-server-data",desc:"Client requests data from server synchronously with server-side validation.",cat:"Networking",diff:"Intermediate",placement:"ServerScriptService + LocalScript",code:
`-- RemoteFunction: Client Requests Data
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local rf = Instance.new("RemoteFunction")
rf.Name = "GetPlayerStats"; rf.Parent = ReplicatedStorage

rf.OnServerInvoke = function(player)
    local ls = player.leaderstats
    if not ls then return {} end
    return { cash=ls.Cash and ls.Cash.Value or 0, level=ls.Level and ls.Level.Value or 1 }
end

-- CLIENT: local stats = rf:InvokeServer()`},

  {id:20,title:"Mobile Action Button",slug:"mobile-action-button",desc:"On-screen button that only renders on touch devices.",cat:"GUI",diff:"Beginner",placement:"LocalScript in StarterGui",code:
`-- Mobile Action Button (touch devices only)
local UserInputService = game:GetService("UserInputService")
if not UserInputService.TouchEnabled then return end
local player    = game.Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid  = character:WaitForChild("Humanoid")
local button    = Instance.new("TextButton", script.Parent)
button.Size = UDim2.new(0,72,0,72); button.Position = UDim2.new(1,-90,1,-100)
button.AnchorPoint = Vector2.new(0,1); button.Text = "⚡"; button.TextSize = 28
button.BackgroundColor3 = Color3.fromRGB(40,40,80); button.TextColor3 = Color3.new(1,1,1)
button.BackgroundTransparency = 0.2; button.BorderSizePixel = 0
Instance.new("UICorner", button).CornerRadius = UDim.new(1,0)
button.MouseButton1Click:Connect(function() humanoid.Jump = true end)`},

  {id:21,title:"Teleport to Place",slug:"teleport-to-place",desc:"Teleport a player to another Roblox Place ID. Works for portals and multiplace games.",cat:"Systems",diff:"Beginner",placement:"Script inside Part",code:
`-- Teleport to Place
local TeleportService = game:GetService("TeleportService")
local PLACE_ID = 0000000000
local debounces = {}

script.Parent.Touched:Connect(function(hit)
    local player = game.Players:GetPlayerFromCharacter(hit.Parent)
    if not player or debounces[player.UserId] then return end
    debounces[player.UserId] = true
    local ok, err = pcall(function()
        TeleportService:Teleport(PLACE_ID, player)
    end)
    if not ok then
        warn("Teleport failed: " .. err)
        debounces[player.UserId] = nil
    end
end)`},

  {id:22,title:"Team System",slug:"team-system",desc:"Assign players to teams on join with auto-balancing.",cat:"Systems",diff:"Intermediate",placement:"ServerScriptService",code:
`-- Team System with Auto-Balance
local Teams = game:GetService("Teams")

local function getOrCreateTeam(name, color)
    local t = Teams:FindFirstChild(name)
    if t then return t end
    local team = Instance.new("Team", Teams)
    team.Name = name; team.TeamColor = BrickColor.new(color)
    team.AutoAssignable = false; return team
end

local red  = getOrCreateTeam("Red Team",  "Bright red")
local blue = getOrCreateTeam("Blue Team", "Bright blue")

local function assignTeam(player)
    player.Team = #red:GetPlayers() <= #blue:GetPlayers() and red or blue
    player.TeamColor = player.Team.TeamColor
end

game.Players.PlayerAdded:Connect(assignTeam)
game.Players.PlayerRemoving:Connect(function()
    task.wait(1)
    for _, p in ipairs(game.Players:GetPlayers()) do assignTeam(p) end
end)`},

  {id:23,title:"Tycoon Conveyor Belt",slug:"tycoon-conveyor-belt",desc:"A moving conveyor belt that pushes parts or players. Classic tycoon mechanic.",cat:"Parts & Doors",diff:"Beginner",placement:"Script inside Conveyor Part",code:
`-- Tycoon Conveyor Belt
local conveyor  = script.Parent
local SPEED     = 20
local DIRECTION = Vector3.new(1, 0, 0)

conveyor.Touched:Connect(function(hit)
    if hit.Anchored then return end
    local humanoid = hit.Parent:FindFirstChildOfClass("Humanoid")
    if humanoid then
        local root = hit.Parent:FindFirstChild("HumanoidRootPart")
        if root then root.AssemblyLinearVelocity = DIRECTION * SPEED end
        return
    end
    if hit:IsA("BasePart") then
        hit.AssemblyLinearVelocity = DIRECTION * SPEED
    end
end)`},

  {id:24,title:"Inventory System",slug:"inventory-system",desc:"Server-side inventory using a table. Add, remove, and check items.",cat:"Economy",diff:"Intermediate",placement:"ServerScriptService",code:
`-- Inventory System
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local inventories = {}

local getInvRF = Instance.new("RemoteFunction")
getInvRF.Name = "GetInventory"; getInvRF.Parent = ReplicatedStorage

game.Players.PlayerAdded:Connect(function(p) inventories[p.UserId] = {} end)
game.Players.PlayerRemoving:Connect(function(p) inventories[p.UserId] = nil end)

local function addItem(player, itemId, qty)
    local inv = inventories[player.UserId]; if not inv then return end
    inv[itemId] = (inv[itemId] or 0) + (qty or 1)
end

local function removeItem(player, itemId, qty)
    local inv = inventories[player.UserId]; if not inv or not inv[itemId] then return false end
    qty = qty or 1; if inv[itemId] < qty then return false end
    inv[itemId] = inv[itemId] - qty
    if inv[itemId] <= 0 then inv[itemId] = nil end
    return true
end

getInvRF.OnServerInvoke = function(player)
    return inventories[player.UserId] or {}
end`},

  {id:25,title:"Music Player",slug:"music-player",desc:"Plays a playlist of songs in order using SoundService. Loops automatically.",cat:"Systems",diff:"Beginner",placement:"ServerScriptService",code:
`-- Music Player
local SoundService = game:GetService("SoundService")
local PLAYLIST = {
    "rbxassetid://0000000001",
    "rbxassetid://0000000002",
}
local SHUFFLE = false
local currentIndex = 1
local bgm = Instance.new("Sound")
bgm.Volume = 0.5; bgm.Parent = SoundService

local function getNext()
    if SHUFFLE then return math.random(1, #PLAYLIST) end
    local n = currentIndex + 1; return n > #PLAYLIST and 1 or n
end

bgm.Ended:Connect(function() currentIndex = getNext(); bgm.SoundId = PLAYLIST[currentIndex]; bgm:Play() end)
if #PLAYLIST > 0 then bgm.SoundId = PLAYLIST[1]; bgm:Play() end`},
];

export const CATEGORIES = ["All","Leaderstats","Datastores","Gamepasses","Parts & Doors","Tools","Economy","NPC","GUI","Systems","Networking","Admin","Security"];

export const CAT_COLOR = {
  Leaderstats:    {bg:"rgba(80,227,164,.09)",  c:"#50e3a4", b:"rgba(80,227,164,.22)"},
  Datastores:     {bg:"rgba(74,158,255,.09)",  c:"#4a9eff", b:"rgba(74,158,255,.22)"},
  Gamepasses:     {bg:"rgba(232,160,32,.09)",  c:"#e8a020", b:"rgba(232,160,32,.22)"},
  "Parts & Doors":{bg:"rgba(255,112,67,.09)",  c:"#ff7043", b:"rgba(255,112,67,.22)"},
  Tools:          {bg:"rgba(186,104,200,.09)", c:"#ba68c8", b:"rgba(186,104,200,.22)"},
  Economy:        {bg:"rgba(255,215,0,.09)",   c:"#ffd700", b:"rgba(255,215,0,.22)"},
  NPC:            {bg:"rgba(77,208,225,.09)",  c:"#4dd0e1", b:"rgba(77,208,225,.22)"},
  GUI:            {bg:"rgba(178,102,255,.09)", c:"#b266ff", b:"rgba(178,102,255,.22)"},
  Systems:        {bg:"rgba(100,200,120,.09)", c:"#64c878", b:"rgba(100,200,120,.22)"},
  Networking:     {bg:"rgba(240,98,146,.09)",  c:"#f06292", b:"rgba(240,98,146,.22)"},
  Admin:          {bg:"rgba(239,83,80,.09)",   c:"#ef5350", b:"rgba(239,83,80,.22)"},
  Security:       {bg:"rgba(255,160,0,.09)",   c:"#ffa000", b:"rgba(255,160,0,.22)"},
};

export const FIXER_PROMPT = `You are a world-class Roblox Luau developer. You have shipped multiple successful Roblox games and you review scripts like a senior engineer doing a code review.

STEP 1 — UNDERSTAND INTENT:
Before looking for bugs, ask yourself: what is this script supposed to do?
Read the variable names, comments, and structure to understand the goal.
If the script mixes two unrelated systems that cannot logically work together, that is a DESIGN ERROR — flag it and explain what the two systems should be as separate scripts instead of trying to patch it.

STEP 2 — CHECK LOGIC FIRST (most common source of broken scripts):
- Does the code actually do what it intends, or does it do something different?
- Debounce MUST wrap the entire handler from top to bottom. If debounce is set to true, all logic runs, THEN it resets. Never reset debounce in the middle.
- Kill bricks kill the toucher. They do not have a "killer". Do not invent a killer using proximity checks or loops — that is not how Roblox works.
- Cash-on-kill uses the "creator" tag on the Humanoid, set by the weapon when it deals damage. It is a completely separate system from kill bricks.
- Never loop through all players to find who is "nearby" as a substitute for proper game logic.
- humanoid.CreatorId does NOT exist in Roblox — this is a fake API. The correct way to track a killer is with a creator tag: create an ObjectValue named "creator" parented to the Humanoid, set its Value to the attacking player, and use Debris:AddItem to clean it up after 2 seconds.
- Players:GetPlayerByUserId is correct but only useful when you have a real UserId from a creator tag, not from a fake property.
- Never declare the same variable (like local Players) twice in the same script — this causes errors.
- Rewarding the player who died instead of the killer is a logic error.
- DataStore:SetAsync must NOT be called on every Touched event — only on PlayerRemoving or a periodic save loop.
- If a fix would require inventing data that does not exist in the script (like a killer identity from a kill brick), acknowledge the design flaw instead.

STEP 3 — CHECK BUGS & ERRORS:
- Incorrect API casing: findFirstChild → FindFirstChild, getDataStore → GetDataStore, players → Players
- Missing nil checks before accessing properties
- workspace.X without WaitForChild
- Deprecated APIs: wait() → task.wait(), spawn() → task.spawn()

STEP 4 — CHECK SECURITY:
- Client-exploitable RemoteEvents with no server validation
- Cash values that can be manipulated by the client
- Instance.new("Tool") — must clone from ServerStorage instead

STEP 5 — WRITE THE FIX:
- Only fix what is actually wrong
- Do not invent new systems or logic that was not in the original script
- If the script has a fundamental design flaw, explain it clearly in issues and provide the corrected version of what the script CAN do, with a comment explaining what needs to be a separate script
- The fixed code must work correctly in a real Roblox game

Respond ONLY with a valid JSON object — no markdown, no backticks, no extra text:
{
  "summary": "One sentence: what this script intends to do",
  "issues": ["specific issue with exact line or pattern and why it is wrong"],
  "fixedCode": "complete working corrected script",
  "whatChanged": ["change 1 — brief reason why"]
}

If no issues exist, return empty arrays and the original code unchanged.`;
