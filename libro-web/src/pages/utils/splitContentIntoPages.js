// export function splitContentIntoPages(content, maxParagraphsPerPage = 5) {
//   const pages = []
//   let currentPage = []

//   for (const paragraph of content) {
//     currentPage.push(paragraph)
//     if (currentPage.length >= maxParagraphsPerPage) {
//       pages.push(currentPage)
//       currentPage = []
//     }
//   }

//   if (currentPage.length > 0) {
//     pages.push(currentPage)
//   }

//   return pages
// }

// // Nueva función específica para el prólogo con paginación especial
// export function splitPrologoIntoPages(content, maxParagraphsPerPage = 15) {
//   const pages = []
//   let currentPage = []
//   let isFirstPage = true

//   for (const paragraph of content) {
//     currentPage.push(paragraph)

//     // La primera página tiene menos párrafos debido al título
//     const maxForThisPage = isFirstPage ? 10 : maxParagraphsPerPage

//     if (currentPage.length >= maxForThisPage) {
//       pages.push(currentPage)
//       currentPage = []
//       isFirstPage = false
//     }
//   }

//   if (currentPage.length > 0) {
//     pages.push(currentPage)
//   }

//   return pages
// }

// // Nueva función específica para relatos con paginación especial
// export function splitRelatoIntoPages(content, maxParagraphsPerPage = 9) {
//   const pages = []
//   let currentPage = []
//   let isFirstPage = true

//   for (const paragraph of content) {
//     currentPage.push(paragraph)

//     // La primera página tiene menos párrafos debido al título
//     const maxForThisPage = isFirstPage ? 8 : maxParagraphsPerPage

//     if (currentPage.length >= maxForThisPage) {
//       pages.push(currentPage)
//       currentPage = []
//       isFirstPage = false
//     }
//   }

//   if (currentPage.length > 0) {
//     pages.push(currentPage)
//   }

//   return pages
// }
export function splitContentIntoPages(content, maxParagraphsPerPage = 5) {
  const pages = []
  let currentPage = []

  for (const paragraph of content) {
    currentPage.push(paragraph)
    if (currentPage.length >= maxParagraphsPerPage) {
      pages.push(currentPage)
      currentPage = []
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage)
  }

  return pages
}

export function splitPrologoIntoPages(content, maxParagraphsPerPage = 15) {
  const pages = []
  let currentPage = []
  let isFirstPage = true

  for (const paragraph of content) {
    currentPage.push(paragraph)
    const maxForThisPage = isFirstPage ? 10 : maxParagraphsPerPage

    if (currentPage.length >= maxForThisPage) {
      pages.push(currentPage)
      currentPage = []
      isFirstPage = false
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage)
  }

  return pages
}

export function splitRelatoIntoPages(content, maxParagraphsPerPage = 9) {
  const pages = []
  let currentPage = []
  let isFirstPage = true

  for (const paragraph of content) {
    currentPage.push(paragraph)
    const maxForThisPage = isFirstPage ? 8 : maxParagraphsPerPage

    if (currentPage.length >= maxForThisPage) {
      pages.push(currentPage)
      currentPage = []
      isFirstPage = false
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage)
  }

  return pages
}

// Función para manejar múltiples parts (cada part con su título)
// Esta función genera un array plano de páginas, cada una con info de sección
export function splitRelatoWithPartsIntoPages(parts, maxParagraphsPerPage = 9) {
  const allPages = []

  for (const part of parts) {
    const { title, content } = part
    let currentPage = []
    let isFirstPageOfSection = true

    for (const paragraph of content) {
      currentPage.push(paragraph)
      const maxForThisPage = isFirstPageOfSection ? 8 : maxParagraphsPerPage

      if (currentPage.length >= maxForThisPage) {
        allPages.push({
          content: currentPage,
          sectionTitle: isFirstPageOfSection ? title : null,
          isFirstPageOfSection: isFirstPageOfSection,
        })
        currentPage = []
        isFirstPageOfSection = false
      }
    }

    if (currentPage.length > 0) {
      allPages.push({
        content: currentPage,
        sectionTitle: isFirstPageOfSection ? title : null,
        isFirstPageOfSection: isFirstPageOfSection,
      })
    }
  }

  return allPages
}
