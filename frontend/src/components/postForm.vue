<template>
  <div class="form-floating mt-3">
    <input class="form-control py-3" v-model="content" />
  </div>

  <div class="d-flex">
    <label for="file-input" class="btn btn-secondary mt-1">Ajoutez Image</label>
    <span v-if="selectedImage">{{ selectedImage.name }}</span>
    <input id="file-input" type="file" @change="handleNewFile" />
    <button @click="handleClick" type="button" class="btn btn-primary mt-1 ms-auto">Poster</button>
  </div>

  <hr class="dropdown-divider mt-4" />
</template>

<script>
export default {
  name: "PostForm",
  emits: ["currentUser"],
  data() {
    return {
      content: "",
      selectedImage: null,
      user: null,
      route: "",
    };
  },
  beforeCreate() {
    const option = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    fetch("http://localhost:3000/auth/user", option)
      .then((res) => res.json())
      .then((res) => {
        this.user = res;
        this.$emit("currentUser", this.user);
      })
      .catch((err) => console.log(err));
  },
  methods: {
    handleNewFile(e) {
      this.selectedImage = e.target.files[0]
    },
    handleClick() {
      const formData = new FormData();
      formData.append("content", this.content);
      formData.append("image", this.selectedImage);
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: formData,
      };
      fetch("http://localhost:3000/posts", options)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Erreur post");
          }
        })
        .then(() => {
          this.$router.go();
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped>
#file-input {
  display: none;
}
label {
  display: grid;
  place-content: center;
}
div span {
  margin: 1rem;
}
body {
  background-color: #5f5f5f1a !important;
}
.form-floating > div.form-control {
  height: auto;
  min-height: 5rem;
}

.form-floating > div.form-control:empty:not(:focus)::before {
  content: "Leave a comment here";
  color: #a0a0a0;
  display: block;
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
}
</style>
