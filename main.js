let tableBody = document.querySelector("tbody")
let addUser = document.querySelector(".add-user")
let popup = document.querySelector(".popup")
let addForm = document.querySelector(".add form")
let updateForm = document.querySelector(".update form")
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
      document.querySelector(".update").classList.add("active");

      let userId = edit.parentElement.parentElement.dataset.id;
      usersRef.child(userId).get().then((snapshot => {
        updateForm.name.value = snapshot.val().name;
        updateForm.phone.value = snapshot.val().phone;
        updateForm.email.value = snapshot.val().email;
      }))

      updateForm.addEventListener("submit" , (e)=> {
        e.preventDefault()
          usersRef.child(userId).update({
          name: updateForm.name.value,
          phone: updateForm.phone.value,
          email: updateForm.email.value,
        }).then((onFullFilled)=> {
          alert("Atualizado com Sucesso :)")
          document.querySelector(".update").classList.remove("active")
          updateForm.reset()
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
        alert("Excluído com Sucesso :) ");
      })
    })
  })
});

//Write Dynamic Data
addUser.addEventListener("click", ()=> {
  document.querySelector(".add").classList.add("active")
  addForm.addEventListener("submit", (e)=> {
    e.preventDefault()
    writeUserData(addForm.name.value, addForm.phone.value, addForm.email.value)
    popup.classList.remove("active")
    addForm.reset()
  })
})

//Close popup
window.addEventListener("click", (e)=> {
  if(e.target === popup)  {
    popup.classList.remove("active");
    addForm.reset()
    updateForm.reset()
  }
})