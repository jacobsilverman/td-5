let userArr = [];

function appendGallery(galleryArray){
  const galleryHTML = [];
  galleryHTML.push('<div id="gallery" class="gallery">');
  galleryArray.forEach((item, index) => {
    galleryHTML.push(`<div class="card" id=${item.id}><div class="card-img-container"><img class="card-img" src=${item.image} 
alt="profile picture"></div><div class="card-info-container"><h3 id="name" class="card-name cap">${item.name}</h3><p class="card-text">${item.email}</p><p class="card-text cap">${item.city}, ${item.state}</p></div></div>`);

  });
  galleryHTML.push('</div>');
  $('div#gallery').replaceWith(galleryHTML.join(''));
}

function appendModal(modalArray){
  const modalHTML = [];
  modalArray.forEach((item,index) => {
    let anotheruser = `<div class="modal-container" id=${item.id} style="display:none"><div class="modal"><button type="button" 
id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button><div class="modal-info-container"><img class="modal-img" src=${item.image} alt="profile picture"><h3 id="name" class="modal-name cap">${item.name}</h3><p class="modal-text">${item.email}</p><p class="modal-text cap">${item.city}</p><hr><p class="modal-text">${item.cell}</p><p class="modal-text">${item.street}, ${item.city}, ${item.state}, ${item.postcode}</p><p class="modal-text">Birthday: ${item.birth}</p></div></div><div class="modal-btn-container" id=${item.id}>`;
    if(index > 0 && index < modalArray.length-1 ){
      anotheruser = anotheruser + `<button type="button" id="modal-prev" class="modal-prev btn">Prev</button><button type="button" id="modal-next" class="modal-next btn">Next</button></div>`;
    } else if (index === 0 && modalArray.length > 1){
      anotheruser = anotheruser + `<button type="button" id="modal-next" class="modal-next btn">Next</button></div>`;
    } else if (index === modalArray.length-1 && modalArray.length > 1){
      anotheruser = anotheruser + `<button type="button" id="modal-prev" class="modal-prev btn">Prev</button></div>`;
    } else {
      anotheruser = anotheruser + '<div />';
    }
    modalHTML.push(anotheruser);
  });
  if ($('.modal-container').length){
    $('.modal-container').remove();
  }
  $('body').append(modalHTML);
}

function appendSearch(){
  $('div.search-container').append('<form action="#" method="get">' +
    '<input type="search" id="search-input"' +
    ' class="search-input" placeholder="Search...">' +
    '<input type="submit" value="&#x1F50D;" id="search-submit"' +
    ' class="search-submit"></form>');
}

$(document).on('click', '.card',function(e){
  const elId = $(e.target).closest('.card').prop('id');
  $(`.modal-container#${elId}`).show();
});

$(document).on('click', '#modal-close-btn',function(e){
  const elId = $(e.target).closest('.modal-container').prop('id');
  $(`.modal-container#${elId}`).hide();
});

$(document).on('click', '.modal-prev.btn', function(e){
  let currentArrayToNavigate = userArr;
  const currentId = $(e.target).closest('.modal-btn-container').prop('id');
  let currentIndex = currentArrayToNavigate.findIndex(obj => {
    if ((obj.id).localeCompare(currentId) === 0){
      return obj;
    }
  });
  const prevId = currentArrayToNavigate[currentIndex-1].id;
  $(`.modal-container#${currentId}`).hide();
  $(`.modal-container#${prevId}`).show();
});

$(document).on('click', '.modal-next.btn', function(e){
  let currentArrayToNavigate = userArr;
  const currentId = $(e.target).closest('.modal-btn-container').prop('id');
  let currentIndex = currentArrayToNavigate.findIndex(obj => {
    if ((obj.id).localeCompare(currentId) === 0){
      return obj;
    }
  });
  console.log(`${currentIndex} of ${currentArrayToNavigate.length-1}`);
  const nextId = currentArrayToNavigate[currentIndex+1].id;
  $(`.modal-container#${currentId}`).hide();
  $(`.modal-container#${nextId}`).show();
});

$(document).on('click','.search-submit',function(e){
  const searchString = $('#search-input').prop('value');
  userArr = userArr.filter(obj => !obj.name.toLowerCase().indexOf(searchString));
  if(userArr.length > 0){
    appendGallery(userArr);
    appendModal(userArr);
  } else if (userArr.length===0){
    $('div#gallery').replaceWith('<div id="gallery" class="gallery"><h3>No results</h3></div>');
  } else {
    console.log('should not get here either!')
  }
});

$.ajax({
  url: 'https://randomuser.me/api/?inc=picture,name,email,location,nat,dob,cell,id&&results=12&nat=gb,us',
  dataType: 'json',
  success: function(data) {
    for (const key of Object.keys(data.results)) {
      let randUser = {image:'', name:'', email:'', street: '', city: '', state:'', postcode:'', cell: '', birth:'',id:''};
      for (const key2 of Object.keys(data.results[key])) {
        switch (key2) {
          case "picture": {
            randUser.image = data.results[key][key2].large;
            break;
          }
          case "name": {
            randUser.name = `${data.results[key][key2].first} ${data.results[key][key2].last}`;
            break;
          }
          case "email": {
            randUser.email = data.results[key][key2];
            break;
          }
          case "location": {
            randUser.street = data.results[key][key2].street;
            randUser.city = data.results[key][key2].city;
            randUser.state = data.results[key][key2].state;
            randUser.postcode = data.results[key][key2].postcode;
            break;
          }
          case "dob": {
            let birth = data.results[key][key2].date;
            birth = birth.slice(0,birth.indexOf("T")).split("-");
            randUser.birth = birth[1] + '/'+ birth[2] + '/' + birth[0];
            break;
          }
          case "cell": {
            randUser.cell = data.results[key][key2];
            break;
          }
          case "id": {
            randUser.id = 'ID' + data.results[key][key2].value.replace(/[\s\-]/g,'');
            break;
          }
          default: {
            break;
          }
        }
      }
      userArr.push({image: randUser.image, name: randUser.name, email: randUser.email, street: randUser.street, city: randUser.city, state: randUser.state, postcode: randUser.postcode, cell: randUser.cell, birth: randUser.birth, id: randUser.id});
    }
    appendGallery(userArr);
    appendModal(userArr);
    appendSearch();
  }
}).catch(e => console.log('error ',e));