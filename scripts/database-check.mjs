import { readFile } from "node:fs/promises"
import process from "node:process"

const schema = await readFile("schema.prisma", "utf8")
if (!/datasource\s+db\s*{[^}]*provider\s*=\s*"postgresql"/s.test(schema)) {
  console.error('schema.prisma must declare provider = "postgresql".')
  process.exit(1)
}

let databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  const envServer = await readFile(".env.server", "utf8").catch(() => "")
  const match = envServer.match(/^DATABASE_URL\s*=\s*["']?([^\s"']+)["']?\s*$/m)
  databaseUrl = match?.[1]
}

if (!databaseUrl || !/^postgres(?:ql)?:\/\//.test(databaseUrl)) {
  console.error("DATABASE_URL must be set to a PostgreSQL connection string in .env.server.")
  process.exit(1)
}

console.log("PostgreSQL configuration is valid.")
