function modalAction(selector) {
  const modal = document.querySelector(selector);
  const closeBtn = modal.querySelector(".modal-close");
  modal.classList.add("open");
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
  });
}

const openRegFormBtn = document.querySelector("#open-reg-form"),
  regFormCloseBtn = document.querySelector(".modal-close");

openRegFormBtn.addEventListener("click", () => {
  modalAction("#reg-modal");
});

const createUserUrl = "https://borjomi.loremipsum.ge/api/register", //method POST  ყველა ველი სავალდებულო
  getAllUsersUrl = "https://borjomi.loremipsum.ge/api/all-users", //method GET
  getSingleUserUrl = "https://borjomi.loremipsum.ge/api/get-user/1 ", //id, method  GET
  updateUserUrl = "https://borjomi.loremipsum.ge/api/update-user/1 ", //id, method PUT
  deleteUserUrl = "https://borjomi.loremipsum.ge/api/delete-user/1"; //id, method DELETE

const regForm = document.querySelector("#reg"),
  userName = document.querySelector("#user_name"),
  userSurname = document.querySelector("#user_surname"),
  userEmail = document.querySelector("#user_email"),
  userPhone = document.querySelector("#user_phone"),
  userPersonalID = document.querySelector("#user_personal-id"),
  userZip = document.querySelector("#user_zip-code"),
  userGender = document.querySelector("#user_gender"),
  user_id = document.querySelector("#user_id"),
  userTableBody = document.querySelector("#user-rows");

const user = {
  first_name: "steso",
  last_name: "text",
  phone: "123456789",
  id_number: "12345678909",
  email: "text@gmail.com",
  gender: "male",
  zip_code: "1245",
};

function userActions() {
  const editBtns = document.querySelectorAll(".edit");
  const deleteBtns = document.querySelectorAll(".dlt");

  editBtns.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      console.log(btn.dataset.userId, "edit");

      const data = await getUser(btn.dataset.userId);
      console.log("received user data", data);

      userName.value = data.users.first_name;
      userSurname.value = data.users.last_name;
      userEmail.value = data.users.email;
      userPhone.value = data.users.phone;
      userPersonalID.value = data.users.id_number;
      userZip.value = data.users.zip_code;
      userGender.value = data.users.gender;
      user_id.value = data.users.id;

      modalAction("#reg-modal");
    });
  });

  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      console.log(btn.dataset.userId, "delete");
      const id = btn.dataset.userId;
      deleteUser(id);
    });
  });
}

function renderUsers(usersArray) {
  const userRows = usersArray.map((user) => {
    return `
						<tr>
							<td>${user.id}</td>
							<td>${user.first_name}</td>
							<td>${user.last_name}</td>
							<td>${user.email}</td>
							<td>${user.id_number}</td>
							<td>${user.phone}</td>
							<td>${user.zip_code}</td>
							<td>${user.gender}</td>
							<td>
									<button class="edit btn" type="button" data-user-id="${user.id}" data-name="satesto">Edit</button>
									<button class="dlt btn" type="button" data-user-id="${user.id}">Delete</button>
							</td>
						</tr>`;
  });

  userTableBody.innerHTML = userRows.join("");

  // userActions()
  const editBtns = document.querySelectorAll(".edit");
  const deleteBtns = document.querySelectorAll(".dlt");

  editBtns.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      console.log(btn.dataset.userId, "edit");

      // let data = await getUser(btn.dataset.userId);

      const response = await fetch(
        `https://borjomi.loremipsum.ge/api/get-user/${btn.dataset.userId}`
      );
      let data = await response.json();
      console.log("get user data", data);

      // console.log("received user data", data);

      userName.value = data.users.first_name;
      userSurname.value = data.users.last_name;
      userEmail.value = data.users.email;
      userPhone.value = data.users.phone;
      userPersonalID.value = data.users.id_number;
      userZip.value = data.users.zip_code;
      userGender.value = data.users.gender;
      user_id.value = data.users.id;

      modalAction("#reg-modal");
    });
  });

  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      console.log(btn.dataset.userId, "delete");
      const id = btn.dataset.userId;
      deleteUser(id);
    });
  });
}

async function getAllUsers() {
  try {
    const response = await fetch("https://borjomi.loremipsum.ge/api/all-users");
    const data = await response.json();
    const users = data.users;
    console.log(users);
    renderUsers(users);
  } catch (error) {
    console.log("error: ", error);
  }
}

async function deleteUser(id) {
  try {
    const response = await fetch(
      `https://borjomi.loremipsum.ge/api/delete-user/${id}`,
      {
        method: "delete",
      }
    );
    const data = await response.json();

    getAllUsers();

    console.log("delete user request", data);
  } catch (error) {
    console.log("error: ", error);
  }
}

async function getUser(id) {
  try {
    const response = await fetch(
      `https://borjomi.loremipsum.ge/api/get-user/${id}`
    );
    const data = await response.json();
    console.log("get user data", data);
    return data;
  } catch (e) {
    console.log("Error - ", e);
  }
}

async function updateUser(userObj) {
  try {
    const response = await fetch(
      `https://borjomi.loremipsum.ge/api/update-user/${userObj.id}`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userObj),
      }
    );
    const data = await response.json();
    console.log("update user request", data);

    getAllUsers();
    user_id.value = "";
    regForm.reset();
    regFormCloseBtn.click();
  } catch (error) {
    console.log("error: ", error);
  }
}

async function createUser(userObj) {
  try {
    const response = await fetch("https://borjomi.loremipsum.ge/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userObj),
    });
    const data = await response.json();
    console.log("create user: ", data);

    getAllUsers();

    regForm.reset();
    regFormCloseBtn.click();
  } catch (error) {
    console.log("err: ", error);
  }
}

getAllUsers();

regForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const userObj = {
    id: user_id.value,
    first_name: userName.value,
    last_name: userSurname.value,
    phone: userPhone.value,
    id_number: userPersonalID.value,
    email: userEmail.value,
    gender: userGender.value,
    zip_code: userZip.value,
  };

  if (userObj.id) {
    console.log("update");
    updateUser(userObj);
  } else {
    console.log("add new");
    createUser(userObj);
  }
});
