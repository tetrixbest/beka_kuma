const API = "http://localhost:8000/Registration";

const signInBtn = document.querySelector(".signin-btn");
const signUpBtn = document.querySelector(".singup-btn");
const formBox = document.querySelector(".form-box");
const body = document.querySelector("body");
signUpBtn.addEventListener("click", () => {
  formBox.classList.add("active");
  body.classList.add("active");
});

signInBtn.addEventListener("click", () => {
  formBox.classList.remove("active");
  body.classList.remove("active");
});

// ! CRUD
let signUpInpLogin = document.querySelector(".signup_inp_login");
let signUpInpEmail = document.querySelector(".signup_inp_email");
let signUpInpPassword = document.querySelector(".signup_inp_password");
let signUpInpPassword2 = document.querySelector(".signup_inp_password2");
let signUpBtn2 = document.querySelector(".signup_btn");

signUpBtn2.addEventListener("click", () => {
  if (
    !signUpInpLogin.value.trim() ||
    !signUpInpEmail.value.trim() ||
    !signUpInpPassword.value.trim() ||
    !signUpInpPassword2.value.trim()
  ) {
    alert("Заполните поля");
    return;
  }

  
  if (signUpInpPassword.value != signUpInpPassword2.value) {
    alert("пароли должны быть одинаковыми");
    return;
  }
  checkUser()
  let newUser = {
    login: signUpInpLogin.value,
    email: signUpInpEmail.value,
    password: signUpInpPassword.value,
    password2: signUpInpPassword2.value,
  };
  creatProduct(newUser);
  alert('Вы успешно Зарегестрировались, а теперь Войдите')
  signUpInpLogin.value = ''
  signUpInpEmail.value = ''
  signUpInpPassword.value = ''
  signUpInpPassword2.value = ''

  formBox.classList.remove("active");
  body.classList.remove("active");
});
async function creatProduct(newUser) {
  try {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(newUser),
    });
  } catch (error) {
    console.log(error);
  }
}
let signinForm = document.querySelector(".form_signin");
let signinLogin = document.querySelector(".signin_login");
let signinPassword = document.querySelector(".signin_password");
let van = document.querySelector(".signin_btn");

van.addEventListener("click", checkUser);

async function checkUser() {
  let users = await fetch(API).then((res) => res.json());
  
  let userActive = false;
  
  users.forEach((item) => {
    if (
      item.login === signinLogin.value &&
      item.password === signinPassword.value 
      ) {
        userActive = true;
        return;
      }
      
    });
    
    if (userActive) {
      // alert("yes");
      localStorage.setItem("test", signinLogin.value);
      window.location.replace("./twitter.html");
      // window.location.href = "../html/twitter.html";
    } else {
      // alert("no");
      signinLogin.style.borderBottom = "2px solid red";
      signinPassword.style.borderBottom = "2px solid red";
    }
  }
  
function checkLogin() {
  if(signUpInpLogin.value == item.login){
    alert("Такой логин уже существует");
    return
  }
}