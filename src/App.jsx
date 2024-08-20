import { useState } from "react";
import logo from "./assets/logo.jpg";
// import barcode from "./assets/barcode.png";
import { ToastContainer, toast } from "react-toastify";
import Barcode from "react-barcode";

function App() {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    managerName: "",
    managerCode: "",
    dateTimeStatusCode: "",
    dateTimeStatusType: "",
    date: "",
    time: "",
    tax: "",
    cashAmount: "",
    userId: "",
    userPassword: "",
    barcode: "",
    barcodeFour: "",
    policyId: "",
    policyDays: "",
    policyDate: "",
    products: [
      {
        productId: "",
        productName: "",
        productPrice: "",
      },
    ],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateField(name, value);
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const products = [...formData.products];
    products[index] = { ...products[index], [name]: value };
    setFormData({
      ...formData,
      products,
    });
    validateProductField(index, name, value);
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        { productId: "", productName: "", productPrice: "" },
      ],
    });
  };

  const removeProduct = (index) => {
    const products = formData.products.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      products,
    });
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "dateTimeStatusCode":
        if (value.length < 14 || value.length > 14) {
          error = "Must be 14 characters.";
        }
        break;
      case "barcode":
        if (value.length < 29 || value.length > 29) {
          error = "Must be 29 characters.";
        }
        break;
      case "barcodeFour":
        if (value.length < 4 || value.length > 4) {
          error = "Must be 4 characters.";
        }
        break;
      case "userId":
        if (value.length < 15 || value.length > 15) {
          error = "Must be 15 characters.";
        }
        break;
      case "userPassword":
        if (value.length < 11 || value.length > 11) {
          error = "Must be 11 characters.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const validateProductField = (index, name, value) => {
    let error = "";

    if (name === "productId" && (value.length < 12 || value.length > 12)) {
      error = "Product ID must be 12 characters.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [`productId_${index}`]: error,
    }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year.slice(2)}`;
  };
  const formatDateWithFullYear = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatTimeTo12Hour = (time) => {
    if (!time) return { time12: "", ampm: "" };

    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    const minutesFormatted = minutes?.toString().padStart(2, "0");

    return { time12: `${hours12}:${minutesFormatted}`, ampm };
  };

  const { time } = formData;
  const { time12, ampm } = formatTimeTo12Hour(time);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      address,
      managerName,
      managerCode,
      dateTimeStatusCode,
      dateTimeStatusType,
      date,
      time,
      tax,
      cashAmount,
      userId,
      userPassword,
      barcode,
      policyId,
      policyDays,
      policyDate,
    } = formData;

    // Validate all fields
    validateField("dateTimeStatusCode", dateTimeStatusCode);
    validateField("barcode", barcode);
    validateField("userId", userId);
    validateField("userPassword", userPassword);

    // Validate all products
    formData.products.forEach((product, index) => {
      validateProductField(index, "productId", product.productId);
    });

    // Check for required fields and errors
    const hasErrors = Object.values(errors).some((error) => error);
    if (
      !address ||
      !managerName ||
      !managerCode ||
      !dateTimeStatusCode ||
      !dateTimeStatusType ||
      !date ||
      !time ||
      !tax ||
      !cashAmount ||
      !userId ||
      !userPassword ||
      !barcode ||
      !policyId ||
      !policyDays ||
      !policyDate ||
      hasErrors
    ) {
      toast.error(
        "All fields are required and must meet the validation criteria!"
      );
      return;
    }

    setShow(true);
    toast.success("Successfully receipt generated!");
  };

  return (
    <>
      {!show && (
        <form onSubmit={handleSubmit}>
          <div className="input_container" style={{ marginBottom: "10px" }}>
            <div className="logo_container">
              <img className="logo" src={logo} alt="logo" />
            </div>
            <div className="address_name">
              <div className="address">
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="name_code">
                <div className="name">
                  <span>MANAGER:</span>{" "}
                  <input
                    type="text"
                    name="managerName"
                    placeholder="Manager Name"
                    value={formData.managerName}
                    onChange={handleChange}
                  />
                </div>
                <div className="code">
                  <input
                    type="text"
                    name="managerCode"
                    placeholder="Manager Code"
                    value={formData.managerCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="date_time_status" style={{ gap: "4px" }}>
              <div>
                <div>
                  <input
                    type="text"
                    name="dateTimeStatusCode"
                    placeholder="25025678989295"
                    value={formData.dateTimeStatusCode}
                    onChange={handleChange}
                  />
                  {errors.dateTimeStatusCode && (
                    <p style={{ color: "red" }}>{errors.dateTimeStatusCode}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    style={{ marginTop: "4px" }}
                    name="dateTimeStatusType"
                    placeholder="SALE SELF CHECK OUT"
                    value={formData.dateTimeStatusType}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="date_time">
                <div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="products">
              {formData.products.map((product, index) => (
                <div
                  key={index}
                  className="product"
                  style={{ marginTop: "8px" }}
                >
                  <div>
                    <input
                      type="text"
                      name="productId"
                      placeholder="Product ID"
                      value={product.productId}
                      onChange={(e) => handleProductChange(index, e)}
                    />
                    {errors[`productId_${index}`] && (
                      <p style={{ color: "red" }}>
                        {errors[`productId_${index}`]}
                      </p>
                    )}
                    <input
                      type="text"
                      style={{ marginTop: "4px" }}
                      name="productName"
                      placeholder="Product Name"
                      value={product.productName}
                      onChange={(e) => handleProductChange(index, e)}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="productPrice"
                      placeholder="Product Price"
                      value={product.productPrice}
                      onChange={(e) => handleProductChange(index, e)}
                    />
                    <div
                      style={{
                        marginTop: "4px",
                        display: "flex",
                        height: "35px",
                        gap: "8px",
                      }}
                    >
                      <button
                        style={{ width: "40px" }}
                        type="button"
                        onClick={() => removeProduct(index)}
                      >
                        -
                      </button>
                      <button
                        style={{ width: "40px" }}
                        type="button"
                        onClick={addProduct}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="calculation" style={{ gap: "4px" }}>
              <div className="subtotal">
                <p>SUBTOTAL</p>
                <p>{calculateSubtotal()}</p>
              </div>
              <div className="sales_tax">
                <p>SALES TAX:</p>
                <div>
                  <input
                    type="number"
                    name="tax"
                    placeholder="Tax"
                    value={formData.tax}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="total">
                <p>TOTAL</p>
                <p>${getTotal()}</p>
              </div>
              <div className="cash">
                <p>CASH</p>
                <div>
                  <input
                    type="number"
                    name="cashAmount"
                    placeholder="Cash Amount"
                    value={formData.cashAmount}
                    onChange={handleChange}
                  />
                </div>
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
              {/* <img className="barcode_image" src={barcode} alt="logo" /> */}
              <input
                type="text"
                name="barcode"
                placeholder="Barcode"
                value={formData.barcode}
                onChange={handleChange}
                style={{ marginTop: "4px" }}
              />
              {errors.barcode && (
                <p style={{ color: "red" }}>{errors.barcode}</p>
              )}
              <input
                type="text"
                name="barcodeFour"
                placeholder="Barcode Four Digit"
                value={formData.barcodeFour}
                onChange={handleChange}
                style={{ marginTop: "4px" }}
              />
              {errors.barcodeFour && (
                <p style={{ color: "red" }}>{errors.barcodeFour}</p>
              )}
              {/* <p className="barcode_lower">2502 51 89295 05/04/2024 4300</p> */}
            </div>

            <div className="return_policy">
              <p className="title">RETURN POLICY DEFINITIONS</p>
              <div className="expire" style={{ gap: "4px" }}>
                <div>
                  <p>POLICY ID</p>
                  <input
                    type="text"
                    name="policyId"
                    placeholder="Policy ID"
                    value={formData.policyId}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p>DAYS</p>
                  <input
                    type="number"
                    name="policyDays"
                    placeholder="Policy Days"
                    value={formData.policyDays}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p>POLICY EXPIRES</p>
                  <input
                    type="date"
                    name="policyDate"
                    placeholder="Policy Date"
                    value={formData.policyDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <p className="star">*******************************************</p>
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
                  <div
                    style={{
                      display: "grid",
                      gap: "4px",
                      gridTemplateColumns: "auto 1fr",
                      alignItems: "center",
                    }}
                  >
                    <span>User ID:</span>{" "}
                    <input
                      type="text"
                      name="userId"
                      placeholder="User ID"
                      value={formData.userId}
                      onChange={handleChange}
                    />
                    {errors.userId && (
                      <p style={{ color: "red" }}>{errors.userId}</p>
                    )}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gap: "4px",
                      gridTemplateColumns: "auto 1fr",
                      alignItems: "center",
                      marginTop: "4px",
                    }}
                  >
                    <span>PASSWORD:</span>{" "}
                    <input
                      type="password"
                      name="userPassword"
                      placeholder="User Password"
                      value={formData.userPassword}
                      onChange={handleChange}
                    />
                    {errors.userPassword && (
                      <p style={{ color: "red" }}>{errors.userPassword}</p>
                    )}
                  </div>
                </div>
              </div>
              <p>
                Entries must be completed within 14 days Of purchase. Entrants
                must be 18 or Older to enter. See the complete rules on website.
                No purchase necessary.
              </p>
              <button
                type="submit"
                style={{ width: "100px", height: "30px", marginTop: "10px" }}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      )}

      {show && (
        <div className="container">
          <div className="logo_container">
            <img className="logo" src={logo} alt="logo" />
          </div>
          <div className="address_name">
            <p className="address">{formData.address}</p> {/* form */}
            <div className="name_code">
              <p className="name">MANAGER: {formData.managerName}</p>
              <p className="code">{formData.managerCode}</p>
            </div>
          </div>
          <div className="date_time_status">
            <div>
              <p>
                {formData.dateTimeStatusCode?.substring(0, 4)}{" "}
                {formData.dateTimeStatusCode?.substring(4, 9)}{" "}
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
                    {product.productId} {product.productName}
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
            {/* <img className="barcode_image" src={barcode} alt="logo" /> */}
            <Barcode value={formData.barcode} width={1} fontSize={0} />
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
                <p>POLICY EXPIRES</p>
                <p className="center">
                  {formatDateWithFullYear(formData.policyDate)}
                </p>
              </div>
            </div>
          </div>
          {/* <p className="star">*******************************************</p> */}
          <p className="star">***********************************</p>{" "}
          {/* after adding font family */}
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
                {/* formData.dateTimeStatusCode?.substring(0, 4) */}
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
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default App;
