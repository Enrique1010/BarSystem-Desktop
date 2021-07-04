import React from "react";
import styled from "styled-components";
import mainLogo from "../../logo.jpg";

const InvoiceElement = (itemName, itemAmount, itemPrice) => (
  <tr class="service">
    <td class="tableitem">
      <p class="itemtext">{itemName}</p>
    </td>
    <td class="tableitem">
      <p class="itemtext">{itemAmount}</p>
    </td>
    <td class="tableitem">
      <p class="itemtext">{itemPrice}</p>
    </td>
  </tr>
);

const Invoice = (props) => {
  const isOrderDefined = () => {
    console.log("CONSD::::", this.props);
    if (!!this.props.order) return true;
    else return false;
  };
  var total = 0;

  return (
    <div id="OrderInvoice">
      <StyledInvoice>
        <center id="top">
          <div class="logo"></div>
          <div class="info">
            <h2>11:11 Live {"&"} Drink</h2>
          </div>
        </center>

        <div id="mid">
          <div class="info">
            <h2>Contact Info</h2>
            <p>
              Direccion : street city, state 0000
              <br />
              Email : JohnDoe@gmail.com
              <br />
              Tel. : 809-333-3333
              <br />
            </p>
          </div>
        </div>

        <div id="bot">
          <div id="table">
            <table>
              <tr class="tabletitle">
                <td class="item">
                  <h2>Producto</h2>
                </td>
                <td class="Hours">
                  <h2>Cant.</h2>
                </td>
                <td class="Rate">
                  <h2>Sub Total</h2>
                </td>
              </tr>

              {/* Here will be the Items */}
              {isOrderDefined ? (
                props.order.products.map((prod, index) => {
                  <InvoiceElement
                    itemName={prod.productName}
                    itemAmount={prod.amount}
                    itemPrice={prod.price}
                  />;
                  { // Calculate the toal price of each product
                    total += prod.price * prod.amount;
                  }
                })
              ) : (
                <></>
              )}

              <tr class="tabletitle">
                <td></td>
                <td class="Rate">
                  <h2>Total</h2>
                </td>
                <td class="payment">
                  <h2>${total}</h2>
                </td>
              </tr>
            </table>
          </div>

          <div id="legalcopy">
            <p class="legal">
              <strong>Gracias por comprar!</strong>
            </p>
          </div>
        </div>
      </StyledInvoice>
    </div>
  );
};

export default Invoice;

const StyledInvoice = styled.div`
  padding: 2mm;
  margin: 0 auto;
  width: 72mm;
  background: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
    border-bottom: 1px solid;
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
