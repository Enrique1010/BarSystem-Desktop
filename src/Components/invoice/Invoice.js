import React, { useEffect, useState } from "react";
import styled from "styled-components";
import mainLogo from "../../logo.jpg";

export const InvoiceElement = (itemName, itemAmount, itemPrice) => (
  <tr class="service">
    <td class="tableitem">
      <p style={{ fontSize: "9px", lineHeight: "1.2em" }} class="itemtext">
        {itemName}
      </p>
    </td>
    <td class="tableitem">
      <p style={{ fontSize: "9px", lineHeight: "1.2em" }} class="itemtext">
        {itemAmount}
      </p>
    </td>
    <td class="tableitem">
      <p style={{ fontSize: "9px", lineHeight: "1.2em" }} class="itemtext">
        {itemPrice}
      </p>
    </td>
  </tr>
);

const Invoice = (props) => {
  const [total, setTotal] = useState(0.0);
  const [products, setProducts] = useState(undefined);
  
  const isOrderDefined = () => {
    console.log("CONSD::::", props);
    if (!!props.order) {
      return true;
    } else return false;
  };

  // if (isOrderDefined) {
  //   let prodContent = [];

  //   props.order.products.map((prod, index) => {
  //     prodContent += (
  //       <InvoiceElement
  //         itemName={prod.productName}
  //         itemAmount={prod.amount}
  //         itemPrice={prod.price}
  //       />
  //     );
  //     setTotal(total + prod.price * prod.amount);
  //   });

  //   setProducts(prodContent);
  // } else {
  //   console.log("AHHHGGHG!!!!");
  // }

  return (
    <div id="OrderInvoice">
      <StyledInvoice>
        <center id="top">
          <div class="logo"></div>
          <div class="info">
            <h2 style={{ fontSize: "10px", fontWeight: 250 }}>
              11:11 Live {"&"} Drink
            </h2>
          </div>
        </center>

        <div id="mid">
          <div class="info">
            <h2 style={{ fontSize: "10px", fontWeight: 250 }}>Contact Info</h2>
            <p style={{ fontSize: "9px", lineHeight: "1.2em" }}>
              Direccion : street city, state 0000
              <br />
              Email : JohnDoe@gmail.com
              <br />
              Tel. : 809-333-3333
              <br />
            </p>

            <h2 style={{ fontSize: "10px", fontWeight: 250 }}>Orden # {props.order.id}</h2>
          </div>
        </div>

        <div id="bot">
          <div id="table">
            <table width="100%">
              <tr class="tabletitle">
                <td class="item">
                  <h2 style={{ fontSize: "10px", fontWeight: 250 }}>
                    Producto
                  </h2>
                </td>
                <td class="Hours">
                  <h2 style={{ fontSize: "10px", fontWeight: 250 }}>Cant.</h2>
                </td>
                <td class="Rate">
                  <h2 style={{ fontSize: "10px", fontWeight: 250 }}>
                    Sub Total
                  </h2>
                </td>
              </tr>

              {/* Here will be the Items */}
              {products}

              <tr class="tabletitle">
                <td></td>
                <td class="Rate">
                  <h2 style={{ fontSize: "10px", fontWeight: 250 }}>Total</h2>
                </td>
                <td class="payment">
                  <h2 style={{ fontSize: "10px", fontWeight: 250 }}>
                    ${total}
                  </h2>
                </td>
              </tr>
            </table>
          </div>

          <div id="legalcopy">
            <p style={{ fontSize: "9px", lineHeight: "1.2em" }} class="legal">
              <strong>Gracias por comprar!</strong>
            </p>
          </div>
        </div>
      </StyledInvoice>
    </div>
  );
};

export default Invoice;

export const StyledInvoice = styled.div`
  padding: 2mm;
  margin: 0 auto;
  width: 72mm;
  background: #fff;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  font-size: 9px;

  h2 {
    font-size: 9px;
    font-weight: 250;
  }

  h3 {
    font-size: 11px;
    font-weight: 300;
    line-height: 2em;
  }

  p {
    font-size: 9px;
    line-height: 1.2em;
  }

  #top,
  #mid,
  #bot {
    /* Targets all id with 'col-' */
    /* border-bottom: 1px solid; */
  }

  #top {
    min-height: 100px;
  }

  #mid {
    min-height: 80px;
  }

  #bot {
    min-height: 50px;
  }
  /* 
  #top .logo {
    float: left;
    height: 60px;
    width: 60px;
    background: ${mainLogo} no-repeat;
    background-size: 60px 60px;
  } */

  .info {
    display: block;
    float: left;
    margin-left: 0;
  }

  .title {
    float: right;
  }

  .title p {
    text-align: right;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  td {
    padding: 2px 0 2px 15px;
  }

  .tabletitle {
    padding: 2px;
    font-size: 9px;
  }

  .service {
    border-bottom: 1px solid #eee;
  }

  .item {
    width: 24mm;
  }

  .itemtext {
    font-size: 9px;
  }

  #legalcopy {
    margin-top: 5mm;
  }
`;

export const RawInvoiceStyle = `
    padding: 2mm;
    margin: 0 auto;
    width: 72mm;
    background: #fff;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-size: 9px;`;
