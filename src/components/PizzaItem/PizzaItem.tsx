import { ethers } from "ethers";
import { useState } from "react";
import { Pizza } from "../PizzaMenu";
import './PizzaItem.css';

export function PizzaItem(props: {
  key: string;
  pizza: Pizza;
  increaseOrder: (pizzaId: string) => void;
  decreaseOrder: (pizzaId: string) => void;
}) {
  const [pizzaQty, setPizzaQty] = useState(0);

  const increasePizzaQty = () => {
    setPizzaQty(pizzaQty + 1);
    props.increaseOrder(props.pizza.name);
  };

  const decreasePizzaQty = () => {
    if (pizzaQty > 0) {
      setPizzaQty(pizzaQty - 1);
      props.decreaseOrder(props.pizza.name);
    }
  };

  return (
    <div className="pizza-item">
      <div className="pizza-item-image">
        <img src={props.pizza.image} alt={props.pizza.name} />
      </div>
      <div className="pizza-item-info">
        <h3>{props.pizza.name}</h3>
        <p>{props.pizza.description}</p>
        <p>{ethers.utils.formatEther(props.pizza.price)} ETH</p>
        <button onClick={decreasePizzaQty} className="pizza-remove-btn">
          -
        </button>
        <span className="pizza-counter">{pizzaQty}</span>
        <button onClick={increasePizzaQty} className="pizza-add-btn">
          +
        </button>
      </div>
    </div>
  );
}