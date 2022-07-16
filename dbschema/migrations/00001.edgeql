CREATE MIGRATION m1gr35ndeiyeyffi2uhnvnl452hxbdlv4b67cz7qhxfrixddbnmlpa
    ONTO initial
{
  CREATE TYPE default::Guild {
      CREATE REQUIRED PROPERTY snowflake -> std::int64;
  };
  CREATE TYPE default::GuildMember {
      CREATE LINK guild -> default::Guild;
      CREATE REQUIRED PROPERTY snowflake -> std::int64;
  };
  ALTER TYPE default::Guild {
      CREATE MULTI LINK members -> default::GuildMember;
  };
};
