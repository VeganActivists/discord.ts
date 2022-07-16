CREATE MIGRATION m1vuofi3kt3gm6wc25pxowbxjoguxdfzcgdjygiqdu2ygqia3hmxra
    ONTO m1lwjxxafs4wr2cyaszhgzx37z4pzwecbu3xjg35b7jzs7tgrmlysa
{
  CREATE MODULE channel IF NOT EXISTS;
  CREATE MODULE member IF NOT EXISTS;
  CREATE ABSTRACT PROPERTY default::snowflake {
      SET readonly := true;
      CREATE ANNOTATION std::description := 'A Twitter snowflake, except the epoch is 2015-01-01T00:00:00.000Z. https://discord.js.org/#/docs/discord.js/13.7.0/typedef/Snowflake';
      CREATE ANNOTATION std::title := 'Discord Snowflake';
  };
  CREATE ABSTRACT TYPE default::Base {
      CREATE REQUIRED PROPERTY snowflake EXTENDING default::snowflake -> std::int64 {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE ANNOTATION std::description := 'Represents a data model that is identifiable by a Snowflake (i.e. Discord API data models). https://discord.js.org/#/docs/discord.js/13.7.0/class/Base';
      CREATE ANNOTATION std::title := 'Base Discord Object';
  };
  CREATE SCALAR TYPE member::BannedStatus EXTENDING enum<Unbanned, TempBanned, PermaBanned>;
  CREATE TYPE member::GuildMember EXTENDING default::Base {
      CREATE MULTI LINK alts -> member::GuildMember;
      CREATE REQUIRED LINK guild -> default::Guild;
      CREATE PROPERTY banned_status -> member::BannedStatus;
  };
  CREATE ALIAS member::Alt := (
      member::GuildMember {
          alt_of := member::GuildMember.<alts[IS member::GuildMember]
      }
  );
  CREATE SCALAR TYPE channel::ChannelType EXTENDING enum<GUILD_TEXT, DM, GUILD_VOICE, GROUP_DM, GUILD_CATEGORY, GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PUBLIC_THREAD, GUILD_PRIVATE_THREAD, GUILD_STAGE_VOICE, GUILD_DIRECTORY, UNKNOWN>;
  CREATE ABSTRACT TYPE default::Created {
      CREATE PROPERTY createdAt -> std::datetime {
          SET readonly := true;
      };
      CREATE PROPERTY createdTimestamp := (std::datetime_get(.createdAt, 'epochseconds'));
      CREATE ANNOTATION std::description := 'Represents a data model that was created by a discord user';
      CREATE ANNOTATION std::title := 'Created Discord Object';
  };
  CREATE ABSTRACT TYPE channel::Channel EXTENDING default::Base, default::Created {
      CREATE PROPERTY channel_type -> channel::ChannelType;
  };
  CREATE ABSTRACT TYPE channel::GuildChannel EXTENDING channel::Channel {
      CREATE REQUIRED LINK guild -> default::Guild;
      CREATE REQUIRED PROPERTY guildId -> std::int64;
      CREATE PROPERTY name -> std::str;
      CREATE PROPERTY parentId -> std::int64;
      CREATE ANNOTATION std::description := 'Represents a guild channel from any of the following: TextChannel, VoiceChannel, CategoryChannel, NewsChannel, StoreChannel, StageChannel. https://discord.js.org/#/docs/discord.js/13.7.0/class/GuildChannel';
      CREATE ANNOTATION std::title := 'Discord Guild Channel';
  };
  CREATE TYPE channel::CategoryChannel EXTENDING channel::GuildChannel;
  ALTER TYPE channel::GuildChannel {
      CREATE LINK parent -> channel::CategoryChannel;
  };
  ALTER TYPE channel::CategoryChannel {
      CREATE MULTI LINK children := (channel::CategoryChannel.<parent[IS channel::GuildChannel]);
  };
  CREATE TYPE channel::Permissions {
      CREATE PROPERTY allPermissions -> std::bigint;
      CREATE PROPERTY bitfield -> std::bigint;
      CREATE PROPERTY defaultPermissions -> std::bigint;
      CREATE PROPERTY flags -> array<std::str>;
      CREATE PROPERTY stageModerator -> std::bigint;
  };
  CREATE SCALAR TYPE channel::OverwriteType EXTENDING enum<role, member>;
  CREATE TYPE channel::PermissionOverwrites {
      CREATE LINK channel -> channel::GuildChannel;
      CREATE LINK allowPermissions -> channel::Permissions;
      CREATE LINK denyPermissions -> channel::Permissions;
      CREATE PROPERTY overwriteType -> channel::OverwriteType;
      CREATE PROPERTY targetId -> std::int64;
  };
  ALTER TYPE channel::GuildChannel {
      CREATE MULTI LINK permissionOverwrites := (channel::GuildChannel.<channel[IS channel::PermissionOverwrites]);
  };
  ALTER TYPE default::Guild {
      DROP EXTENDING channel::TextBasedChannel;
      EXTENDING default::Base,
      default::Created LAST;
  };
  ALTER TYPE default::Guild {
      ALTER LINK members {
          USING (default::Guild.<guild[IS member::GuildMember]);
      };
  };
  DROP TYPE default::GuildMember;
  ALTER TYPE default::DiscordObject RENAME TO channel::TextBasedChannel;
  ALTER TYPE channel::TextBasedChannel {
      CREATE PROPERTY lastPinAt -> std::datetime;
  };
  ALTER TYPE channel::TextBasedChannel {
      CREATE PROPERTY lastPinTimestamp := (std::datetime_get(.lastPinAt, 'epochseconds'));
  };
  ALTER TYPE channel::TextBasedChannel {
      CREATE PROPERTY rateLimitPerPerson -> std::int64;
  };
  ALTER TYPE channel::TextBasedChannel {
      CREATE PROPERTY lastMessageId -> std::int64;
      DROP PROPERTY snowflake;
  };
  CREATE TYPE channel::TextChannel EXTENDING channel::GuildChannel, channel::TextBasedChannel {
      CREATE PROPERTY nsfw -> std::bool;
  };
  CREATE TYPE channel::ThreadChannel EXTENDING channel::Channel, channel::TextBasedChannel {
      CREATE REQUIRED LINK parent -> channel::TextChannel;
      CREATE LINK guild -> default::Guild;
      CREATE MULTI LINK guildMembers -> member::GuildMember;
      CREATE PROPERTY archivedAt -> std::datetime;
      CREATE PROPERTY archiveTimestamp := (std::datetime_get(.archivedAt, 'epochseconds'));
      CREATE PROPERTY archived -> std::bool;
      CREATE PROPERTY autoArchiveDuration -> std::int64;
      CREATE PROPERTY guildId -> std::int64;
      CREATE PROPERTY locked -> std::bool;
      CREATE PROPERTY memberCount -> std::int64;
      CREATE PROPERTY messageCount -> std::int64;
      CREATE PROPERTY name -> std::str;
      CREATE REQUIRED PROPERTY ownerId -> std::int64;
      CREATE REQUIRED PROPERTY parentId -> std::int64;
  };
  ALTER TYPE channel::TextChannel {
      CREATE MULTI LINK threads := (channel::TextChannel.<parent[IS channel::ThreadChannel]);
  };
  CREATE TYPE member::ThreadMember EXTENDING default::Base {
      CREATE LINK thread -> channel::ThreadChannel;
      CREATE LINK guildMember -> member::GuildMember;
      CREATE PROPERTY joinedAt -> std::datetime;
      CREATE PROPERTY joinedTimestamp := (std::datetime_get(.joinedAt, 'epochseconds'));
  };
  ALTER TYPE channel::ThreadChannel {
      CREATE MULTI LINK members := (channel::ThreadChannel.<thread[IS member::ThreadMember]);
  };
  CREATE ABSTRACT TYPE default::Emoji EXTENDING default::Base, default::Created {
      CREATE PROPERTY animated -> std::bool;
      CREATE PROPERTY identifier -> std::str;
      CREATE REQUIRED PROPERTY name -> std::str;
  };
  ALTER TYPE default::Guild DROP EXTENDING channel::TextBasedChannel;
  ALTER TYPE default::Guild {
      CREATE MULTI LINK channels := (default::Guild.<guild[IS channel::GuildChannel]);
  };
  CREATE TYPE default::UserFlags {
      CREATE PROPERTY bitfield -> std::int64;
      CREATE PROPERTY flags -> std::json;
  };
  CREATE TYPE default::User EXTENDING default::Base, default::Created {
      CREATE ANNOTATION std::description := 'Represents a user on Discord. https://discord.js.org/#/docs/discord.js/13.7.0/class/User';
      CREATE ANNOTATION std::title := 'Discord User';
      CREATE LINK flags -> default::UserFlags;
      CREATE PROPERTY accentColor -> std::int64;
      CREATE PROPERTY avatar -> std::str;
      CREATE PROPERTY banner -> std::str;
      CREATE PROPERTY bot -> std::bool;
      CREATE PROPERTY defaultAvatarURL -> std::str;
      CREATE PROPERTY discriminator -> std::str;
      CREATE PROPERTY hexAccentColor -> std::str;
      CREATE PROPERTY tag -> std::str;
      CREATE PROPERTY username -> std::str;
  };
  ALTER TYPE member::ThreadMember {
      CREATE LINK user -> default::User;
  };
};
