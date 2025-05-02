
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Badge,
  Spinner,
  Table
} from 'react-bootstrap';

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [form, setForm] = useState({ url: '', notes: '', tags: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/bookmarks')
      .then(res => setBookmarks(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = form.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    const payload = { ...form, tags: tagsArray };
    const res = await axios.post('http://localhost:5000/api/bookmarks', payload);
    setBookmarks([res.data, ...bookmarks]);
    setForm({ url: '', notes: '', tags: '' });
  };

  const filteredBookmarks = bookmarks.filter(b =>
    b.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">📑 Bookmark Manager</h1>

      {/* Bookmark Form */}
      <Card className="mb-5 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit} className="d-flex flex-wrap align-items-end gap-2">
            <Form.Group controlId="formUrl" className="flex-grow-1">
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="url"
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://example.com"
                required
              />
            </Form.Group>
            <Form.Group controlId="formTags" className="flex-shrink-1">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="e.g. work, react"
              />
            </Form.Group>
            <Form.Group controlId="formNotes" className="w-100">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any thoughts or description…"
              />
            </Form.Group>
            <div>
              <Button variant="primary" type="submit" className="me-2 mb-2">
                Save Bookmark
              </Button>
              <Button
                as="a"
                href="http://localhost:5000/api/bookmarks/csv"
                variant="success"
                className="mb-2"
              >
                Download CSV
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Search Bar */}
      <Form.Control
        type="text"
        placeholder="Search bookmarks..."
        className="mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Bookmarks Table */}
      <h3 className="mb-3">All Bookmarks</h3>
      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <div className="border border-2 border-primary rounded">
          <Table
            striped
            bordered
            hover
            responsive
            className="mb-0 border border-dark"
          >
            <thead className="table-light">
              <tr>
                <th className="border">URL</th>
                <th className="border">Date Added</th>
                <th className="border">Notes</th>
                <th className="border">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookmarks.map(b => (
                <tr key={b._id}>
                  <td className="border">
                    <a href={b.url} target="_blank" rel="noreferrer">
                      {b.url.replace(/^https?:\/\//, '')}
                    </a>
                  </td>
                  <td className="border">{new Date(b.date).toLocaleString()}</td>
                  <td className="border">{b.notes}</td>
                  <td className="border">
                    {b.tags.map((tag, i) => (
                      <Badge bg="secondary" className="me-1" key={i}>
                        {tag}
                      </Badge>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
}

export default App;
