export class OrderCreatedEvent {
  id: number;
  date: string;
  subtotal: number;
  tax: number;
  total: number;
  description: string;
  type: string;
  payment: string;
  state: string;
  address: string;
  userId: number;
  personId: number;
  sequential: string;
  discount: number;
  origin: string;

  constructor(
    id: number,
    date: string,
    subtotal: number,
    tax: number,
    total: number,
    description: string,
    type: string,
    payment: string,
    state: string,
    address: string,
    userId: number,
    personId: number,
    sequential: string,
    discount: number,
    origin: string,
  ) {
    this.id = id;
    this.date = date;
    this.subtotal = subtotal;
    this.tax = tax;
    this.total = total;
    this.description = description;
    this.type = type;
    this.payment = payment;
    this.state = state;
    this.address = address;
    this.userId = userId;
    this.personId = personId;
    this.sequential = sequential;
    this.discount = discount;
    this.origin = origin;
  }
}
