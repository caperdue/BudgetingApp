<template>
  <div id="app">
    <h1>Budget Tracker</h1>
    <h3>Carly Perdue</h3>
    <router-view></router-view>
    <button v-if="userLoggedIn()" @click="doLogout">Logout</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BudgetCategory from "./components/BudgetCategory.vue";
import MyExpense from "./components/MyExpense.vue";
import AppLogin from "./components/AppLogin.vue";
import { FirebaseFirestore } from "@firebase/firestore-types";
import { FirebaseAuth } from "@firebase/auth-types";

@Component({
  components: {
    BudgetCategory,
    MyExpense,
    AppLogin,
  },
})
export default class App extends Vue {
  readonly $appDB!: FirebaseFirestore;
  readonly $appAuth!: FirebaseAuth;
readonly $router;

  // This function is automatically called when
  // the App component is added to the DOM tree
  mounted(): void {
    //
  }
  doLogout(): void {
    this.$appAuth.signOut();
    this.$router.back(); // Go backward in the "history stack"
  }
  userLoggedIn(): boolean {
    return this.$appAuth.currentUser?.uid !== undefined;
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
#top {
  display: grid;
  grid-template-columns: 2fr 3fr;
  grid-template-areas: "input summary" "donut expenses";
}


</style>
