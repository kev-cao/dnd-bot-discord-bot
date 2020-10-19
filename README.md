# DnD Discord Bot
An all-purpose bot that has various features built specifically for DnD.

## Context
I started getting into Discord bot creation and wanted to become familiar with DiscordJS and NodeJS. Since I was playing a good amount of DnD at the time, I wanted to make something useful for my party members.

### Functionality
Currently can roll any of the traditional Dungeons and Dragons die using the `d!roll` command. (e.g. `d!roll d100`, `d!roll 2d8`, `d!roll d20`).

### Planned Features
Create atmosphere-based (intense, calm, suspenseful, action-packed, etc.) music playlists and add YouTube songs to the playlists. The DM
can choose what songs to play based on the game status.

## How to Use
Run `npm install` to download the required NodeJS libraries.

The code can only be used if a Discord bot is created on Discord's developer website. Once created, create an `auth.json` config file that contains the unique token provided to you by Discord. The `json` file should have a key `token` that maps to the provided token.
