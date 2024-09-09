import React, { useEffect, useState } from "react";
import Receipt from "./receipt";

const ReceiptPage = () => {
  const [formData, setFormData] = useState(null);
  const [time12, setTime12] = useState("");
  const [ampm, setAmpm] = useState("");

  useEffect(() => {
    // Retrieve the receipt data from sessionStorage
    const receiptData = sessionStorage.getItem("receiptData");
    if (receiptData) {
      const parsedData = JSON.parse(receiptData);
      setFormData(parsedData.formData);
      setTime12(parsedData.time12);
      setAmpm(parsedData.ampm);
    } else {
      console.error("No receipt data found in sessionStorage");
    }
  }, []);

  // Define necessary functions in this component
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year.slice(2)}`;
  };

  const formatDateWithFullYear = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
  };

  const calculateSubtotal = () => {
    return formData.products
      .reduce((sum, product) => {
        const price = parseFloat(product.productPrice) || 0;
        return sum + price;
      }, 0)
      .toFixed(2);
  };

  const getTotal = () => {
    const subtotal = parseFloat(calculateSubtotal()) || 0;
    const tax = parseFloat(formData.tax) || 0;
    return (subtotal + tax).toFixed(2);
  };

  const getChargeDue = () => {
    const total = parseFloat(getTotal()) || 0;
    const cashAmount = parseFloat(formData.cashAmount) || 0;
    return (cashAmount - total).toFixed(2);
  };

  return (
    <div>
      {formData ? (
        <Receipt
          formData={formData}
          time12={time12}
          ampm={ampm}
          formatDate={formatDate}
          formatDateWithFullYear={formatDateWithFullYear}
          calculateSubtotal={calculateSubtotal}
          getTotal={getTotal}
          getChargeDue={getChargeDue}
          containerClass="container"
        />
      ) : (
        <p>No receipt data available</p>
      )}
    </div>
  );
};

export default ReceiptPage;
