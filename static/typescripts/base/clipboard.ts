async function copyToClipboard(
  navigator: Navigator,
  text: string
): Promise<void> {
  //@ts-ignore
  return navigator.clipboard.writeText(text)
}

async function readFromClipboard(navigator: Navigator): Promise<string> {
  //@ts-ignore
  return navigator.clipboard.readText()
}

async function pasteIntoHtml(element: HTMLElement): Promise<void> {
  element.innerHTML += await readFromClipboard(navigator)
}

export { copyToClipboard, readFromClipboard, pasteIntoHtml }
