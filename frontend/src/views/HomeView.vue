<template>
  <div class="forum">
    <div class="post">
      <PostForm @current-user="setUser"></PostForm>
    </div>
    <div class="menu-items">
      <div class="card-items">
        <div v-for="post in posts" :key="post">
          <CardItem
            :content="post.content"
            :imageUrl="post.imageUrl"
            :userName="post.user.userName"
            :date="post.date"
            :likes="post.likes"
            :id="post._id"
            :isOwner="post.user._id === currentUser.userId"
            :isAdmin="currentUser.isAdmin"
          ></CardItem>
        </div>
      </div>
    </div>
    <p class="mt-5 mb-3 text-muted">Groupomania&copy; 2022</p>
  </div>
</template>

<script>
// @ is an alias to /src
import CardItem from "../components/CardItem.vue";
import PostForm from "../components/postForm.vue";

export default {
  name: "HomeView",
  components: {
    CardItem,
    PostForm,
  },
  data() {
    return {
      posts: [],
      email: null,
      admin: false,
      userPicture: "",
      currentUser: null,
      date: null,
    };
  },
  methods: {
    setUser(user) {
      this.currentUser = user
    },
  },
  beforeCreate() {
    const token = localStorage.getItem("token");
    if (token == null) {
      this.$router.push("/login");
    }
  },

  mounted() {
    const option = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    fetch("http://localhost:3000/posts", option)
      .then((res) => res.json())
      .then((res) => {
        this.posts = res;
      })
      .catch((err) => console.log(err));
  },
};
</script>

<style scoped>


.menu-items {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  gap: 0%;
}
.post {
  margin-top: 10%;
  margin-left: 30%;
  margin-right: 30%;
}
p {
  margin-left: 2.8rem;
}
</style>
