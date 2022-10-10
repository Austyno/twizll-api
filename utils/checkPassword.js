const passwordChecker = password => {
  const checker =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
  const isValid = password.match(checker)
  return isValid
}
module.exports = passwordChecker
