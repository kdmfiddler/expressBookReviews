async function findIsbn(title, author, isbn) {
  const query = `intitle:"${encodeURIComponent(title)}" inauthor:"${encodeURIComponent(author)}"`;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    const isbnList = data.items
      ?.map(item => item.volumeInfo?.industryIdentifiers)
      ?.flat()
      ?.filter(id => (id?.type === 'ISBN_13' || id?.type === 'ISBN_10') && id?.identifier)
      ?.map(id => id.identifier)
      ?.filter((id, index, arr) => arr.indexOf(id) === index) || [];

    if (isbnList.includes(isbn)) {
      return true;
    }

    else {
      return false;
    }

    
  } catch (error) {
    console.error('Program misbehavior' + title, error);
    return false;
  }
}
module.exports = findIsbn;
