import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import YAML from 'yaml'

export async function GET() {
  const file = readFileSync(join(process.cwd(), 'docs', 'swagger.yaml'), 'utf8')
  const swaggerDoc = YAML.parse(file)
  return NextResponse.json(swaggerDoc)
}