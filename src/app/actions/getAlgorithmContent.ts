'use server'

import fs from 'fs'
import path from 'path'

export async function getAlgorithmContent(key: string) {
  try {
    const filePath = path.join(process.cwd(), 'docs', 'algorithms', `${key}.md`)
    const content = await fs.promises.readFile(filePath, 'utf-8')
    return content
  } catch (error) {
    console.error(`Failed to read markdown for algorithm ${key}:`, error)
    return '暂未提供该算法的详细说明。'
  }
}
