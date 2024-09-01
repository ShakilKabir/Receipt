import React, { useEffect, useRef, useState } from "react";
import Barcode from "react-barcode";
import logo from "../assets/logo.jpg";
import { Button, Box } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import html2canvas from 'html2canvas';
import { useLocation } from "react-router-dom";
import axios from '../utils/axiosConfig'

const Receipt = ({
  formData,
  time12,
  ampm,
  formatDate,
  formatDateWithFullYear,
  getTotal,
  calculateSubtotal,
  getChargeDue,
  containerClass,
}) => {
  const receiptRef = useRef(null);
  const [barcodeImage, setBarcodeImage] = useState(null);
  const barcodeRef = useRef(null);
  const location = useLocation();

  const isReceiptPage = location.pathname === '/receipt';

  useEffect(() => {
    if (barcodeRef.current) {
      const svgElement = barcodeRef.current.querySelector("svg");
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width; 
          canvas.height = img.height; 
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          setBarcodeImage(canvas.toDataURL("image/png"));
          URL.revokeObjectURL(url);
        };
        img.src = url;
      }
    }
  }, [formData.barcode]);

  useEffect(() => {
    const saveReceiptAsPngAutomatically = async () => {
      const node = receiptRef.current;
      try {
        const canvas = await html2canvas(node, {
          backgroundColor: '#fff',
          useCORS: true,
          allowTaint: true,
          scale: 2,
        });

        // Convert canvas to data URL
        const pngData = canvas.toDataURL('image/png');

        // Send the PNG data to the backend
        const response = await axios.post('/api/receipts/save', {
          pngData,  // Base64 encoded PNG data
          filename: `receipt_${new Date().getTime()}.png`, // Generate a unique filename
        });

        console.log('Receipt saved automatically:', response.data.message);
      } catch (error) {
        console.error('Error automatically saving the receipt as PNG:', error);
      }
    };

    if (formData && isReceiptPage) {
      saveReceiptAsPngAutomatically();
    }
  }, [formData]);

  const handleSaveAsPng = () => {
    const node = receiptRef.current;
    html2canvas(node, {
      backgroundColor: '#fff',
      useCORS: true,
      allowTaint: true,
      scale: 2,
    })
      .then((canvas) => {
        const link = document.createElement('a');
        link.download = 'receipt.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      })
      .catch((error) => {
        console.error('Could not generate image', error);
      });
  };

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

  return (
    <div>
      <div ref={receiptRef} className={containerClass}>
        <div className="logo_container">
          <img className="logo" src={logo} alt="logo" />
        </div>
        <div className="address_name">
          <p className="address">{formData.address}</p>
          <div className="name_code">
            <p className="name">STORE MGR {formData.managerName}</p>
            <p className="code">
              {formData.managerCode.substring(0, 3)}-
              {formData.managerCode.substring(3, 6)}-
              {formData.managerCode.substring(6, 10)}
            </p>
          </div>
        </div>
        <div className="date_time_status">
          <div>
            <p>
              {formData.dateTimeStatusCode?.substring(0, 4)}&nbsp;&nbsp;
              {formData.dateTimeStatusCode?.substring(4, 9)}&nbsp;&nbsp;
              {formData.dateTimeStatusCode?.substring(9, 14)}
            </p>
            <p>{formData.dateTimeStatusType}</p>
          </div>
          <div className="date_time">
            <p>{formatDate(formData.date)}</p>
            <p>
              {time12} {ampm}
            </p>
          </div>
        </div>
        <div className="products">
          {formData.products.map((product, index) => (
            <div className="product" key={index}>
              <p className="product_name">
                <span className="text-content">
                  {product.productId}{" "}
                  {product.productName.split("<A>")[0] +
                    (product.productName.includes("<A>") ? "<A>" : "")}
                  {product.productDescription2 && <br />}
                  {product.productDescription2}
                  {product.productDescription3 && <br />}
                  {product.productDescription3}
                  {product.productDescription4 && <br />}
                  {product.productDescription4}
                  {product.productDescription5 && <br />}
                  {product.productDescription5}
                  {product.productDescription6 && <br />}
                  {product.productDescription6}
                </span>
              </p>
              <p>{parseFloat(product?.productPrice).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="calculation">
          <div className="subtotal">
            <p>SUBTOTAL</p>
            <p>{calculateSubtotal()}</p>
          </div>
          <div className="sales_tax">
            <p>SALES TAX</p>
            <p>{parseFloat(formData?.tax).toFixed(2)}</p>
          </div>
          <div className="total">
            <p>TOTAL</p>
            <p>${getTotal()}</p>
          </div>
          <div className="cash">
            <p>CASH</p>
            <p>{parseFloat(formData?.cashAmount).toFixed(2)}</p>
          </div>
          <div className="charge_due">
            <p>CHANGE DUE</p>
            <p>{getChargeDue()}</p>
          </div>
        </div>
        <div className="barcode">
          <p className="barcode_time_date">
            <span>{formData.dateTimeStatusCode?.substring(0, 4)}</span>
            <span>{formatDate(formData.date)}</span>
            <span>{time12}</span>
            <span>{ampm}</span>
          </p>
          {isReceiptPage ? (
            barcodeImage ? (
              <img
                src={barcodeImage}
                alt="Barcode"
                style={{ display: "block", margin: "0 auto", maxWidth: "100%", height: "auto" }}
              />
            ) : (
              <div id="barcode" ref={barcodeRef} style={{ display: "flex", justifyContent: "center" }}>
                <Barcode value={formData.barcode} width={1.5} height={45} fontSize={0} />
              </div>
            )
          ) : (
            <Barcode value={formData.barcode} width={3} fontSize={0} />
          )}
          <p className="barcode_lower">
            {formData.dateTimeStatusCode?.substring(0, 4) +
              " " +
              formData.dateTimeStatusCode?.substring(7, 9) +
              " " +
              formData.dateTimeStatusCode?.substring(9, 14) +
              " " +
              formatDateWithFullYear(formData.date) +
              " " +
              formData.barcodeFour}
          </p>
        </div>
        <div className="return_policy">
          <p className="title">RETURN POLICY DEFINITIONS</p>
          <div className="expire">
            <p>A</p>
            <div>
              <p>POLICY ID</p>
              <p className="center">{formData.policyId}</p>
            </div>
            <div>
              <p>DAYS</p>
              <p className="center">{formData.policyDays}</p>
            </div>
            <div>
              <p>POLICY EXPIRES ON</p>
              <p className="center">
                {formatDateWithFullYear(formData.policyDate)}
              </p>
            </div>
          </div>
        </div>
        {formData.showSecondPart && (
          <>
            <p className="star">*******************************************</p>{" "}
            <p className="did_we_nail_it">DID WE NAIL IT?</p>
            <div className="footer">
              <p>
                Take a short survey for a chance TO WIN A $5,000 HOME DEPOT GIFT
                CARD
              </p>
              <div className="middle">
                <p>Opine en español</p>
                <p className="link">wwww.homedepot.com/survey</p>
                <div>
                  <p>
                    User ID: {formData.userId?.substring(0, 3)}{" "}
                    {formData.userId?.substring(3, 9)}{" "}
                    {formData.userId?.substring(9, 15)}
                  </p>
                  <p>
                    PASSWORD: {formData.userPassword?.substring(0, 5)}{" "}
                    {formData.userPassword?.substring(5, 11)}
                  </p>
                </div>
              </div>
              <p>
                Entries must be completed within 14 days Of purchase. Entrants
                must be 18 or Older to enter. See the complete rules on website.
                No purchase necessary.
              </p>
            </div>
          </>
        )}
      </div>
      {/* Buttons to Save as PNG and Print */}
      {isReceiptPage && <Box mt={2} display="flex" justifyContent="center" gap={2}>
        <Button variant="contained" color="primary" onClick={handleSaveAsPng}>
          Save as PNG
        </Button>
        <Button variant="contained" color="secondary" onClick={handlePrint}>
          Print
        </Button>
      </Box>}
    </div>
  );
};

export default Receipt;
