<template>
  <div class="card">
    <div class="card-header">
      <img
        src="https://www.xeus.com/wp-content/uploads/2014/09/One_User_Orange.png"
        class="rounded-circle"
        alt="Avatar"
      />
      <span class="user-name">{{ userName }}</span>
      <span class="post-date"
        >Posté le {{ date.split("T")[0].split("-").reverse().join("/") }}</span
      >
      <i
        v-if="isOwner || isAdmin"
        class="bi bi-trash"
        @click="() => deletePost(id)"
      ></i>
    </div>
    <img :src="imageUrl" class="card-img-top" alt="#" />
    <div class="card-body">
      <p class="content">{{ content }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardItem",
  components: {},
  props: {
    userName: {
      type: String,
      default: "visitor",
    },
    content: String,
    imageUrl: String,
    id: String,
    isOwner: Boolean,
    isAdmin: Boolean,
    date: String,
  },
  methods: {
    deletePost(id) {
      const options = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      };
      fetch("http://localhost:3000/posts/" + id, options)
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw new Error("Erreur post");
          }
        })
        .then((res) => {
          console.log(res);
          this.$router.go();
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped>
.card {
  margin-top: 2.5rem;
  box-shadow: 0 0 7px rgb(88, 84, 198);
  width: 30rem;
}
.user-name {
  font-weight: bold;
  margin-left: 0.5rem;
}
.card-img-top {
  background-size: cover;
}
p {
  font-size: larger;
}
.card-header {
  background-color: rgb(221, 216, 216);
}
.card-header img {
  width: 50px;
}
.post-date {
  margin-left: 0.5rem;
}
.card-body {
  border-top: 1px solid;
}
.chat {
  margin-left: 1.5rem;
}
input {
  width: 50%;
  height: 50%;
}
.btn {
  width: 25%;
  height: 20%;
}
i.bi-trash {
  margin-left: 8.5rem;
}
i.bi-trash:hover {
  color: red;
  cursor: pointer;
}
.card-remark {
  display: flex;
  margin-left: 1rem;
  gap: 1%;
}
@media (max-width: 992px) {
  .card {
    width: 24rem;
  }
  .card-header img {
    width: 30px;
  }
  .btn {
    width: 28%;
    height: 1%;
  }
  input {
    width: 50%;
    height: 40%;
  }
  i.bi-trash {
    margin-left: 4rem;
  }
}
</style>
