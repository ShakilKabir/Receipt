import React, { useEffect, useState } from "react";
import { Button, Box, Modal, Typography, Card, CardContent, CardActions, IconButton, Pagination } from "@mui/material";
import { Preview, Delete, Download } from "@mui/icons-material";
import axios from '../utils/axiosConfig'

const HistoryPage = () => {
  const [receipts, setReceipts] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const limit = 100;
  
  useEffect(() => {
    // Check the token in the component
    const token = localStorage.getItem('token');
    console.log('Token in HistoryPage:', token);

    fetchReceipts();
  }, [page]);

  const fetchReceipts = async () => {
    try {
        const response = await axios.get('/api/receipts', {
            params: { page, limit }
        });
        console.log('Fetched receipts:', response.data.files); // Ensure this logs the correct files
        setReceipts(response.data.files);
    } catch (error) {
        console.error('Could not fetch receipts', error);
    }
};

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(`/api/receipts/download/${filename}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Could not download receipt', error);
    }
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`/api/receipts/${filename}`);
      fetchReceipts();
    } catch (error) {
      console.error('Could not delete receipt', error);
    }
  };

  const handlePreview = async (filename) => {
    try {
      const response = await axios.get(`/api/receipts/download/${filename}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setSelectedReceipt(url);
      setPreviewOpen(true);
    } catch (error) {
      console.error('Could not preview receipt', error);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedReceipt(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Receipt History
      </Typography>
      {receipts.map((file, index) => (
        <Card key={index} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardContent>
            <Typography variant="body1">{file}</Typography>
          </CardContent>
          <CardActions>
            <IconButton color="primary" onClick={() => handlePreview(file)}>
              <Preview />
            </IconButton>
            <IconButton color="primary" onClick={() => handleDownload(file)}>
              <Download />
            </IconButton>
            <IconButton color="secondary" onClick={() => handleDelete(file)}>
              <Delete />
            </IconButton>
          </CardActions>
        </Card>
      ))}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination 
          count={Math.ceil(receipts.length / limit)} 
          page={page} 
          onChange={(e, value) => setPage(value)} 
          color="primary" 
        />
      </Box>

      {/* Modal for Preview */}
      <Modal open={previewOpen} onClose={handleClosePreview}>
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',  // Adjust the width to a smaller percentage to fit within the window
            maxWidth: '600px',  // Add a max-width to limit the modal size
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            p: 2,  // Reduce padding to save space
            overflowY: 'auto',  // Add overflow to handle large content
            maxHeight: '90vh',  // Ensure the modal doesn't exceed the viewport height
          }}
        >
          <img 
            src={selectedReceipt} 
            alt="Receipt Preview" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              maxHeight: '80vh',  // Ensure the image doesn't exceed the viewport height
              objectFit: 'contain'  // Adjust image scaling to maintain aspect ratio within the modal
            }} 
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default HistoryPage;
