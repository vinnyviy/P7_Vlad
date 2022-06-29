<template>
  <div class="name g-3">
    <div class="avatar" id="avatar-img">
      <label for="file-input">
        <img src="../assets/avatardefault_92824.png" alt="image_avatar" />
      </label>
    </div>
    <div class="form">
      <input
        type="text"
        class="form-control"
        id="last-name"
        placeholder="Prénom"
        aria-label="Last name"
        v-model="userName"
      />
    </div>
    <div class="form">
      <input
        :class="this.isEmailValid ? 'is-valid' : 'is-invalid'"
        type="email"
        class="form-control"
        id="validationEmail"
        placeholder="Adresse email"
        v-model="email"
      />
      <div id="validationServerEmailFeedback" class="invalid-feedback">
        Format de l'email non valide.
      </div>
    </div>
    <div class="form">
      <input
        :class="this.isPasswordValid ? 'is-valid' : 'is-invalid'"
        type="password"
        class="form-control"
        id="validationPassword"
        placeholder="Mot de passe"
        v-model="password"
      />
      <div id="validationServerPasswordFeedback" class="invalid-feedback">
        6 caractères min.
      </div>
    </div>
  </div>
  <div class="d-flex">
    <button
      v-if="!this.isLoggedIn"
      type="submit"
      class="btn btn-primary btn-lg"
      @click.prevent="
        () => submitForm(this.userName, this.email, this.password)
      "
      :disabled="!isPasswordValid"
    >
      Enregistrer
    </button>
    <button
      v-if="this.isLoggedIn"
      type="submit"
      class="btn btn-danger btn-lg"
      @click.prevent="this.deleteUser"
      :disabled="!isPasswordValid"
    >
      Supprimer
    </button>
  </div>
  <p class="mt-5 mb-3 text-muted">Groupomania &copy; 2022</p>
</template>

<script>
import useValidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

function submitForm(userName, email, password) {
  const postData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName, email, password }),
  };
  const url = "http://localhost:3000";
  fetch(url + "/auth/user/signup", postData)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Erreur ");
      }
    })
    .then((res) => {
      this.userId = res;
      this.$router.push("/login");
    })
    .catch((err) => console.log(err));
}

export default {
  name: "AccountName",
  data() {
    return {
      v$: useValidate(),
      userName: "",
      email: "",
      password: "",
      isEmailValid: false,
      isPasswordValid: false,
      isLoggedIn: false,
      userId: "",
      error: "",
    };
  },
  methods: {
    submitFormLogin() {
      this.v$.$validate();
      if (this.v$.$error) {
        alert("Veuillez renseigner tous les champs");
      }
    },
    deleteUser() {
      const options = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      };
      fetch("http://localhost:3000/auth/user/" + this.userId, options)
        .then((res) => {
          if (res.status === 200) {
            alert("Votre compte va être supprimé!");
            return res.json();
          } else {
            throw new Error("Erreur user");
          }
        })
        .then((res) => {
          console.log(res);
          localStorage.removeItem("token");
          this.$router.push("/login");
        })
        .catch((err) => console.log(err));
    },
    submitForm,

    setEmailValidity(bool) {
      this.isEmailValid = bool;
    },
    setPasswordValidity(bool) {
      this.isPasswordValid = bool;
    },
    setUserName() {},
  },
  watch: {
    userName() {
      const userNameValue = this.userName;
      return this.setUserName(userNameValue);
    },

    email(value) {
      const emailRegExp = new RegExp(
        "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
        "g"
      );
      const isValid = emailRegExp.test(value);
      return this.setEmailValidity(isValid);
    },

    password(value) {
      const isValid = value.length > 5;
      return this.setPasswordValidity(isValid);
    },
  },

  validations() {
    return { email: { required }, password: { required } };
  },
  created() {
    const token = localStorage.getItem("token");
    if (token != null) {
      this.isLoggedIn = true;
      this.$router.replace("/login")
    }
  },
};
</script>

<style scoped>
.name {
  width: 20%;
  margin: auto;
  margin-top: 13rem;
}
.col {
  margin-top: 0.5rem;
}
.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
.form-control-dark {
  border-color: var(--bs-gray);
}
.form-control-dark:focus {
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}
p {
  display: flex;
  justify-content: center;
}
.d-flex {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 1rem;
}
.mb-3 {
  margin-top: 10rem;
}

img {
  display: block;
  margin: auto;
  width: 32%;
  top: -10rem;
  cursor: pointer;
}
.form {
  margin-top: 1rem;
}
.avatar {
  display: flex;
  align-items: center;
}
@media (max-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
  button {
    width: 130px;
  }
  .name {
    width: 70%;
    margin: auto;
    margin-top: 13rem;
  }
  img {
    display: block;
    margin: auto;
    width: 32%;
    top: -7rem;
  }
}
</style>
