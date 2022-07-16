# SPDX-License-Identifier: MIT
# Vegan Activists (VeganActivists@proton.me)

module default {
  type Activity extending Base, Created {
    annotation title := 'Discord Activity';
    annotation description := 'Represents an activity that is part of a user\'s presence. https://discord.js.org/#/docs/discord.js/13.8.0/class/Activity';

    property applicationId extending snowflake -> int64 {
      annotation description := 'The id of the application associated with this activity';
    }
    link assets -> RichPresenceAssets {
      annotation description := 'Assets for rich presence';
    }
    link buttons -> array<str> {
      annotation description := 'The labels of the buttons of this rich presence';
    }
    link details -> str {
      annotation description := 'Details about the activity';
    }
    link emoji -> Emoji {
      annotation description := 'Emoji for a custom activity';
    }
    link flags -> ActivityFlags {
      annotation description := 'Flags that report the activity';
    }
    property name -> str {
      annotation description := 'The activity\'s name';
    }
    link party -> ActivityParty {
      annotation description := 'Party of the activity';
    }
    link platform -> ActivityPlatform {
      annotation description := 'The platform the game is being played on';
    }
    property sessionId -> str {
      annotation description := 'The game\'s or Spotify session\'s id';
    }
    property state -> str {
      annotation description := 'State of the activity';
    }
    property syncId -> str {
      annotation description := 'The Spotify song\'s id';
    }
    link timestamps -> ActivityTimestamps {
      annotation description := 'Timestamps for the activity';
    }
    link activityType -> ActivityType {
      annotation description := 'The activity status\'s type';
    }
    property url -> str {
      annotation description := 'If the activity is being streamed, a link to the stream'
    }
  }

  type ActivityFlags extending BitField {
    annotation title := 'Discord Activity Flags';
    annotation description := 'Data structure that makes it easy to interact with an Activity#flags bitfield. https://discord.js.org/#/docs/discord.js/13.8.0/class/ActivityFlags';
  }

  type ActivityParty extending Base {
    annotation title := 'Discord Activity Party';
    annotation description := 'Represents a part of an activity https://discord.js.org/#/docs/discord.js/13.8.0/typedef/ActivityParty';

    property size -> array<int64> {
      annotation description := 'Size of the party as [current, max]';
    }
  }

  scalar type ActivityPlatform extending enum<desktop, samsung, xbox>;

  type ActivityTimestamps {
    property startTime -> datetime;
    property endTime -> datetime;
  }

  scalar type ActivityType extending enum<PLAYING, STREAMING, LISTENING, WATCHING, CUSTOM, COMPETING>;

  abstract type Base {
    annotation title := 'Base Discord Object';
    annotation description := 'Represents a data model that is identifiable by a Snowflake (i.e. Discord API data models). https://discord.js.org/#/docs/discord.js/13.8.0/class/Base';

    required property snowflake extending snowflake -> int64 {
      constraint exclusive;
    };
  }

  abstract type BitField {
    annotation title := 'Discord.js Bit Field';
    annotation description := 'Data structure that makes it easy to interact with a bitfield. https://discord.js.org/#/docs/discord.js/13.8.0/class/BitField';

    property bitfield -> bigint;
    property flags -> json;
  }

  abstract type Created {
    annotation title := 'Created Discord Object';
    annotation description := 'Represents a data model that was created by a discord user.';

    property createdAt -> datetime {
      annotation description := 'The time the activity was created at';
      readonly := true;
    }
    property createdTimestamp := datetime_get(.createdAt, 'epochseconds') {
      annotation description := 'Creation date of the activity';
    }
  }

  abstract type Emoji extending Base, Created {
    annotation title := 'Discord Emoji';
    annotation description := 'Represents an emoji, see GuildEmoji and ReactionEmoji. https://discord.js.org/#/docs/discord.js/13.8.0/class/Emoji';

    property animated -> bool {
      annotation description := 'Whether or not the emoji is animated';
    }
    property identifier -> str {
      annotation description := 'The identifier of this emoji, used for message reactions';
    }
    required property name -> str {
      annotation description := 'The emoji\'s name';
    }
    property url -> str {
      annotation description := 'The URL to the emoji file if it\'s a custom emoji';
    }
  }

  scalar type ExplicitContentFilterLevel extending enum<DISABLED, MEMBERS_WITHOUT_ROLES, ALL_MEMBERS>;

