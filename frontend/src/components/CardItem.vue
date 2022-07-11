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
        class="bi bi-pencil-square"
        v-on:click="is_modified = true"
      ></i>
      <i
        v-if="isOwner || isAdmin"
        class="bi bi-trash"
        @click="() => deletePost(id)"
      ></i>
      <span id="like">
            <a v-on:click="likePost">
              <i class="fa-solid fa-thumbs-up" :style="thumb_color"></i>
            </a>
            <p>{{ updatable_likes }}</p>
          </span>
    </div>
    <img :src="imageUrl" class="card-img-top" alt="" />
    <div class="card-body">
      
      <div v-if="!is_modified" class="message">
      <p>{{ content }}</p>
      <img id="image" :src="image" />
    </div>
    <textarea
      v-if="is_modified"
      name="message"
      id="message"
      class="message"
      placeholder="Votre message :"
      v-model="updatable_content"
    ></textarea>
    <button
       
        v-if="is_modified "
        type="submit"
        v-on:click="modifyPost" 
        @click="reloadPage"
      >
        Enregistrer
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardItem",
  
  data() {
    return {
      is_modified: false,
      updatable_content: "",
      updatable_likes: 0,
      thumb_color: "color: white;",
    };
  },
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
    likes: Number,
    user: String,
    date: String,
  },
  created() {
    this.updatable_content = this.content;
    this.updatable_likes = this.likes;
    
    this.isLiked();
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
    

    modifyPost() {
      fetch(
        "http://localhost:3000/posts/" + this.id, 
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },

          body: JSON.stringify({
            content: this.updatable_content,
          }),
        }
      )
        .then(function (res) {
          if (res.ok) {
            return res.json();
          }
        })

        .then(() => {
          this.is_modified = false;
          this.$parent.posts.find((post) => post.id == this.id).content =
            this.updatable_content;
        })

        .catch(function (err) {
          console.error(err);
        });
    },
    reloadPage() {
      window.location.reload();},

    likePost() {
      fetch("http://localhost:3000/posts/like/" + this.id, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(
          
          {
            userId: localStorage.getItem("user-id"),
            postId: this.id,
          }
        ),
      })
        .then(function (res) {
          if (res.ok) {
            return res.json();
          }
        })
        .then((value) => {
          this.updatable_likes = value.likes;
          this.isLiked();
        })
        .catch(function (err) {
          console.error(err);
        });
    },
    
    isLiked() {
      fetch(
        "http://localhost:3000/posts/like/" + this.id, 
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
        .then(function (res) {
          if (res.ok) {
            return res.json();
          }
        })
        
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
  margin-left: 8rem;
}
i.bi-pencil-square {
  margin-left: 1.5rem;
}
i.bi-pencil-square:hover {
  color: blue;
  cursor: pointer;
}
i.bi-trash:hover {
  color: red;
  cursor: pointer;
}

#like {
  display: flex;
  flex-direction: row;
  width: 100px;
  justify-content: space-around;
  margin-left: 70%;
  align-items: center;
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
    margin-left: 3rem;
  }
}
</style>
