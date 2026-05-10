export const booleanFalse = {
  type: Boolean,
  default: false
}

export const booleanTrue = {
  type: Boolean,
  default: true
}

export const stringType = {
  type: String,
  default: ''
}

export const objectType = {
  type: Object,
  default(rawProps) {
    return rawProps
  }
}

export const arrayType = {
  type: Array,
  default(rawProps) {
    return rawProps
  }
}

export const functionType = {
  type: Function,
  default(rawProps) {
    return rawProps
  }
}
