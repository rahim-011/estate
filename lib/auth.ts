import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import { admin, twoFactor } from "better-auth/plugins"
import { betterAuth } from "better-auth";
import { createAccessControl } from "better-auth/plugins/access";
import { Pool } from "pg";

declare global {
  var authPool: Pool | undefined;
}

const pool =
  global.authPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 15000,
    keepAlive: true,
  });

if (process.env.NODE_ENV !== "production") {
  global.authPool = pool;
}

export enum Actions{
  create = 'create',
  delete = 'delete',
  update = 'update'
}

const statement = {
  property: ["create", "update", "delete"],
  user: ["list", "delete", "set-role","update"],
} as const;

const ac = createAccessControl(statement);

const adminRole = ac.newRole({
  property: ["create", "update", "delete"],
  user: ["list", "delete", "set-role"],
});

const userRole = ac.newRole({
  property: ["create","update","delete"],
  user: ["update"]
});

export const auth = betterAuth({
  database: pool,
  plugins:[
    admin({
      ac,
      roles: {
        admin: adminRole,
        user: userRole,
      },
      defaultRole: "user",
    }),
    twoFactor({
      issuer:'Estate',
      requirePassword:false
    })
  ],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders:{
    google:{
      clientId:process.env.GOOGLE_CLIENT_ID!,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    },
  }
});