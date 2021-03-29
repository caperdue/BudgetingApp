<template>
  <div id="app">
    <h1>Budget Tracker</h1>
    <h3>Carly Perdue</h3>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BudgetCategory from './components/BudgetCategory.vue';
import MyExpense from './components/MyExpense.vue'
import AppLogin from './components/AppLogin.vue'
import {FirebaseFirestore} from "@firebase/firestore-types"


@Component({
  components: {
    BudgetCategory, MyExpense, AppLogin
  },
})
export default class App extends Vue {
  readonly $appDB!: FirebaseFirestore;
  private budgetCategory = "";
  private budgetLimit = 50; 

  // This function is automatically called when
  // the App component is added to the DOM tree
  mounted(): void {
  //
   
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

#top > section:nth-child(1) {
  grid-area: input;
}
#top > section:nth-child(2) {
  grid-area: expenses;
}
#top > section:nth-child(3) {
  grid-area: summary;
}
#top > :nth-child(4) {
  grid-area: donut;
}

</style>
