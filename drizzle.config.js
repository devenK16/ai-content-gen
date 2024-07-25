/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.tsx",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://ai_cg_owner:RT1SZYv5xfOt@ep-shrill-wildflower-a1cqayq6.ap-southeast-1.aws.neon.tech/ai_cg?sslmode=require',
    }
  };