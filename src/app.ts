const { MDCRipple } = require('@material/ripple')
const { firebase } = require('@firebase/app')
import '@firebase/firestore'

console.log(firebase)
const ripple = new MDCRipple(document.querySelector('.foo-button'));