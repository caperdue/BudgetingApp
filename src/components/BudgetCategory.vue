<template>
  <div>
    <router-link to="/expenses" replace>Add Expense Details</router-link>
    <form>
  <table>
    <tr>
      <td align="right">Category</td>
      <td align="left"><input type="text" v-model="budgetCategory" /></td>
    </tr>
    <tr>
      <td align="right">Monthly Budget</td>
      <td align="left"><input type="number" v-model="budgetLimit" /></td>
    </tr>
    <tr>
        <td></td>
        <button @click.prevent="saveCategory">Submit</button> 
    </tr>
  </table>
  <table>
    <tbody>
    <tr>
        <th>Category</th>
        <th>Monthly Limit</th>
    </tr>
    <tr v-for="(z,pos) in allCategories" :key="pos">
        <td>{{z.name}}</td>
        <td>{{parseInt(z.limit).toFixed(2)}}</td>
    </tr>
    </tbody>
</table>
</form>

  </div>
</template>

<script lang="ts">
import { Component,  Vue, Prop} from 'vue-property-decorator';
import { FirebaseFirestore } from "@firebase/firestore-types"
import  { QuerySnapshot, QueryDocumentSnapshot } from '@firebase/firestore-types'
import { FirebaseAuth } from "@firebase/auth-types";

@Component
export default class BudgetCategory extends Vue {
readonly $appDB!: FirebaseFirestore;
readonly $appAuth!: FirebaseAuth;
private uid = "none"
@Prop() private budgetLimit!: number;
@Prop() private budgetCategory!: string;
private allCategories: any[] = [];

saveCategory(): void {
  
 this.$appDB
    .collection(`users/${this.uid}/categories`)
    .add({name: this.budgetCategory, monthlyLimit: this.budgetLimit})
}

mounted(): void {
  this.uid = this.$appAuth.currentUser?.uid ?? "none";
  this.$appDB
    .collection(`users/${this.uid}/categories`)
    .orderBy("name")       // Sort by category name
    .onSnapshot((qs: QuerySnapshot) => {
      this.allCategories.splice(0);  // remove old data
      qs.forEach((qds: QueryDocumentSnapshot) => {
        if (qds.exists) {
          const catData = qds.data();
          this.allCategories.push({
            name: catData.name,
            limit: parseInt(catData.monthlyLimit),
          
          });
        }
      });
    });
}

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

table {
    padding: 5px;
}
button {
    float:right;
}


</style>


