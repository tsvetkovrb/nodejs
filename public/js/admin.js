const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  const productElement = btn.closest('article');

  fetch(`product/${productId}`, {
    method: 'DELETE',
    headers: { 'csrf-token': csrf }
  }).then(response => {
    return response.json();
  })
  .then(data => {
  console.log('TCL: data', data);
    productElement.parentNode.removeChild(productElement);
  })
  .catch(error => console.log(error))
}