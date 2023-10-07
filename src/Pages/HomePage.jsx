import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col, Table, Form, Button, Spinner, Modal } from 'react-bootstrap';
import { apiEnd } from '../../AppConstants';

const HomePage = () => {
    const [inputSearchValue, setInputSearchValue] = useState('');
    const [books, setBooks] = useState([]);
    const [bookTitle, setBookTitle] = useState('')
    const [publicationYear, setPublicationYear] = useState(2000)
    const [author, setAuthor] = useState('')
    const [isbn, setIsbn] = useState('')
    const [image, setImage] = useState('')
    const [currentlySelectedBookToEdit, setCurrentlySelectedBookToEdit] = useState('')
    const [description, setDescription] = useState('')
    const [showAddModal, setShowAddModal] = useState(false);
    const handleCloseModal = () => {
        setShowAddModal(false);
    };
    useEffect(() => {
        getBooks()
    }, [])
    const getBooks = async () => {
        try {
            if (inputSearchValue.trim() == "") {
                // If user has not type anything then he wants to get all books 
                axios.get(`${apiEnd}/appApis/books/getAllBooks`, {}).then((response) => {
                    if ([200].includes(response.data.code)) {
                        // nothing to do
                        let books = []
                        let booksReturned = []
                        if (response?.data?.data?.books.length > 0) {
                            booksReturned = response?.data?.data?.books
                        }
                        while (booksReturned.length > 0) {
                            let temp = booksReturned.pop()
                            books.push(temp)
                        }
                        setBooks(books)
                        console.log(books, 233)
                    } else {
                        alert(response.data.message);
                        return
                    }
                }).catch((error) => {
                    alert(error.response.data.message);
                    return

                })
            } else {
                // If user has type something then he should want to search for something
                axios.get(`${apiEnd}/appApis/books/searchBooks?query=${inputSearchValue}`, {}).then((response) => {
                    if ([200].includes(response.data.code)) {
                        // nothing to do
                        let books = []
                        let booksReturned = []
                        if (response?.data?.data?.books.length > 0) {
                            booksReturned = response?.data?.data?.books
                        }
                        while (booksReturned.length > 0) {
                            let temp = booksReturned.pop()
                            let temp2=temp._source
                            temp2._id = temp._id
                            books.push(temp2)
                        }
                        setBooks(books)
                        console.log(books, 233)
                    } else {
                        alert(response.data.message);
                        return
                    }
                }).catch((error) => {
                    alert(error.response.data.message);
                    return

                })
            }
        } catch (error) {
            console.log(error)
            alert(`Unable to call server`)
            return
        }
    }
    const getSpecificBook = async (bookId) => {
        try {
            // Fetching data related to given book
                axios.get(`${apiEnd}/appApis/books/getSpecificBook/${bookId}`, {}).then((response) => {
                    if ([200].includes(response.data.code)) {
                        setAuthor(response.data.data.book.author)
                        setPublicationYear(response.data.data.book.publicationYear)
                        setBookTitle(response.data.data.book.title)
                        setDescription(response.data.data.book.description)
                        setImage(response.data.data.book.image) 
                        setIsbn(response.data.data.book.isbn)  
                    } else {
                        alert(response.data.message);
                        return
                    }
                }).catch((error) => {
                    alert(error.response.data.message);
                    return

                })
        } catch (error) {
            console.log(error)
            alert(`Unable to call server`)
            return
        }
    }
    const deleteBook = async (bookId) => {
        try {


            if (bookId == null || bookId == undefined || bookId.trim() == "") {
                alert('Pleas provide valid book id')
                return
            }
            window.confirm("Are you sure you want to delete this book? ") ?
                axios.delete(`${apiEnd}/appApis/books/deleteBook/${bookId}`, {}).then((response) => {
                    if ([200].includes(response.data.code)) {
                        // nothing to do
                        getBooks()
                    } else {
                        alert(response.data.message);
                        return
                    }
                }).catch((error) => {
                    alert(error.response.data.message);
                    return
                })
                : {}
        } catch (error) {
            console.log(error)
            alert(`Unable to call server`)
            return
        }
    }
    const saveBook = async () => {
        try {
            console.log({
                isbn, bookTitle, author, description, publicationYear
            })
            // Validating all fields
            if (isbn.trim() == "" || isbn == null || isbn == undefined) {
                alert(`Please enter isbn`)
                return
            }
            if (bookTitle.trim() == "" || bookTitle == null || bookTitle == undefined) {
                alert(`Please enter book title`)
                return
            }
            if (author.trim() == "" || author == null || author == undefined) {
                alert(`Please enter author`)
                return
            }
            if (description.trim() == "" || description == null || description == undefined) {
                alert(`Please enter description`)
                return
            }
            if (`${publicationYear}`.trim() == "" || publicationYear == null || publicationYear == undefined || `${publicationYear}`.length != 4) {
                alert(`Please enter valid publication year (remember valid year must be of 4 characters)`)
                return
            }
            if (currentlySelectedBookToEdit != "") {
                // updating the old book
                axios.put(`${apiEnd}/appApis/books/updateBook`, {
                    title: bookTitle,
                    author: author,
                    isbn: isbn,
                    description: description,
                    "publicationYear": publicationYear,
                    "image": image,
                    bookId:currentlySelectedBookToEdit
                }, {}).then((response) => {
                    if ([200].includes(response.data.code)) {
                        // nothing to do
                        setShowAddModal(false)
                        getBooks()
                    } else {
                        alert(response.data.message);
                    }
                }).catch((error) => {
                    alert(error.response.data.message);
                })

            } else {

                // new book creation
                axios.post(`${apiEnd}/appApis/books/createBook`, {
                    title: bookTitle,
                    author: author,
                    isbn: isbn,
                    description: description,
                    "publicationYear": publicationYear,
                    "image": image
                }, {}).then((response) => {
                    if ([200].includes(response.data.code)) {
                        // nothing to do
                        setShowAddModal(false)
                        getBooks()
                    } else {
                        alert(response.data.message);
                    }
                }).catch((error) => {
                    alert(error.response.data.message);
                })
            }

        } catch (error) {
            console.log(error)
            alert(`Unable to call server`)
        }
    }
    return (

        <Container style={{ width: "100%" }} >

            {/* <Row >
                <center><h5 style={{ textAlign: "center" }}>Home</h5></center>
            </Row> */}
            <Modal show={showAddModal} onHide={handleCloseModal}>
                <Modal.Body>
                    <Form.Group controlId='bookTitle'>
                        <Form.Label>Book Title:</Form.Label>
                        <Form.Control
                            type='text'
                            value={bookTitle}
                            onChange={(e) => {
                                setBookTitle(e.target.value)
                            }
                            }
                        />
                    </Form.Group>
                    <Form.Group controlId='isbn'>
                        <Form.Label>Book ISBN:</Form.Label>
                        <Form.Control
                            type='text'
                            value={isbn}
                            onChange={(e) => {
                                setIsbn(e.target.value)
                            }
                            }
                        />
                    </Form.Group>
                    <Form.Group controlId='author'>
                        <Form.Label>Author:</Form.Label>
                        <Form.Control
                            type='text'
                            value={author}
                            onChange={(e) => {
                                setAuthor(e.target.value)
                            }
                            }
                        />
                    </Form.Group>
                    <Form.Group controlId='description'>
                        <Form.Label>Book Desciption:</Form.Label>
                        <Form.Control
                            type='text'
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                            }
                            }
                        />
                    </Form.Group>
                    <Form.Group controlId='publicationYear'>
                        <Form.Label>Book Publication Year:</Form.Label>
                        <Form.Control
                            type='number'
                            value={publicationYear}
                            onChange={(e) => {
                                setPublicationYear(e.target.value)
                            }
                            }
                        />
                    </Form.Group>
                    <Form.Group controlId='image'>
                        <Form.Label>Book Image Url:</Form.Label>
                        <Form.Control
                            type='text'
                            value={image}
                            onChange={(e) => {
                                setImage(e.target.value)
                            }
                            }
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => { saveBook() }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <Row className='mx-3 flex display-flex' style={{ marginTop: "4rem", marginBottom: "4rem" }}>
                <Col >
                    <Form>
                        <Form.Group>
                            {/* <Form.Label><b>Search book:</b></Form.Label> */}
                            <Form.Control
                                type="text"
                                placeholder='Search any book by its title, author or description'
                                value={inputSearchValue}
                                onChange={(e) => {
                                    setInputSearchValue(e.target.value)
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()

                                        setInputSearchValue(e.target.value)
                                        getBooks()
                                    }
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Col>

                <Col >
                    <Button
                        variant='warning'
                        onClick={() => { getBooks() }}
                    >
                        Search Books
                    </Button>
                </Col>

                <Col >
                    <Button
                        variant='info'
                        onClick={() => { setShowAddModal(true), setCurrentlySelectedBookToEdit('') }}
                    >
                        Add New Book
                    </Button>
                </Col>
            </Row>

            <br />
            <Row style={{ textAlign: "center" }}>
                {
                    books.map((book, index) => (
                        <Col className='col-sm-6'>
                            <Card key={index} style={{ width: "30rem", marginLeft: "auto", marginRight: "auto", boxShadow: "10px 10px lightblue", marginTop: "2rem", marginBottom: "2rem", paddingTop: "1rem", paddingBottom: "1rem", paddingLeft: "1rem", paddingRight: "1.5rem" }}>

                                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "2rem" }}>{book.title}</p>
                                <p style={{ "textAlign": "right", paddingRight: "3rem" }}>BY: {book.author}</p>
                                <img src={book.image} style={{ height: "auto", maxWidth: "100%" }}></img>
                                <p><span style={{ fontWeight: "bolder" }}>Description:</span><br></br> {book.description}</p>
                                <p style={{ "textAlign": "right", paddingRight: "1rem" }}><span style={{ fontWeight: "bolder" }}>Published Year: </span>{book.publicationYear}</p>
                                <p style={{ "textAlign": "right", paddingRight: "1rem" }}><span style={{ fontWeight: "bolder" }}>ISBN:</span> {book.isbn}</p>
                                <p><Button variant="danger" onClick={() => {
                                    deleteBook(book._id)
                                }}>Delete</Button> &nbsp;&nbsp; <Button onClick={(e) => {
                                    e.preventDefault()
                                    setCurrentlySelectedBookToEdit(book._id)
                                    setShowAddModal(true)
                                    getSpecificBook(book._id)
                                }}>Edit</Button></p>
                            </Card>
                        </Col>
                    ))
                }
            </Row>


        </Container >
    );
}
export default HomePage; 