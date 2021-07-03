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

  return (
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
                <h2>$3,644.25</h2>
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
  );
};

export default Invoice;

const StyledInvoice = styled.div`
  box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
  padding: 2mm;
  margin: 0 auto;
  width: 44mm;
  background: #fff;

  h2 {
    font-size: 0.9em;
  }

  h3 {
    font-size: 1.2em;
    font-weight: 300;
    line-height: 2em;
  }

  p {
    font-size: 0.7em;
    color: #666;
    line-height: 1.2em;
  }

  #top,
  #mid,
  #bot {
    /* Targets all id with 'col-' */
    border-bottom: 1px solid #eee;
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

  #top .logo {
    float: left;
    height: 60px;
    width: 60px;
    background: ${mainLogo} no-repeat;
    background-size: 60px 60px;
  }

  .clientlogo {
    float: left;
    height: 60px;
    width: 60px;
    background: url(http://michaeltruong.ca/images/client.jpg) no-repeat;
    background-size: 60px 60px;
    border-radius: 50px;
  }

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
    padding: 5px 0 5px 15px;
  }

  .tabletitle {
    padding: 5px;
    font-size: 0.5em;
  }

  .service {
    border-bottom: 1px solid #eee;
  }

  .item {
    width: 24mm;
  }

  .itemtext {
    font-size: 0.5em;
  }

  #legalcopy {
    margin-top: 5mm;
  }
`;
