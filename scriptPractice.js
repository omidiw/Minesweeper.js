const friends = [
  { name: "Anna", books: ["Bible", "Harry Potter"] },
  { name: "Bob", books: ["War and peace", "Romeo and Juliet"] },
  { name: "Alice", books: ["The Lord of the Rings", "The Shining"] },
]
const allBooks = friends.reduce((acc, cur) => [...acc, ...cur.books], [])
console.log(allBooks)
const allBooksFlatMap = friends.flatMap(person => person.books)
console.log(allBooksFlatMap)
