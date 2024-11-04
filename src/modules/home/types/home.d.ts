export interface User {
  id: number;
  userName: string;
  profilePhoto: String;
  totalLikes: number;
}
export type Color = "red" | "antiquewhite" | "blue"
export type Size = "XXS" | "XS" | "S" | "M" | "L" | "XL" | "XLL"
export type Gender =  "male" | "female" | "unisex"
export type Brand = "adidas" | "nike" | "gucci"
export type Material = ""

export type Filter = "date" | "state" | "season" | Gender | Color | Size | Brand | Material
export type FilterName = "date" | "state" | "season" | "gender" | "color" | "size" | "brand" | "material"

export type State = "New" | "veryGood"| "Good"| "Satisfactory"

export interface Params {
  filterName: FilterName,
  filter: Filter
}

