const { nanoid } = require('nanoid');
const books = require('./books');

const postNewBook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(15);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!newBook.name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooks = (request) => {
  const { name = null, reading = null, finished = null } = request.query;

  let filteredBooks = [...books];
  if (name !== null) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase()
      .includes(name.toLowerCase()));
  }
  if (reading !== null) {
    if (reading === '1') {
      filteredBooks = filteredBooks.filter((book) => book.reading === true);
    }
    if (reading === '0') {
      filteredBooks = filteredBooks.filter((book) => book.reading === false);
    }
  }
  if (finished !== null) {
    if (finished === '1') {
      filteredBooks = filteredBooks.filter((book) => book.finished === true);
    }
    if (finished === '0') {
      filteredBooks = filteredBooks.filter((book) => book.finished === false);
    }
  }

  const viewBook = [];
  filteredBooks.forEach((book) => {
    viewBook.push({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    });
  });

  const response = {
    status: 'success',
    data: {
      books: viewBook,
    },
  };

  return response;
};

const getBookById = (request, h) => {
  const { bookId } = request.params;
  const matchBook = books.filter((book) => book.id === bookId)[0];

  if (!matchBook) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book: matchBook,
    },
  });
  response.code(200);
  return response;
};

const editBookById = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookById = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  postNewBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
