import clipboard from 'clipboardy'

export async function copyTextToClipboard (text: string): Promise<void> {
  return await clipboard.write(text)
}

export async function getTextFromClipboard (): Promise<string> {
  return await clipboard.read()
}