  type Guild extending Base, Created {
    annotation title := 'Discord Guild';
    annotation description := 'Represents a guild (or a server) on Discord. https://discord.js.org/#/docs/discord.js/13.8.0/class/Guild';

    link afkChannel -> channel::VoiceChannel {
      annotation description := 'AFK voice channel for this guild';
      constraint exclusive;
    }
    property afkChannelId extending snowflake -> int64 {
      annotation description := 'The id of the voice channel where AFK members are moved';
      constraint exclusive;
    }
    property afkTimeout -> int64 {
      annotation description := 'The time in seconds before a user is counted as "away from keyboard"';
    }
    property applicationId extending snowflake -> int64 {
      annotation description := 'The id of the application that created this guild (if applicable)';
    }
    property approximateMemberCount -> int64 {
      annotation description := 'The approximate amount of members the guild has';
    }
    property approximatePresenceCount -> int64 {
      annotation description := 'The approximate amount of presences the guild has';
    }
    property available -> bool {
      annotation description := 'Whether the guild is available to access. If it is not available, it indicates a server outage';
    }
    property banner -> str {
      annotation description := 'The hash of the guild banner';
    }
    multi link bans := Guild.<guild[IS member::GuildBan] {
      annotation description := 'A manager of the bans beloning to this guild';
      constraint exclusive;
    }
    multi link channels := Guild.<guild[IS channel::GuildChannel] {
      annotation description := 'A manager of the channels belonging to this guild';
    }
    multi link members := Guild.<guild[IS member::GuildMember] {
      annotation description := 'A manager of the members belonging to this guild';
    }
    property description -> str {
      annotation description := 'The description of the guild, if any';
    }
    property discoverySplash -> str {
      annotation description := 'The hash of the guild discovery splash image';
    }
    multi link emojis := Guild.<guild[IS GuildEmoji] {
      annotation description := 'A manager of the emojis belonging to this guild';
    }
    property explicitContentFilter -> ExplicitContentFilterLevel {
      annotation description := 'The explicity content filter level of the guild';
    }
    property icon -> str {
      annotation description := 'The icon hash of this guild';
    }
    multi link invites := Guild.<guild[IS Invite] {
      annotation description := 'A manager of the invites of this guild';
    }
  }

  type Invite extending Created {
    annotation title := 'Discord Guild Invite';
    annotation description := 'Represents an invitation to a guild channel. https://discord.js.org/#/docs/discord.js/13.8.0/class/Invite';

    required link channel -> channel::GuildChannel {
      annotation description := 'The channel this invite is for';
    }
    required property channelId extending snowflake -> int64 {
      annotation description := 'The channel\'s id this invite is for';
    }
    required property code -> str {
      annotation description := 'The code for this invite';
    }
    property expiresAt -> datetime {
      annotation description := 'The time this invite will expire at';
    }
    property expiresTimestamp -> datetime_get(.expiresAt, 'epochseconds') {
      annotation description := 'The timestamp the invite will expire at';
    }
    required link guild -> Guild {
      annotation description := 'The guild the invite is for including welcome screen data if present';
    }
    required link inviter -> User {
      annotation description := 'The user who created this invite';
    }
    property inviterId extending snowflake -> int64 {
      annotation description := 'The user\'s id who created this invite';
    }
    property maxAge -> int64 {
      annotation description := 'The maximum age of the invite, in seconds, 0 if never expires';
    }
    property maxUses -> int64 {
      annotation description := 'The maximum uses of this invite';
    }
    property url -> str {
      annotation description := 'The url to the invite';
    }
    property uses -> int64 {
      annotation description := 'How many times this invite has been used';
    }
  }

  type RichPresenceAssets {
    annotation title := 'Application Rich Presence Assets';
    annotation description := 'Assets for a rich presence. https://discord.js.org/#/docs/discord.js/13.8.0/class/RichPresenceAssets'

    property largeImage extending snowflake -> int64;
    property largeText -> str;
    property smallImage extending snowflake -> int64;
    property smallText -> str;
  }

  abstract property snowflake {
    annotation title := 'Discord Snowflake';
    annotation description := 'A Twitter snowflake, except the epoch is 2015-01-01T00:00:00.000Z. https://discord.js.org/#/docs/discord.js/13.8.0/typedef/Snowflake';
    readonly := true;
  }

  type User extending Base, Created {
    annotation title := 'Discord User';
    annotation description := 'Represents a user on Discord. https://discord.js.org/#/docs/discord.js/13.8.0/class/User';

    property accentColor -> int64;
    property avatar -> str;
    property banner -> str;
    property bot -> bool;
    property defaultAvatarURL -> str;
    property discriminator -> str;
    # link dmChannel -> channel::DMChannel;
    link flags -> UserFlags;
    property hexAccentColor -> str;
    property tag -> str;
    property username -> str;
  }

