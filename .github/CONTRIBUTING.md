# Contributing Guide

Please follow these guides to use some of the tooling that Ember is built upon. Much of the software mentioned here will depend upon development dependencies defined in `package.json`.

It is important to read the linked articles as they have information on the installation and configuration of the tooling, should that be an issue.

---

## Extending The Database Through Prisma → Nexus → Apollo Client

The goal of using these technologies is to provide explicit type security through the model, database schema, and database client. We leverage code generation as much as possible, integrating with VSCode plugins and TypeScript.

### Important

While working on the database, a ts-node environment should be running to continuously generate Nexus typings. Without the environment, and even frequently *with* the environment you might run into type errors. Usually this is as simple as restarting VSCode. If you are working on the database and would like the most lightweight way to run Nexus you can run `npm run nexusdev` in a terminal that is not attached to VSCode. This will log and persist through VSCode being opened and closed.

### Prisma

[Main Article: Prisma Getting Started](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch-typescript-postgres)

[Also See: Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

[Also See: Working with JSON fields in Prisma](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-json)

1. Add a model, or update an old model with new fields. For example, we might add a [GuildMember](https://discord.js.org/#/docs/main/stable/class/GuildMember). Entries should go in `prisma/schema.prisma`.

    ```text
    model Member {
      id             String   @default(cuid())
      snowflake      String
      guildSnowflake String
      member         Json
      Guild          Guild    @relation(fields: [guildSnowflake], references: [id])
      admin          Boolean?
      mod            Boolean?
      owner          Boolean?
      dj             Boolean?

      @@id([id, snowflake])
    }
    ```

2. Run `npx prisma generate` which will generate files to `node_modules/@prisma/client`. Do not touch these files. You must run generate after each change to `prisma/schema.prisma`.

3. Run `npx prisma migrate dev --name staging --preview-feature` or `npm run stage` to generate a migration file in `prisma/migrations`. This file will contain SQL migrations for the database that may be edited.

4. Run `npx prisma migrate deploy --preview-feature` or `npm run dbdeploy` to deploy the migrations to the table.

    *To automatically edit the migration file in (3) you can instead run `npm run stagedit`.*

    *To automate (3,4) you may instead run `npm run migrate`.*

    *To automate (2,3,4) you may instead run `npm run prismachain`.*

When creating the `schema.prisma`:

* When creating Many-Many relations you may need to create an id with random generation alongside the discord snowflake. Best practice with `discord.js` objects is to make a composite id of the relevant snowflakes. Note the `@@id` in the example.
* Prefer to use `cuid()` over other generators such as `uuid()`.
* Except for identifying properties such as the snowflake, treat the Prisma schema as an extension on the TypeScript type. Store the entire object as a JSON so that when it is recovered it can be manipulated according to the relevant API.

### Nexus

[Main Article: Nexus Prisma Plugin](https://nexusjs.org/docs/plugins/prisma/overview)

[Also See: Nexus Prisma API](https://nexusjs.org/docs/plugins/prisma/api)

[Also See: Prisma CRUD](https://www.prisma.io/docs/concepts/components/prisma-client/crud)

1. In `src/util/api/schema/types` add a new typescript file with the same name as the model. In this case, `member.ts`. In this file, define the aspects you would like to expose. In general, you should try and expose as few properties as possible. For example, assume that all we are doing is defining a listener for Sticky Roles. In that case, all we need to expose is the member's snowflake, the guild's snowflake, and our stored JSON cache of the member.

    ```ts
    import { objectType } from "nexus";

    const Member = objectType({
      name: "Member",
      definition(t) {
        t.model.snowflake();
        t.model.guildSnowflake();
        t.model.member();
      },
    });

    export default Member;
    ```

2. In `src/util/api/schema/types/query.ts` expose the new type for querying, with relevant options. The easiest way to do so is to use the CRUD API.

    ```ts
    t.crud.member();
    t.crud.members();
    ```

3. In `src/util/api/schema/types/mutation.ts` expose the new type for mutation, with relevant options. The easiest way to do so is to use the CRUD API.

    ```ts
    t.crud.createOneMember();
    t.crud.deleteOneMember();
    t.crud.updateOneMember();
    t.crud.upsertOneMember();
    ```

4. In `src/util/api/schema/types/index.ts` export the new type.

    ```ts
    export * as Member from "./member";
    ```

5. If you are not running in a `ts-node-dev` environment through `npm run dev` or `npm run nexusdev` you can generate the relevant files by running `npm run nexusgen`

### Apollo Client

1. In `src/util/api/graphql-client.ts` define the GraphQL operation you wish to use elsewhere in the bot.

    ```ts
    CREATE_OR_UPDATE_GUILDMEMBER: gql`
      mutation UpsertGuildMember(
        $snowflake: String!
        $guildSnowflake: String!
        $member: Json!
      ) {
        upsertOneGuildMember(
          where: {
            snowflake_guildSnowflake: {
              snowflake: $snowflake
              guildSnowflake: $guildSnowflake
            }
          }
          create: {
            snowflake: $snowflake
            member: $member
            Guild: {
              connectOrCreate: {
                where: { snowflake: $guildSnowflake }
                create: { snowflake: $guildSnowflake }
              }
            }
          }
          update: { member: { set: $member } }
        ) {
          member
        }
      }
    `,

    READ_GUILDMEMBER: gql`
      query CacheMember($snowflake: String!, $guildSnowflake: String!) {
        member(
          where: {
            snowflake_guildSnowflake: {
              snowflake: $snowflake
              guildSnowflake: $guildSnowflake
            }
          }
        ) {
          member
        }
      }
    `,
    ```

When creating new GraphQL constants in `src/util/api/graphql-client.ts`:

* Utilize Create, Read, Update, Delete as a naming convention for TypeScript properties. For example, reading a `GuildMember` is `READ_GUILDMEMBER`.
