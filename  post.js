const API = "http://localhost:8000/Post";

// Функция для открытия модального окна
function openModal() {
  document.getElementById("myModal").style.display = "block";
}
 // Функция для переключения состояния кнопки "Лайк"

let body = document.querySelector('body')
likecouts = 0;

// Функция для закрытия модального окна
function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

function openModalEdit() {
  document.getElementById("myModalEdit").style.display = "block";
}

// Функция для закрытия модального окна
function closeModalEdit() {
  document.getElementById("myModalEdit").style.display = "none";
}
let addPostTitle = document.querySelector(".inp_add_post_title");
let addPostInfo = document.querySelector(".inp_add_post_info");
let addPostOther = document.querySelector(".inp_add_post_other");
let addPostImage = document.querySelector(".inp_add_post_image");
let addPostBtn = document.querySelector(".add_post_btn");

let searchUsers = document.querySelector(".search_users");
let searchVal = "";

// let currentPage = 1;

// pagination
let curentPage = 1;
let pageTotalCount = 1;
let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

// pagination

addPostBtn.addEventListener("click", () => {
  // if (
  //   !addPostTitle.value.trim() ||
  //   !addPostInfo.value.trim() ||
  //   !addPostOther.value.trim() ||
  //   !addPostImage.value.trim()
  // ) {
  //   alert("Заполните поля");
  //   return;
  // }

  let newPost = {
    userName: localStorage.getItem("test"),
    title: addPostTitle.value,
    info: addPostInfo.value,
    other: addPostOther.value,
    image: addPostImage.value,
  };
  addPost(newPost);

  addPostTitle.value = "";
  addPostInfo.value = "";
  addPostOther.value = "";
  addPostImage.value = "";
  document.getElementById("myModal").style.display = "none";
  render();
});
async function addPost(newPost) {
  try {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(newPost),
    });
  } catch (error) {
    console.log(error);
  }
}
//   ! READ POST
let post = document.querySelector(".post");
render();
async function render() {
  // отправка запроса для получения продуктов с сервера
  let addpost = await fetch(
    `${API}?q=${searchVal}&_page=${curentPage}&_limit=3&`
  ).then((res) => res.json());
  console.log(addPost);
  // отрисовка кнопок пагинации
  drawPaginationButton();
  post.innerHTML = "";
  // отрисовка карточек, где на каждый объект в post, рендерится одна карточка
  addpost.forEach((item) => {
    post.innerHTML += `
    <div class = 'posted'>
    <div class = 'user-info'>
    <h3 class = 'post-user'>${item.userName}</h3>
    <p class = 'post-posted'>posted</p>
    </div>
    <p class = 'post-title'>${item.title}</p>
    <p class = 'post-info'>${item.info} </p>
    <p class = 'post-other'>${item.other} </p>
    <img alt="Ссылка на фотографию неверна" src = ${item.image} class = 'post-image'/>
    <div class = 'post-options'> 
    <div class = 'post-buttons'>
    <button data-bs-toggle="modal" data-bs-target="#editModal" class="btn-edit" onclick="editPost(${item.id})">edit</button>
    <button onclick="deleteProduct(${item.id})" class="btn-delete">delete</button>
    </div>
    <div class="hurts">
    <div class ="lik">
    <img src="./hartAactive.png" alt="" class="hart" onclick="like()" style="width: 23px">
    <p class="hurt-count">${likecouts}</p>
    </div>
    <div class="comm">
    <img src="./comment.png" alt="" class="comment" onclick="comment()" style="width: 23px">
    <p class="hurt-count">${addpost.length}</p>
    </div>
    </div>
    </div>
    `;
  });
}

// !DELETE

async function deleteProduct(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  render();
}

//   !Edit

let editPostTitle = document.querySelector(".inp_edit_post_title");
let editPostInfo = document.querySelector(".inp_edit_post_info");
let editPostOther = document.querySelector(".inp_edit_post_other");
let editPostImage = document.querySelector(".inp_edit_post_image");
let editPostBtn = document.querySelector(".edit_post_btn");

