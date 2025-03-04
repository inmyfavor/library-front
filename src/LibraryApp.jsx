import React, { useState, useEffect } from "react";
import { getBooks, addBook, updateBook, deleteBook, handleLogout } from "./api/booksApi";

function LibraryApp() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    publisher: "",
    issueDate: "",
    studentName: "",
    returnDate: ""
  });
  const [editingBook, setEditingBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [histogramData, setHistogramData] = useState({});

  useEffect(() => {
    getBooks().then((data) => {
      if (data.error)
        window.location = '/login'
      setBooks(data);
      generateHistogram(data); 
    });
  }, []);

  const generateHistogram = (books) => { 
    const counts = books.reduce((acc, book) => {
      if (book.issueDate) {
        acc[book.issueDate] = (acc[book.issueDate] || 0) + 1;
      }
     return acc;
    }, {});
    setHistogramData(counts);
  };
    
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };
    
  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleAddBook = async () => {
    const added = await addBook(newBook);
    setBooks([...books, added]);
    generateHistogram([...books, added]);
    setNewBook({ title: "", author: "", publisher: "", issueDate: "", studentName: "", returnDate: "" });
  };

  const handleDeleteBook = async (id) => {
    await deleteBook(id);
    const updatedBooks = books.filter((book) => book.id !== id);
    setBooks(updatedBooks);
    generateHistogram(updatedBooks);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
  };

  const handleUpdateBook = async () => {
    const updated = await updateBook(editingBook.id, editingBook);
    const updatedBooks = books.map((book) => (book.id === updated.id ? updated : book));
    setBooks(updatedBooks);
    generateHistogram(updatedBooks);
    setEditingBook(null);
  };

   const filteredBooks = books
    .filter((book) =>
      Object.values(book)
        .filter(value => typeof value === "string")
        .some((value) => value.toLowerCase().includes(searchQuery))
    )
    .sort((a, b) => {
        if (!a.issueDate && !b.issueDate) return 0;
        if (!a.issueDate) return 1;
        if (!b.issueDate) return -1;
        return sortOrder === "asc" ? a.issueDate.localeCompare(b.issueDate) : b.issueDate.localeCompare(a.issueDate);
    });

  return (
    <div className="p-[16px]">

      <div className="flex justify-between pr-[20px]">
        <h1 className="text-xl font-bold">Библиотека</h1>
        <button className="text-blue-800 text-[16px]" onClick={handleLogout}>Выход</button>

      </div>

      <div className="flex gap-[8px] mt-[16px]">
        <input 
          type="text" 
          placeholder="Название книги" 
          value={newBook.title} 
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} 
          className="add_input" 
        />
        <input 
          type="text" 
          placeholder="Автор" 
          value={newBook.author} 
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} 
          className="add_input" 
        />
        <input 
          type="text" 
          placeholder="Издательство" 
          value={newBook.publisher} 
          onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })} 
          className="add_input" 
        />
        <input 
          type="date" 
          value={newBook.issueDate} 
          onChange={(e) => setNewBook({ ...newBook, issueDate: e.target.value })} 
          className="add_input" 
        />
        <input 
          type="text" 
          placeholder="ФИО студента" 
          value={newBook.studentName} 
          onChange={(e) => setNewBook({ ...newBook, studentName: e.target.value })} 
          className="add_input" 
        />
        <input 
          type="date" 
          value={newBook.returnDate} 
          onChange={(e) => setNewBook({ ...newBook, returnDate: e.target.value })} 
          className="add_input" 
        />
        <button onClick={handleAddBook} className="bg-blue-800 text-white px-[24px]">Добавить</button>
      </div>

      <input
        type="text"
        placeholder="Поиск..."
        onChange={handleSearch}
        className="add_input mt-[16px]"
      />

      <table className="mt-[16px]">
        <thead>
          <tr className="bg-gray-200">
            <th className="table_header">Название</th>
            <th className="table_header">Автор</th>
            <th className="table_header">Издательство</th>
            <th className="table_header">
              Дата выдачи
              <button onClick={handleSort} className="ml-[8px] bg-gray-300 px-[4px] rounded-[4px]">
                {sortOrder === "asc" ? "▲" : "▼"}
              </button>
            </th>
            <th className="table_header">ФИО студента</th>
            <th className="table_header">Дата возврата</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              {editingBook && editingBook.id === book.id ? (
                <>
                  <td className="td_cell">
                    <input 
                      type="text" 
                      value={editingBook.title} 
                      onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })} 
                      className="table-input" />
                  </td>
                  <td className="td_cell">
                    <input 
                      type="text" 
                      value={editingBook.author} 
                      onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })} 
                      className="table-input" />
                  </td>
                  <td className="td_cell">
                    <input 
                      type="text" 
                      value={editingBook.publisher} 
                      onChange={(e) => setEditingBook({ ...editingBook, publisher: e.target.value })} 
                      className="table-input" />
                  </td>
                  <td className="td_cell">
                    <input 
                      type="date" 
                      value={editingBook.issueDate} 
                      onChange={(e) => setEditingBook({ ...editingBook, issueDate: e.target.value })} 
                      className="table-input" />
                  </td>
                  <td className="td_cell">
                    <input 
                      type="text" 
                      value={editingBook.studentName} 
                      onChange={(e) => setEditingBook({ ...editingBook, studentName: e.target.value })} 
                      className="table-input" />
                  </td>
                  <td className="td_cell">
                    <input 
                      type="date" 
                      value={editingBook.returnDate} 
                      onChange={(e) => setEditingBook({ ...editingBook, returnDate: e.target.value })} 
                      className="table-input" />
                  </td>
                  <td className="p-[8px]">
                    <button onClick={handleUpdateBook} className="text-green-500">Сохранить</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="td_cell">{book.title}</td>
                  <td className="td_cell">{book.author}</td>
                  <td className="td_cell">{book.publisher}</td>
                  <td className="td_cell">{book.issueDate || "Не выдана"}</td>
                  <td className="td_cell">{book.studentName || "Нет студента"}</td>
                  <td className="td_cell">{book.returnDate || "Не возвращена"}</td>
                  <td className="flex p-[8px] gap-2">
                    <button onClick={() => handleEditBook(book)} className="text-blue-800">Редактировать</button>
                    <button onClick={() => handleDeleteBook(book.id)} className="text-red-600">Удалить</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4">Всего книг: {filteredBooks.length}</p>

      <div className="mt-[16px]">
        <h2 className="text-lg font-bold">Гистограмма выдачи книг</h2>
        <div className="flex gap-[8px] items-end mt-2 bg-gray-100 p-2 min-h-[200px] min-w-[400px] w-fit">
          {Object.entries(histogramData).map(([date, count]) => (
            <div key={date} className="flex flex-col items-center">
              <span className="text-[12px]">{count}</span>
              <div className="bg-blue-800 text-white text-center" style={{ height: `${count * 20}px`, width: "40px" }} />
              <span className="text-[10px] mt-[8px]">{date}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default LibraryApp;