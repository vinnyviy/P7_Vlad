<template>
  <div class="hello">
    <main class="form-signin w-100 m-auto">
      <form :class="this.submitFormLogin">
        <img
          class="mb-4"
          src="../assets/icon-above-font.png"
          alt="logo_groupomania"
          width="200"
          height="200"
        />
        <h1 class="h3 mb-3 fw-normal">Veuillez vous identifier</h1>
        <div class="form-floating">
          <input
            :class="this.isEmailValid ? 'is-valid' : 'is-invalid'"
            type="email"
            class="form-control"
            id="email"
            placeholder="name@example.com"
            v-model="email"
          />
          <label for="email">Adresse mail</label>
        </div>
        <div class="form-floating">
          <input
            :class="this.isPasswordValid ? 'is-valid' : 'is-invalid'"
            type="password"
            class="form-control"
            id="password"
            placeholder="Password"
            v-model="password"
          />
          <label for="password">Mot de passe</label>
          <div
            v-if="this.isPasswordValid || (this.isEmailValid && error)"
            class="err-msg"
          >
            {{ this.error }}
          </div>
        </div>
        <button
          class="w-100 btn btn-lg btn-danger"
          type="button"
          @click.prevent="() => submitLogin(this.email, this.password)"
          :disabled="!isPasswordValid"
        >
          S'identifier
        </button>

        <p class="mt-5 mb-3 text-muted">Groupomania&copy; 2022</p>
      </form>
    </main>
  </div>
</template>

<script>
import useValidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

function submitLogin(email, password) {
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };
  fetch("http://localhost:3000/auth/user/login", option)
    .then((res) => {
      if (res.ok) return res.json();
      res.text().then((err) => {
        const error = JSON.parse(err);
        this.error = error;
        throw new Error(error);
      });
    })
    .then((res) => {
      const token = res.token;
      localStorage.setItem("token", token);
      this.$router.go("/");
    })
    .catch((err) => {
      console.log(err);
    });
}

export default {
  name: "LoginView",
  data() {
    return {
      v$: useValidate(),
      email: "",
      password: "",
      isEmailValid: false,
      isPasswordValid: false,
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
    submitLogin,
    setEmailValidity(bool) {
      this.isEmailValid = bool;
    },
    setPasswordValidity(bool) {
      this.isPasswordValid = bool;
    },
  },
  watch: {
    email() {
      const emailRegExp = new RegExp(
        "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
        "g"
      );
      const testEmail = emailRegExp.test(this.email);
      this.setEmailValidity(testEmail);
      this.error = null;
    },

    password(value) {
      const isValid = value.length > 5;
      this.setPasswordValidity(isValid);
      this.error = null;
    },
  },
  validations() {
    return { email: { required }, password: { required } };
  },
};
</script>


<style scoped>

.hello {
  background-color: #ffd7d7 !important;
}

body {
  height: 100%;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 40px;
  background-color: #f6eded;
}
h1 {
  margin-left: 0.5rem;
}
a {
  text-decoration: none;
  color: #ffffff;
}
.form-signin {
  max-width: 330px;
  padding: 15px;
}
.mb-4 {
  margin-left: 2.5rem;
}
.form-signin .form-floating:focus-within {
  z-index: 2;
}
.err-msg {
  color: red;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
@media (max-width: 992px) {
  h1 {
    margin-left: 2rem;
  }
}
</style>
