import {sqliteTable,text,index,uniqueIndex} from 'drizzle-orm/sqlite-core';
export const restaurants=sqliteTable('restaurants',{id:text('id').primaryKey(),owner:text('owner').notNull(),dedupe:text('dedupe').notNull(),payload:text('payload').notNull(),updatedAt:text('updated_at').notNull()},t=>[index('restaurants_owner_idx').on(t.owner),uniqueIndex('restaurants_owner_dedupe_idx').on(t.owner,t.dedupe)]);
export const activities=sqliteTable('activities',{id:text('id').primaryKey(),owner:text('owner').notNull(),restaurantId:text('restaurant_id').notNull(),kind:text('kind').notNull(),note:text('note').notNull(),createdAt:text('created_at').notNull()},t=>[index('activities_owner_idx').on(t.owner)]);
export const settings=sqliteTable('settings',{owner:text('owner').primaryKey(),payload:text('payload').notNull()});
export const discoveryCache=sqliteTable('discovery_cache',{key:text('key').primaryKey(),payload:text('payload').notNull(),expires:text('expires').notNull()});
