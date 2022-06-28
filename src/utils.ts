export function orderMapToArray(order: Map<string, number>): Array<number> {
  const array: Array<number> = [];
  const qty = Array.from(order.values());

  let id = 0;
  qty.forEach((pizzaQty) => {
    for (let i = 0; i < pizzaQty; i++) {
      array.push(id);
    }
    id++;
  });

  return array;
}
