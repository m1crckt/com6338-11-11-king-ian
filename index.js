const getPoemBtn = document.getElementById('get-poem')
const poemEl = document.getElementById('poem')
const poemURL = 'https://poetrydb.org/random,linecount/1;12/author,title,lines.json'

const getJSON = url => fetch(url).then(res => res.json())

const pipe = (...fns) => firstArg => fns.reduce((returnValue, fn) => fn(returnValue), firstArg)

const makeTag = tag => str => `<${tag}>${str}</${tag}>`

const makePoemHTML = (poemJSON) => {
  const { title, author, lines } = poemJSON[0]

  const makeH2 = makeTag('h2')
  const makeH3 = makeTag('h3')
  const makeEm = makeTag('em')
  const makeP = makeTag('p')

  const titleHTML = makeH2(title)
  const authorHTML = makeH3(makeEm(`by ${author}`))

  const stanzas = []
  let current = []

  for (let line of lines) {
    if (line === '') {
      if (current.length > 0) {
        stanzas.push(current)
        current = []
      }
    } else {
      current.push(line)
    }
  }
  if (current.length > 0) stanzas.push(current)

  const formatStanza = pipe(
    stanzaLines => stanzaLines.map((line, i) =>
      i === stanzaLines.length - 1 ? line : `${line}<br>`
    ),
    joined => joined.join(''),
    makeP
  )

  const stanzaHTML = stanzas.map(formatStanza).join('')

  return `${titleHTML}${authorHTML}${stanzaHTML}`
}

getPoemBtn.onclick = async function() {

  poemEl.innerHTML = makePoemHTML(await getJSON(poemURL))
}