// функция, которая срабатывает при нажатии на кнопку edit, принимает id того продукта, на кнопку edit которого кликнули
async function editPost(id) {
  document.getElementById("myModalEdit").style.display = "block";
  // стягиваем редактируемый продукт
  let objToEdit = await fetch(`${API}/${id}`).then((res) => res.json());

  // заполняем инпуты в модальном окне для редактирования
  editPostTitle.value = objToEdit.title;
  editPostInfo.value = objToEdit.info;
  editPostOther.value = objToEdit.other;
  editPostImage.value = objToEdit.image;

  // навесили айди на кнопку сохранения изменений
  editPostBtn.setAttribute("id", id);
}

// слушатель событий на кнопке сохранения изменений
editPostBtn.addEventListener("click", async (e) => {
  // получаем айди, который навесили выше
  let id = e.target.id;
  // проверка на заполенность инпутов при редактировании

  // собираем отредактированный продукт
  let editedPost = {
    title: editPostTitle.value,
    info: editPostInfo.value,
    other: editPostOther.value,
    image: editPostImage.value,
  };

  // отправляем PATCH запрос для сохранения изменений на сервере
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(editedPost),
  });

  closeModalEdit();
  // вызов render для того, чтобы увидеть отредактированный продукт без перезагрузки
  render();
});

//   ! SEARCH
searchUsers.addEventListener("input", () => {
  searchVal = searchUsers.value;
  render();
});



// ! pagination
// функция для отрисовки кнопок пагинации
function drawPaginationButton() {
  // стягиваем все продукты для того что бы рассчитать общее количество стрвниц которое будет в пагинации
  fetch(`${API}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      // pageTotalCount - обще кол-во страниц
      pageTotalCount = Math.ceil(data.length / 3);
      paginationList.innerHTML = ""; // очистка
      //  отрисовка кнопок пагинации. Если текущая страница (curentPage)
      //  совпадает с какой либо из отрисованных то ей присваивается класс active,
      //  для того, что понимать на какой странице, сейчас находится пользователь
      for (let i = 1; i <= pageTotalCount; i++) {
        if (curentPage == i) {
          let page = document.createElement("li");
          page.classList.add("page_num");
          page.innerHTML = `<li class="page-item active"><a class="page-link page-number" href="#">${i}</a></li>`;
          paginationList.append(page);
        } else {
          let page = document.createElement("li");
          page.classList.add("page_num");

          page.innerHTML = `
        <li class="page-item"><a class="page-link page-number" href="#">${i}</a></li>
          `;
          paginationList.append(page);
        }
      }

      // проверки на то что находится ли пользователь на
      //  первой или последней странице, если на первой, то
      //  кнопка для перехода на предыдущую страницу
      //  недоступна, если на последней, то недоступна кнопка
      //  для перехода на следущую страницу
      if (curentPage == 1) {
        prev.classList.add("disabled");
        console.log("hello");
      } else {
        prev.classList.remove("disabled");
      }

      if (curentPage == pageTotalCount) {
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}

// слушатель событий для кнопки перехода на предыдущую страницу
prev.addEventListener("click", () => {
  // проверка на то что пользователь не находится на первой странице
  if (curentPage <= 1) {
    return;
  }
  // если мы не находимся на первой странице то уменьшаем curentPage на 1
  curentPage--;
  // вызов функции render с учетом curentPage
  render();
});

// слушатель событий для перехода на следущую страницу
next.addEventListener("click", () => {
  // проверка на то что пользователь не находится на последней странице

  if (curentPage >= pageTotalCount) {
    return;
  }
  // если мы не находимся на первой странице то увеличиваем curentPage на 1

  curentPage++;
  render();
});

// слушатель событий для нумерованных кнопок пагинации
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page-number")) {
    curentPage = e.target.innerText;
    render();
  }
});
// pagination


async function like () {
 
  likecouts += 1;
  render()
}