export enum formType {
  input = "INPUT",
  dropdown = "DROPDOWN",
  inputField = "INPUT_FIELD",
  calendar = "CALENDAR",
  switch = "SWITCH",
}

export enum inputFieldType {
  text = "TEXT",
  number = "NUMBER",
}

export interface dropdownOptionsType {
  id: number | string;
  name: string;
}

export enum dialogType {
  confirm = "CONFIRM",
  form = "FORM",
}

export enum dialogFormType {
  addCategory = "ADD_CATEGORY",
}
