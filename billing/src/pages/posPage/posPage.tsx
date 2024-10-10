import React, { useState } from 'react';
import './css/style.css';
import 'bootstrap/dist/css/bootstrap.css';

interface Item {
  id: number;
  name: string;
  price: number;
  qty?: number;
}

const PosPage: React.FC = () => {
  const [drinks] = useState<Item[]>([
    { id: 0, name: "Still Water", price: 1 },
    { id: 1, name: "Sparkling Water", price: 1.10 },
    { id: 2, name: "Espresso", price: 1.20 },
    { id: 3, name: "Cappuccino", price: 1.30 },
    { id: 4, name: "Tea", price: 1.90 },
    { id: 5, name: "Hot Chocolate", price: 2.10 },
    { id: 6, name: "Coke", price: 2.00 },
    { id: 7, name: "Orange Juice", price: 1.90 }
  ]);

  const [foods] = useState<Item[]>([
    { id: 8, name: "Waffle", price: 1.50 },
    { id: 9, name: "Brioche", price: 1.30 },
    { id: 10, name: "Cheesecake", price: 1.70 },
    { id: 11, name: "Sandwich", price: 2.70 },
    { id: 12, name: "Donuts", price: 1.90 },
    { id: 13, name: "Tortilla", price: 1.90 }
  ]);

  const [order, setOrder] = useState<Item[]>([]);
  const [totOrders, setTotOrders] = useState(0);
  
  const getDate = () => {
    const today = new Date();
    const mm = today.getMonth() + 1;
    const dd = today.getDate();
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const addToOrder = (item: Item, qty: number) => {
    let updatedOrder = [...order];
    const existingItem = updatedOrder.find((i) => i.id === item.id);

    if (existingItem) {
      existingItem.qty = (existingItem.qty || 0) + qty;
    } else {
      item.qty = qty;
      updatedOrder.push(item);
    }
    setOrder(updatedOrder);
  };

  const removeOneEntity = (item: Item) => {
    const updatedOrder = order.map((i) => {
      if (i.id === item.id) {
        i.qty = (i.qty || 0) - 1;
      }
      return i;
    }).filter((i) => i.qty && i.qty > 0);
    setOrder(updatedOrder);
  };

  const removeItem = (item: Item) => {
    const updatedOrder = order.filter((i) => i.id !== item.id);
    setOrder(updatedOrder);
  };

  const getTotal = () => {
    return order.reduce((total, i) => total + i.price * (i.qty || 1), 0);
  };

  const clearOrder = () => {
    setOrder([]);
  };

  const checkout = () => {
    alert(`${getDate()} - Order Number: ${totOrders + 1}\n\nOrder amount: $${getTotal().toFixed(2)}\n\nPayment received. Thanks.`);
    clearOrder();
    setTotOrders(totOrders + 1);
  };

  return (
    <div className="container">
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">POS React TypeScript Demo</a>
          </div>
        </div>
      </nav>

      <div className="row">
        <div className="col-md-6">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <div className="row">
                <div className="col-md-4">Order Summary</div>
                <div className="col-md-4">Today is: {getDate()}</div>
                <div className="col-md-3 col-md-push-1">Total Orders: <span className="badge">{totOrders}</span></div>
              </div>
            </div>
            <div className="panel-body" style={{ maxHeight: '320px', overflow: 'auto' }}>
              {order.length === 0 && <div className="text-warning">Nothing ordered yet!</div>}
              <ul className="list-group">
                {order.map((item) => (
                  <li className="list-group-item" key={item.id}>
                    <div className="row">
                      <div className="col-md-1">
                        <span className="badge badge-left">{item.qty}</span>
                      </div>
                      <div className="col-md-4">{item.name}</div>
                      <div className="col-md-1">
                        <div className="label label-success">${(item.price * (item.qty || 1)).toFixed(2)}</div>
                      </div>
                      <div className="col-md-1 col-md-push-1">
                        <div className="label label-warning">${item.price.toFixed(2)}</div>
                      </div>
                      <div className="col-md-2 col-md-push-2">
                        <button className="btn btn-success btn-xs" onClick={() => addToOrder(item, 1)}>
                          <span className="glyphicon glyphicon-plus"></span>
                        </button>
                        <button className="btn btn-warning btn-xs" onClick={() => removeOneEntity(item)}>
                          <span className="glyphicon glyphicon-minus"></span>
                        </button>
                      </div>
                      <div className="col-md-1 col-md-push-2">
                        <button className="btn btn-danger btn-xs" onClick={() => removeItem(item)}>
                          <span className="glyphicon glyphicon-trash"></span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {order.length > 0 && (
              <div className="panel-footer">
                <h3>Total: ${getTotal().toFixed(2)}</h3>
                <button className="btn btn-default btn-marginTop" onClick={clearOrder}>Clear</button>
                <button className="btn btn-danger btn-marginTop" onClick={checkout}>Checkout</button>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="panel panel-primary">
            <div className="panel-body">
              <ul className="nav nav-tabs" role="tablist">
                <li className="active"><a href="#drink" role="tab" data-toggle="tab">Drinks</a></li>
                <li><a href="#food" role="tab" data-toggle="tab">Food</a></li>
              </ul>
              <div className="tab-content">
                <div role="tabpanel" className="tab-pane active" id="drink">
                  {drinks.map((drink) => (
                    <button className="btn btn-primary btn-pos btn-marginTop" key={drink.id} onClick={() => addToOrder(drink, 1)}>
                      {drink.name}
                    </button>
                  ))}
                </div>
                <div role="tabpanel" className="tab-pane" id="food">
                  {foods.map((food) => (
                    <button className="btn btn-warning btn-pos btn-marginTop" key={food.id} onClick={() => addToOrder(food, 1)}>
                      {food.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosPage;
