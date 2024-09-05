import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Modal,
  Pagination,
} from "@mui/material";
import { Preview, Delete, Download } from "@mui/icons-material";
import axios from "../utils/axiosConfig";

const HistoryPage = () => {
  const [receipts, setReceipts] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const limit = 100;

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token in HistoryPage:", token);
    fetchReceipts();
  }, [page]);

  const fetchReceipts = async () => {
    try {
      const response = await axios.get("/api/receipts", {
        params: { page, limit },
      });
      console.log("Fetched receipts:", response.data.files);
      setReceipts(response.data.files);
    } catch (error) {
      console.error("Could not fetch receipts", error);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(`/api/receipts/download/${filename}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Could not download receipt", error);
    }
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`/api/receipts/${filename}`);
      fetchReceipts();
    } catch (error) {
      console.error("Could not delete receipt", error);
    }
  };

  const handlePreview = async (filename) => {
    try {
      const response = await axios.get(`/api/receipts/download/${filename}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setSelectedReceipt(url);
      setPreviewOpen(true);
    } catch (error) {
      console.error("Could not preview receipt", error);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedReceipt(null);
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f0f2f5", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ textAlign: "center", mb: 4 }}
      >
        Receipt History
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: "900px", margin: "0 auto", boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Receipt Name</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Time</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receipts.map((file, index) => (
              <TableRow key={index}>
                <TableCell>{file.filename}</TableCell>
                <TableCell>{file.date}</TableCell>
                <TableCell>{file.time}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Preview">
                    <IconButton color="primary" onClick={() => handlePreview(file.filename)}>
                      <Preview />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download">
                    <IconButton color="primary" onClick={() => handleDownload(file.filename)}>
                      <Download />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="secondary" onClick={() => handleDelete(file.filename)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
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
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "600px",
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            p: 2,
            overflowY: "auto",
            maxHeight: "90vh",
          }}
        >
          <img
            src={selectedReceipt}
            alt="Receipt Preview"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default HistoryPage;
