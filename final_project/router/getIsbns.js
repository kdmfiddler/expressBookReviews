async function getIsbns(title, author) {
  const query = `intitle:"${encodeURIComponent(title)}" inauthor:"${encodeURIComponent(author)}"`;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    const isbns = data.items
      ?.map(item => item.volumeInfo?.industryIdentifiers)
      ?.flat()
      ?.filter(id => (id?.type === 'ISBN_13' || id?.type === 'ISBN_10') && id?.identifier)
      ?.map(id => id.identifier)
      ?.filter((id, index, arr) => arr.indexOf(id) === index) || [];
    
    return isbns;
  } catch (error) {
    console.error('ISBN unavailable for ' + title, error);
    return [];
  }
}
module.exports = getIsbns;
