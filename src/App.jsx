import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "./assets/logo.jpg";
// import barcode from "./assets/barcode.png";
import { ToastContainer, toast } from "react-toastify";
import Barcode from "react-barcode";
import Receipt from "./pages/receipt";
import Navbar from "./pages/Navbar";
import LoginPage from "./pages/Login";
import AdminPage from "./pages/Admin";
import ReceiptPage from "./pages/ReceiptPage";
import HistoryPage from "./pages/History";
import { jwtDecode } from "jwt-decode";
import axios from "./utils/axiosConfig";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [show, setShow] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const [barcodeShow, setBarcodeShow] = useState(false);

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
    showSecondPart: false,
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
        productPrice: "",
        productName: "",
        productDescription2: "",
        productDescription3: "",
        productDescription4: "",
        productDescription5: "",
        productDescription6: "",
      },
    ],
  });

  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState({});
  const productInputRefs = useRef([]);

  const fetchProductReferences = async (query, index, type) => {
    const endpoint = {
      productId: "/api/productReferences",
      productName: "/api/productNames",
      productDescription2: "/api/productDescription2s",
    }[type]; // Use the type to determine which endpoint to use

    try {
      const response = await axios.get(`${endpoint}?query=${query}`);
      if (Array.isArray(response.data)) {
        setSuggestions((prevSuggestions) => ({
          ...prevSuggestions,
          [`${type}_${index}`]: response.data.slice(0, 4),
        }));
      }
    } catch (error) {
      console.error("Error fetching references:", error);
    }
  };

  const handleClickOutside = (event) => {
    // Log if the click happened inside the suggestion list
    console.log(
      "Clicked inside suggestion list?",
      event.target.closest(".suggestion-list")
    );

    // Check if any input field or suggestion list is clicked
    const isClickInsideInputOrSuggestion =
      productInputRefs.current.some((ref) => ref?.contains(event.target)) ||
      event.target.closest(".suggestion-list");

    // If the click is outside the inputs or suggestion lists, hide the suggestions
    if (!isClickInsideInputOrSuggestion) {
      setSuggestions({}); // Hide suggestions
    }
  };

  const handleSuggestionClick = (index, suggestion, type) => {
    const updatedProducts = formData.products.map((product, i) =>
      i === index ? { ...product, [type]: suggestion } : product
    );

    setFormData({
      ...formData,
      products: updatedProducts,
    });

    // Clear the suggestions for this input after selection
    setSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [`${type}_${index}`]: [],
    }));
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    updateBarcode();
  }, [formData.dateTimeStatusCode, formData.date]);

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode the token to get the user role
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthenticated(false);
        setUserRole(null);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    validateField(name, value);
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const products = [...formData.products];
    products[index] = { ...products[index], [name]: value };
    setFormData({ ...formData, products });

    if (["productId", "productName", "productDescription2"].includes(name)) {
      fetchProductReferences(value, index, name);
    }
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        {
          productId: "",
          productName: "",
          productPrice: "",
          productDescription2: "",
          productDescription3: "",
          productDescription4: "",
          productDescription5: "",
          productDescription6: "",
        },
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
        if (value.length !== 14) {
          error = "Must be 14 characters.";
        }
        break;
      case "barcode":
        if (value.length !== 15) {
          error = "Must be 15 characters.";
        }
        break;
      case "barcodeFour":
        if (value.length !== 4) {
          error = "Must be 4 characters.";
        }
        break;
      case "userId":
        if (formData.showSecondPart && value.length !== 15) {
          error = "Must be 15 characters.";
        }
        break;
      case "managerCode":
        if (value.length !== 10) {
          error = "Must be 10 characters.";
        }
        break;
      case "userPassword":
        if (formData.showSecondPart && value.length !== 11) {
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

    if (name === "productId" && value.length > 15) {
      error = "Max 15 characters.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [`productId_${index}`]: error,
    }));
  };

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

  const formatTimeTo12Hour = (time) => {
    if (!time) return { time12: "", ampm: "" };

    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const hours12 = (hours % 12 || 12).toString().padStart(2, "0");
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

  const updateBarcode = () => {
    const { dateTimeStatusCode, date } = formData;
    if (dateTimeStatusCode && date) {
      const barcode = `${date.substring(5, 7)}${date.substring(
        8,
        10
      )}${date.substring(3, 4)}${dateTimeStatusCode.substring(
        7,
        13
      )}${dateTimeStatusCode.substring(0, 4)}`;
      setFormData({
        ...formData,
        barcode,
      });
    }
  };

  const saveProductReferences = async (products) => {
    try {
      for (const product of products) {
        // Save productId
        await axios.post("/api/productReferences", {
          productId: product.productId,
        });

        // Save productName
        await axios.post("/api/productNames", {
          productName: product.productName,
        });

        // Save productDescription2
        await axios.post("/api/productDescription2s", {
          productDescription2: product.productDescription2,
        });
      }
    } catch (error) {
      console.error("Error saving product reference:", error);
    }
  };

  useEffect(() => {
    console.log("Updated suggestions:", suggestions);
  }, [suggestions]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("You must be logged in to submit the form.");
      navigate("/login");
      return;
    }

    validateField("dateTimeStatusCode", formData.dateTimeStatusCode);
    validateField("barcode", formData.barcode);
    if (formData.showSecondPart) {
      validateField("userId", formData.userId);
      validateField("userPassword", formData.userPassword);
    }

    formData.products.forEach((product, index) => {
      validateProductField(index, "productId", product.productId);
    });

    const hasErrors = Object.values(errors).some((error) => error);

    if (
      !formData.address ||
      !formData.managerName ||
      !formData.managerCode ||
      !formData.dateTimeStatusCode ||
      !formData.dateTimeStatusType ||
      !formData.date ||
      !formData.time ||
      !formData.tax ||
      !formData.cashAmount ||
      !formData.barcode ||
      !formData.policyId ||
      !formData.policyDays ||
      !formData.policyDate ||
      !formData.barcodeFour ||
      hasErrors
    ) {
      toast.error(
        "All fields are required and must meet the validation criteria!"
      );
      return;
    }

    if (formData.showSecondPart) {
      if (!formData.userId || !formData.userPassword) {
        toast.error(
          "User ID and User Password are required when showing the second part!"
        );
        return;
      }
    }

    // Set a flag in sessionStorage to indicate the form was submitted
    sessionStorage.setItem("receiptSubmitted", "true");

    await saveProductReferences(formData.products);

    navigate("/receipt", {
      state: {
        formData,
        time12,
        ampm,
      },
    });

    setFormData({
      address: "",
      managerName: "",
      managerCode: "",
      dateTimeStatusCode: "",
      dateTimeStatusType: "",
      date: "",
      time: "",
      tax: "",
      cashAmount: "",
      showSecondPart: false,
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
          productPrice: "",
          productName: "",
          productDescription2: "",
          productDescription3: "",
          productDescription4: "",
          productDescription5: "",
          productDescription6: "",
        },
      ],
    });

    // setShow(true);
    toast.success("Successfully receipt generated!");
  };

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        userRole={userRole}
        setUserRole={setUserRole}
      />
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage
              setIsAuthenticated={setIsAuthenticated}
              setUserRole={setUserRole}
            />
          }
        />
        <Route
          path="/generate"
          element={
            !show ? (
              <>
                <form onSubmit={handleSubmit}>
                  <div
                    className="input_container"
                    style={{ marginBottom: "10px" }}
                  >
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
                          required
                        />
                      </div>
                      <div className="name_code">
                        <div className="name">
                          {/* <span>STORE MGR.</span>{" "} */}
                          <input
                            type="text"
                            name="managerName"
                            placeholder="STORE MGR."
                            value={formData.managerName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="code">
                          <input
                            type="number"
                            name="managerCode"
                            placeholder="Mobile No."
                            value={formData.managerCode}
                            onChange={handleChange}
                            required
                          />
                          {errors.managerCode && (
                            <p style={{ color: "red" }}>{errors.managerCode}</p>
                          )}
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
                            required
                          />
                          {errors.dateTimeStatusCode && (
                            <p style={{ color: "red" }}>
                              {errors.dateTimeStatusCode}
                            </p>
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
                            required
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
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="products">
                      {formData.products.map((product, index) => (
                        <div key={index} className="product">
                          <div
                            className="productInputDivide"
                            style={{ position: "relative", width: "100%" }}
                          >
                            <input
                              ref={(el) =>
                                (productInputRefs.current[index] = el)
                              }
                              type="text"
                              name="productId"
                              placeholder="Product ID"
                              value={product.productId}
                              onChange={(e) => handleProductChange(index, e)}
                              required
                              style={{ width: "100%" }} // Ensure input and dropdown match widths
                            />

                            {/* Render suggestions only when available */}
                            {suggestions[`productId_${index}`]?.length > 0 && (
                              <ul
                                className="suggestion-list"
                                style={{ top: "100%" }}
                              >
                                {suggestions[`productId_${index}`].map(
                                  (suggestion, idx) => (
                                    <li
                                      key={idx}
                                      onClick={() =>
                                        handleSuggestionClick(
                                          index,
                                          suggestion,
                                          "productId"
                                        )
                                      }
                                    >
                                      {suggestion}
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                            {errors[`productId_${index}`] && (
                              <p style={{ color: "red" }}>
                                {errors[`productId_${index}`]}
                              </p>
                            )}
                            <input
                              type="number"
                              name="productPrice"
                              placeholder="Product Price"
                              value={product.productPrice}
                              onChange={(e) => handleProductChange(index, e)}
                              required
                            />
                          </div>
                          <div style={{ position: "relative", width: "100%" }}>
                            <input
                              type="text"
                              style={{
                                marginTop: "4px"
                              }}
                              name="productName"
                              placeholder="Product Description Line 1 with <A>"
                              value={product.productName}
                              onChange={(e) => handleProductChange(index, e)}
                              required
                            />
                            {console.log(
                              "Suggestions for productName:",
                              suggestions[`productName_${index}`]
                            )}
                            {/* Product Name Suggestions */}
                            {suggestions[`productName_${index}`]?.length >
                              0 && (
                              <>
                                {console.log(
                                  "Rendering suggestions for productName:",
                                  suggestions[`productName_${index}`]
                                )}
                                <ul
                                  className="suggestion-list"
                                  style={{ top: "100%" }}
                                >
                                  {suggestions[`productName_${index}`].map(
                                    (suggestion, idx) => (
                                      <li
                                        key={idx}
                                        onClick={() =>
                                          handleSuggestionClick(
                                            index,
                                            suggestion,
                                            "productName"
                                          )
                                        }
                                      >
                                        {suggestion}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </>
                            )}
                          </div>
                          <div className="productInputDivide" style={{ position: "relative", width: "100%" }}>
                            <input
                              type="text"
                              style={{
                                marginTop: "4px",
                                position: "relative",
                                width: "100%",
                              }}
                              name="productDescription2"
                              placeholder="Line 2"
                              value={product.productDescription2}
                              onChange={(e) => handleProductChange(index, e)}
                            />
                            {/* {console.log(
                              "Suggestions for productDescription2:",
                              suggestions[`productDescription2_${index}`]
                            )} */}
                            {suggestions[`productDescription2_${index}`]
                              ?.length > 0 && (
                              <ul
                                className="suggestion-list"
                                style={{ top: "100%" }}
                              >
                                {suggestions[
                                  `productDescription2_${index}`
                                ].map((suggestion, idx) => (
                                  <li
                                    key={idx}
                                    onClick={() =>
                                      handleSuggestionClick(
                                        index,
                                        suggestion,
                                        "productDescription2"
                                      )
                                    }
                                  >
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            )}
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
                            {/* <input
                      type="text"
                      style={{ marginTop: "4px" }}
                      name="productDescription3"
                      placeholder="Line 3"
                      value={product.productDescription3}
                      onChange={(e) => handleProductChange(index, e)}
                    /> */}
                          </div>
                          {/* <div className="productInputDivide">
                    <input
                      type="text"
                      style={{ marginTop: "4px" }}
                      name="productDescription4"
                      placeholder="Line 4"
                      value={product.productDescription4}
                      onChange={(e) => handleProductChange(index, e)}
                    />
                    <input
                      type="text"
                      style={{ marginTop: "4px" }}
                      name="productDescription5"
                      placeholder="Line 5"
                      value={product.productDescription5}
                      onChange={(e) => handleProductChange(index, e)}
                    />
                  </div> */}
                          {/* <div className="productInputDivide">
                    <input
                      type="text"
                      style={{ marginTop: "4px" }}
                      name="productDescription6"
                      placeholder="Line 6"
                      value={product.productDescription6}
                      onChange={(e) => handleProductChange(index, e)}
                    />
                    
                  </div> */}
                          <hr style={{ margin: "8px 0" }} />
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
                            required
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
                            required
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
                        <span>
                          {formData.dateTimeStatusCode?.substring(0, 4)}
                        </span>
                        <span>{formatDate(formData.date)}</span>
                        <span>{time12}</span>
                        <span>{ampm}</span>
                      </p>
                      {/* <img className="barcode_image" src={barcode} alt="logo" /> */}
                      {/* <input
                type="text"
                name="barcode"
                placeholder="Barcode"
                value={formData.barcode}
                onChange={handleChange}
                style={{ marginTop: "4px" }}
              />
              {errors.barcode && (
                <p style={{ color: "red" }}>{errors.barcode}</p>
              )} */}
                      {formData.barcode && (
                        <Barcode
                          value={formData.barcode}
                          width={3.5}
                          fontSize={0}
                        />
                      )}
                      <div style={{ textAlign: "right" }}>
                        <input
                          type="text"
                          name="barcodeFour"
                          placeholder="Barcode Four Digit"
                          value={formData.barcodeFour}
                          onChange={handleChange}
                          style={{ marginTop: "4px", width: "140px" }}
                          required
                        />
                      </div>
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
                            required
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
                            required
                          />
                        </div>
                        <div>
                          <p>POLICY EXPIRES ON</p>
                          <input
                            type="date"
                            name="policyDate"
                            placeholder="Policy Date"
                            value={formData.policyDate}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="showSecondPartContainer">
                      <input
                        type="checkbox"
                        name="showSecondPart"
                        checked={formData.showSecondPart}
                        onChange={handleChange}
                      />
                      <p>Show Second Part</p>
                    </div>

                    {formData.showSecondPart && (
                      <>
                        <p className="star">
                          ********************************************************
                        </p>
                        <p className="did_we_nail_it">DID WE NAIL IT?</p>
                      </>
                    )}

                    <div className="footer">
                      {formData.showSecondPart && (
                        <>
                          <p>
                            Take a short survey for a chance TO WIN A $5,000
                            HOME DEPOT GIFT CARD
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
                                  <p style={{ color: "red" }}>
                                    {errors.userId}
                                  </p>
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
                                  <p style={{ color: "red" }}>
                                    {errors.userPassword}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <p>
                            Entries must be completed within 14 days Of
                            purchase. Entrants must be 18 or Older to enter. See
                            the complete rules on website. No purchase
                            necessary.
                          </p>
                        </>
                      )}
                      <button
                        type="submit"
                        style={{
                          width: "100px",
                          height: "30px",
                          marginTop: "10px",
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
                {!show && (
                  <Receipt
                    formData={formData}
                    time12={time12}
                    ampm={ampm}
                    formatDate={formatDate}
                    formatDateWithFullYear={formatDateWithFullYear}
                    calculateSubtotal={calculateSubtotal}
                    getTotal={getTotal}
                    getChargeDue={getChargeDue}
                    containerClass={`container1 ${
                      !isAuthenticated ? "blurred" : ""
                    }`}
                  />
                )}
                {/* {show && (
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
                  )} */}
              </>
            ) : (
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
            )
          }
        />
        <Route
          path="/"
          element={
            <div className="home-page">
              <img
                src={logo}
                alt="logo"
                className="home-logo"
                onClick={() => navigate("/generate")}
                style={{ cursor: "pointer" }}
              />
            </div>
          }
        />
        <Route
          path="/admin"
          element={
            isAuthenticated && userRole === "admin" ? (
              <AdminPage /> // Only allow access if the user is authenticated and has the admin role
            ) : (
              <LoginPage
                setIsAuthenticated={setIsAuthenticated}
                setUserRole={setUserRole}
              />
            )
          }
        />
        <Route
          path="/receipt"
          element={
            isAuthenticated ? (
              <ReceiptPage />
            ) : (
              <LoginPage
                setIsAuthenticated={setIsAuthenticated}
                setUserRole={setUserRole}
              />
            )
          }
        />
        <Route
          path="/history"
          element={
            isAuthenticated ? (
              <HistoryPage />
            ) : (
              <LoginPage
                setIsAuthenticated={setIsAuthenticated}
                setUserRole={setUserRole}
              />
            )
          }
        />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
