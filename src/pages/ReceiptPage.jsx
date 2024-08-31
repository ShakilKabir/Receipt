import React from "react";
import { useLocation } from "react-router-dom";
import Receipt from "./receipt";

const ReceiptPage = () => {
  const location = useLocation();
  const formData = location.state?.formData;
  const time12 = location.state?.time12;
  const ampm = location.state?.ampm;

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
