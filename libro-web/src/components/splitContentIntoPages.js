// src/utils/splitContentIntoPages.js
export function splitPrologoIntoPages(content, linesPerPage) {
  const pages = []
  let currentPage = []
  for (const line of content) {
    currentPage.push(line)
    if (currentPage.length >= linesPerPage) {
      pages.push(currentPage)
      currentPage = []
    }
  }
  if (currentPage.length > 0) {
    pages.push(currentPage)
  }
  return pages
}

export function splitRelatoWithPartsIntoPages(parts, linesPerPage, linesForTitle) {
  const pages = []
  let currentPage = []
  let currentLines = 0

  parts.forEach((part, partIndex) => {
    // Add part title as a new section start
    if (part.title) {
      if (currentPage.length > 0 && currentLines + linesForTitle > linesPerPage) {
        pages.push({ content: currentPage, isFirstPageOfSection: false })
        currentPage = []
        currentLines = 0
      }
      currentPage.push(part.title)
      currentLines++
      pages.push({ content: currentPage, sectionTitle: part.title, isFirstPageOfSection: true })
      currentPage = []
      currentLines = 0
    }

    // Add content lines
    part.content.forEach((line) => {
      if (currentLines >= linesPerPage) {
        pages.push({ content: currentPage, isFirstPageOfSection: false })
        currentPage = []
        currentLines = 0
      }
      currentPage.push(line)
      currentLines++
    })
  })

  if (currentPage.length > 0) {
    pages.push({ content: currentPage, isFirstPageOfSection: false })
  }
  return pages
}
