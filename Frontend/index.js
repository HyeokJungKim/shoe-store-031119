// Code your solution here
document.addEventListener("DOMContentLoaded", () => {

  let shoeList = document.querySelector("#shoe-list")
  let mainShoeTag = document.querySelector("#main-shoe")

  shoeList.addEventListener("click", (event) => {
    if(event.target.className === "list-group-item"){
      let id = event.target.dataset.id

      fetch(`http://localhost:3000/shoes/${id}`)
      .then(res => res.json())
      .then((shoe) => {
        renderShoe(shoe)
      })

    }
  })


  fetch("http://localhost:3000/shoes")
  .then(res => res.json())
  .then(arrayOfShoes => {

    // --  USING STRING INNER HTML
    renderShoe(arrayOfShoes[0])
    // -- END OF USING STRING INNER HTML

    // ** USING ELEMENTS FROM THE DOM

    // findElementsAndMakeAdjustments(arrayOfShoes[0])

    // ** END OF USING ELEMENTS FROM THE DOM
    arrayOfShoes.forEach((shoe) => {
      shoeList.innerHTML += listShoe(shoe)
    })
  })

  function listShoe(shoe){
    return `<li class="list-group-item" data-id="${shoe.id}">${shoe.name}</li>`
  }

  function renderShoe(shoe){
    mainShoeTag.innerHTML = createMainShoe(shoe)

    let reviewsUL = mainShoeTag.querySelector("#reviews-list")
    shoe.reviews.forEach((review) => {
      reviewsUL.innerHTML += `<li class="list-group-item">${review.content}</li>`
    })

    let form = mainShoeTag.querySelector("#new-review")
    form.addEventListener("submit", (event) => {
      event.preventDefault()
      fetch(`http://localhost:3000/shoes/${shoe.id}/reviews`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: event.target.querySelector("#review-content").value
        })
      })
      .then(res => res.json())
      .then(review => {
        reviewsUL.innerHTML += `<li class="list-group-item">${review.content}</li>`
      })
    })
  }

  function createMainShoe(shoe){
    return `<img class="card-img-top" id="shoe-image" src=${shoe.image}>
      <div class="card-body">
      <h4 class="card-title" id="shoe-name">${shoe.name}</h4>
      <p class="card-text" id="shoe-description">${shoe.description}</p>
      <p class="card-text"><small class="text-muted" id="shoe-price">${shoe.price}</small></p>
      <div class="container" id="form-container">
        <form id="new-review">
          <div class="form-group">
            <textarea class="form-control" id="review-content" rows="3"></textarea>
            <input type="submit" class="btn btn-primary"></input>
          </div>
        </form>
      </div>

      </div>
      <h5 class="card-header">Reviews</h5>
      <ul class="list-group list-group-flush" id="reviews-list">
      </ul>`
  }

  function findElementsAndMakeAdjustments(shoe){
    let shoeImg = document.getElementById('shoe-image')
    shoeImg.src = shoe.image
    let shoeName = document.querySelector('#shoe-name')
    shoeName.innerText = shoe.name
    let shoeDescription = document.getElementById('shoe-description')
    shoeDescription.innerText = shoe.description
    let shoePrice = document.getElementById('shoe-price')
    shoePrice.innerText = shoe.price
    let formContainer = document.getElementById('form-container')
    formContainer.innerHTML = `
    <form id="new-review">
      <div class="form-group">
        <textarea class="form-control" id="review-content" rows="3"></textarea>
        <input type="submit" class="btn btn-primary"></input>
      </div>
    </form>
    `
    shoe.reviews.forEach((review) => {
      document.getElementById("reviews-list").innerHTML += `<li class="list-group-item">${review.content}</li>`
    })
  }


})
