module.exports = {
  'G - Commit all changes and re-run Hugo': async({ CloudCmd }) => {
    const response = await fetch('/commit')
    const responseJSON = await response.json()

    if (responseJSON.ok) {
      window.location.href = '/'
    } else {
      console.error(responseJSON.error)
    }
  }
}
