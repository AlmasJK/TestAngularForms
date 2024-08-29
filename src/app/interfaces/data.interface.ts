export interface IData {
  _id: string;
  isActive: boolean;
  balance: string;
  picture: string;
  age: number;
  name: {
    first: string;
    last: string;
  };
  company: string;
  email: string;
  address: string;
  tags: string[];
  favoriteFruit: string;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
