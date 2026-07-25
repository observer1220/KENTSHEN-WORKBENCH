// Tiny markdown: **bold** and [text](url) only. Returns an array of
// strings/React nodes instead of raw HTML, so no dangerouslySetInnerHTML
// is needed anywhere in the app.
export function renderMdLite(str) {
  if (!str) return null;
  const nodes = [];
  const regex = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(str.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      nodes.push(<strong key={key++}>{match[1]}</strong>);
    } else {
      nodes.push(
        <a key={key++} href={match[3]} target="_blank" rel="noopener noreferrer">
          {match[2]}
        </a>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < str.length) {
    nodes.push(str.slice(lastIndex));
  }
  return nodes;
}
