CREATE MIGRATION m1lwjxxafs4wr2cyaszhgzx37z4pzwecbu3xjg35b7jzs7tgrmlysa
    ONTO m1gr35ndeiyeyffi2uhnvnl452hxbdlv4b67cz7qhxfrixddbnmlpa
{
  CREATE ABSTRACT TYPE default::DiscordObject {
      CREATE REQUIRED PROPERTY snowflake -> std::int64;
  };
  ALTER TYPE default::Guild EXTENDING default::DiscordObject LAST;
  ALTER TYPE default::GuildMember EXTENDING default::DiscordObject LAST;
  ALTER TYPE default::Guild {
      ALTER PROPERTY snowflake {
          RESET OPTIONALITY;
          DROP OWNED;
          RESET TYPE;
      };
  };
  ALTER TYPE default::GuildMember {
      ALTER PROPERTY snowflake {
          RESET OPTIONALITY;
          DROP OWNED;
          RESET TYPE;
      };
  };
  ALTER TYPE default::Guild {
      ALTER LINK members {
          USING (default::Guild.<guild[IS default::GuildMember]);
      };
  };
};
