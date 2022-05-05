let tableBody = document.querySelector("tbody")
let addUser = document.querySelector(".add-user")
let popup = document.querySelector(".popup")
let form = document.querySelector("form")
//Get a reference to the database service
var database = firebase.database()
var usersRef = firebase.database().ref('users/');

//Write Data
function writeUserData(name, phone, email) {
  let userId = usersRef.push().key;
    usersRef.child(userId).set({
    name: name,
    phone: phone,
    email: email,
  }).then((onFullFilled)=> {
    console.log('writed')
  },(onRejected)=>{
    console.log(onRejected)
  })
}

//Read Data
usersRef.on('value', (snapshot) => {
  const users = snapshot.val();
  tableBody.innerHTML = " ";
  for(user in users) {
    // console.log(users[user]);
    let tr = `
    <tr data-id=${user}>
      <td>${users[user].name}</td>
      <td>${users[user].phone}</td>
      <td>${users[user].email}</td>
      <td>
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
      </td>
    </tr>
    `
    tableBody.innerHTML += tr;
  }
  
  //Edit User
  let editButtons = document.querySelectorAll(".edit");
  editButtons.forEach(edit => {
    edit.addEventListener("click", ()=> {
      popup.classList.add("active");

      let userId = edit.parentElement.parentElement.dataset.id;
      usersRef.child(userId).get().then((snapshot => {
        form.name.value = snapshot.val().name;
        form.phone.value = snapshot.val().phone;
        form.email.value = snapshot.val().email;
      }))

      form.addEventListener("submit" , (e)=> {
        e.preventDefault()
          let userId = edit.parentElement.parentElement.dataset.id;
          usersRef.child(userId).update({
          name: form.name.value,
          phone: form.phone.value,
          email: form.email.value,
        }).then((onFullFilled)=> {
          alert("Atualizado com Sucesso :)")
          popup.classList.remove("active")
          form.reset()
        },(onRejected)=>{
          console.log(onRejected)
        })
      })

    })
  })
  //Delete User
  let deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach(deleteBtn=> {
    deleteBtn.addEventListener("click", ()=> {
      let userId = deleteBtn.parentElement.parentElement.dataset.id;
      usersRef.child(userId).remove().then(()=> {
        alert("Excluido com Sucesso");
      })
    })
  })
});

//Write Dynamic Data
addUser.addEventListener("click", ()=> {
  popup.classList.add("active")
  form.addEventListener("submit", (e)=> {
    e.preventDefault()
    writeUserData(form.name.value, form.phone.value, form.email.value)
    popup.classList.remove("active")
    form.reset()
  })
})

//Close popup
window.addEventListener("click", (e)=> {
  if(e.target === popup)  {
    popup.classList.remove("active")
  }
})