  type UserFlags {
    property bitfield -> int64;
    property flags -> json;
  }
}

module channel {
  type CategoryChannel extending GuildChannel {
    multi link children := CategoryChannel.<parent[IS GuildChannel];
  }

  abstract type Channel extending default::Base, default::Created {
    property channel_type -> ChannelType;
  }

  scalar type ChannelType extending enum<GUILD_TEXT, DM, GUILD_VOICE, GROUP_DM, GUILD_CATEGORY, GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PUBLIC_THREAD, GUILD_PRIVATE_THREAD, GUILD_STAGE_VOICE, GUILD_DIRECTORY, UNKNOWN>;

  abstract type GuildChannel extending Channel {
    annotation title := 'Discord Guild Channel';
    annotation description := 'Represents a guild channel from any of the following: TextChannel, VoiceChannel, CategoryChannel, NewsChannel, StoreChannel, StageChannel. https://discord.js.org/#/docs/discord.js/13.8.0/class/GuildChannel';

    required link guild -> default::Guild;
    required property guildId -> int64;
    property name -> str;
    link parent -> CategoryChannel;
    property parentId -> int64;
    multi link permissionOverwrites := GuildChannel.<channel[IS PermissionOverwrites];
    property permissionsLocked -> bool;
    property position -> int64;
    property rawPosition -> int64;
    property viewable -> boolean;
  }

  scalar type OverwriteType extending enum<role, member>;

  type Permissions {
    property bitfield -> bigint;
    property allPermissions -> bigint;
    property defaultPermissions -> bigint;
    property flags -> array<str>;
    property stageModerator -> bigint;
  }

  type PermissionOverwrites {
    link allowPermissions -> Permissions;
    link channel -> GuildChannel;
    link denyPermissions -> Permissions;
    property targetId -> int64;
    property overwriteType -> OverwriteType;
  }

  abstract type TextBasedChannel {
    # link lastMessage -> default::Message;
    property lastMessageId -> int64;
    property lastPinAt -> datetime;
    property lastPinTimestamp := datetime_get(.lastPinAt, 'epochseconds');
    property rateLimitPerPerson -> int64;
  }

  type TextChannel extending GuildChannel, TextBasedChannel {
    property nsfw -> bool;
    multi link threads := TextChannel.<parent[IS ThreadChannel];
  }

  type ThreadChannel extending Channel, TextBasedChannel {
    property archived -> bool;
    property archivedAt -> datetime;
    property archiveTimestamp := datetime_get(.archivedAt, 'epochseconds');
    property autoArchiveDuration -> int64;
    link guild -> default::Guild;
    property guildId -> int64;
    multi link guildMembers -> member::GuildMember;
    property locked -> bool;
    property memberCount -> int64;
    multi link members := ThreadChannel.<thread[IS member::ThreadMember];
    property messageCount -> int64;
    # multi link messages -> Message;
    property name -> str;
    required property ownerId -> int64;
    required link parent -> TextChannel;
    required property parentId -> int64;
  }
}

module member {
  scalar type BannedStatus extending enum<Unbanned, TempBanned, PermaBanned>;

  type GuildBan extending Created {
    required link guild -> default::Guild {
      annotation description := 'Guild the user is banned from';
      constraint exclusive;
    }
    required link member -> GuildMember {
      annotation description := 'Member that is banned from the guild';
      constraint exclusive;
    }
    required link moderator -> GuildMember {
      annotation description := 'Member that banned this user from the guild';
    }
    required property banExpiry -> datetime {
      annotation description := 'Day on which ban expires';
    }
    required property banReason -> str {
      annotation description := 'Reason for the member\'s ban';
    }
    required property bannedStatus -> BannedStatus {
      annotation description := 'Current state of the member\'s ban';
    }
  }

  type GuildMember extending default::Base {
    required link guild -> default::Guild;
    multi link alts -> GuildMember;
    link banned := GuildMember.<member[IS GuildMember];
  }

  alias Alt := GuildMember {
    alt_of := GuildMember.<alts[IS GuildMember]
  };

  type ThreadMember extending default::Base {
    link guildMember -> GuildMember;
    property joinedAt -> datetime;
    property joinedTimestamp := datetime_get(.joinedAt, 'epochseconds');
    link thread -> channel::ThreadChannel;
    link user -> default::User;
  }
}
