import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Pagination, Tooltip, Modal } from "@mui/material";
import { Preview, Delete, Download } from "@mui/icons-material";
import axios from '../utils/axiosConfig';

const HistoryPage = () => {
  const [receipts, setReceipts] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const limit = 100;

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token in HistoryPage:', token);
    fetchReceipts();
  }, [page]);

  const fetchReceipts = async () => {
    try {
      const response = await axios.get('/api/receipts', {
        params: { page, limit }
      });
      console.log('Fetched receipts:', response.data.files);
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
    <Box sx={{ p: 4, bgcolor: '#f0f2f5', minHeight: '100vh' }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Receipt History
      </Typography>
      <List sx={{ maxWidth: '800px', margin: '0 auto', bgcolor: 'white', borderRadius: 2, boxShadow: 2 }}>
        {receipts.map((file, index) => (
          <React.Fragment key={index}>
            <ListItem
              sx={{
                py: 1,
                px: 3,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <ListItemText
                primary={file}
                primaryTypographyProps={{
                  variant: 'body1',
                  noWrap: true,
                  sx: { fontWeight: 500 },
                }}
              />
              <ListItemSecondaryAction>
                <Tooltip title="Preview">
                  <IconButton color="primary" onClick={() => handlePreview(file)}>
                    <Preview />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                  <IconButton color="primary" onClick={() => handleDownload(file)}>
                    <Download />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="secondary" onClick={() => handleDelete(file)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
            {index < receipts.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
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
            width: '90%',
            maxWidth: '600px',
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            p: 2,
            overflowY: 'auto',
            maxHeight: '90vh',
          }}
        >
          <img
            src={selectedReceipt}
            alt="Receipt Preview"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default HistoryPage;
