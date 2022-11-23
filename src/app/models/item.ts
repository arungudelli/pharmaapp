import { Hsn } from "./hsn";
import { Manufacturer } from "./manufacturer";

export interface Item {
    id: number;
    name: string;
    description: string;
    hsn: Hsn;
    manufacturer: Manufacturer;
}