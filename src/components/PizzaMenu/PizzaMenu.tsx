import { BigNumber, ethers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import CryptoPizza from "../../abis/CryptoPizza.json";
import { CRYPTOPIZZA_CONTRACT_ADDRESS } from "../../config/constants";
import { orderMapToArray } from "../../utils";
import { PizzaItem } from "../PizzaItem/PizzaItem";
import "./PizzaMenu.css";

export type Pizza = {
  name: string;
  price: BigNumber;
  description: string;
  image: string;
};

export function PizzaMenu(props: { wallet: string }) {
  const [pizzaContract, setPizzaContract] = useState<any>(null);
  const [pizzas, setPizzas] = useState<Array<Pizza>>([]);
  const [order, setOrder] = useState<Map<string, number>>(new Map());
  const [total, setTotal] = useState<number>(0);
  const [mintingPizza, setMintingPizza] = useState(false);

  const mintPizza = (order: Map<string, number> | null) => async () => {
    try {
      if (pizzaContract && order) {
        setMintingPizza(true);
        console.log("Pizza Minting in progress...");
        const orderArray = orderMapToArray(order);
        const mintTx = await pizzaContract.mintPizza(orderArray,{value:parseEther(total.toString())});
        await mintTx.wait();
        console.log(mintTx);
        setMintingPizza(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  function calculateTotal(order: Map<string, number>) {
    let total = 0;
    order.forEach((qty, pizzaName) => {
      total +=
        qty *
        Number(
          formatEther(pizzas.find((pizza) => pizza.name === pizzaName)!.price)
        );
    });
    return Number(total.toFixed(3));
  }

  const increaseOrder = (key: string) => {
    if (order) {
      const newOrder = new Map(order);
      const pizzaQty = newOrder.get(key) || 0;
      newOrder.set(key, pizzaQty + 1);
      setOrder(newOrder);
      setTotal(calculateTotal(newOrder));
    } else {
      return;
    }
  };

  const decreaseOrder = (key: string) => {
    if (order) {
      const newOrder = new Map(order);
      const pizzaQty = newOrder.get(key) || 0;
      if (pizzaQty > 0) {
        newOrder.set(key, pizzaQty - 1);
      }
      setOrder(newOrder);
      setTotal(calculateTotal(newOrder));
    } else {
      return;
    }
  };

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const pizzaContract = new ethers.Contract(
        CRYPTOPIZZA_CONTRACT_ADDRESS,
        CryptoPizza.abi,
        signer
      );

      setPizzaContract(pizzaContract);
    } else {
      alert("Get MetaMask!");
    }
  }, []);

  useEffect(() => {
    const fetchPizzas = async () => {
      const pizzas: Array<Pizza> = await pizzaContract.getAllPizzas();
      setPizzas(pizzas);
      const order = new Map(pizzas.map((pizza) => [pizza.name, 0]));
    };

    if (pizzaContract) {
      fetchPizzas();
    }
  }, [pizzaContract]);

  return (
    <div>
      <h1>Pizza Menu</h1>
      <p style={{ fontSize: "20px" }}>Wallet connected: {props.wallet}</p>
      <div className="pizza-menu">
        {pizzas.map((pizza: Pizza) => (
          <PizzaItem
            increaseOrder={increaseOrder}
            decreaseOrder={decreaseOrder}
            key={pizza.name}
            pizza={pizza}
          />
        ))}
      </div>
      <p>Subtotal: {total} ETH</p>
      <button onClick={mintPizza(order)} className="order-pizza-btn">
        ORDER PIZZA
      </button>
    </div>
  );
}
