<template>
  <div id="top">
    <section>
      <h1>Enter Your Spending Details</h1>
      <form>
        <table>
          <tr>
            <td align="right">Amount</td>
            <td align="left">
              <input type="number" v-model="spendingAmount" />
            </td>
          </tr>
          <tr>
            <td align="right">Date</td>
            <td align="left"><input type="date" v-model="spendingDate" /></td>
          </tr>
          <tr>
            <td align="right">Where</td>
            <td align="left"><input type="text" v-model="spendingPlace" /></td>
          </tr>
          <tr>
            <td align="right">Category</td>
            <select v-model="spendingCategory">
              <option
                v-for="(c, pos) in allCategories"
                :value="c.name"
                :key="pos"
                >{{ c.name }}</option
              >
            </select>
          </tr>
          <tr>
            <td></td>
            <button @click.prevent="addExpense">Submit</button>
          </tr>
        </table>
      </form>
    </section>
    <section>
      <h1>Expenses</h1>
      <table>
        <thead>
          <th>Date</th>
          <th>Category</th>
          <th>Place of Purchase</th>
          <th>Amount</th>
        </thead>
        <tbody>
          <tr v-for="(z, pos) in allExpenses" :key="pos">
            <td>{{ z.date }}kkkkkkk</td>
            <td>{{ z.category }}</td>
            <td>{{ z.where }}</td>
            <td>${{ z.amount }}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section>
      <h1>Spending Summary</h1>
      <table>
        <thead>
          <th>Category</th>
          <th>Total Spending</th>
          <th>Budget Limit</th>
          <th>Status</th>
        </thead>
        <tbody>
          <tr v-for="(f, po) in expenseByCategory" :key="po">
            <td>{{ f.category }}</td>
            <td>${{ f.amount }}</td>
            <td>${{ f.limit }}</td>
            <td v-if="checkIfOver(f.limit, f.amount)">OK</td>
            <td v-else>Over budget</td>
          </tr>
        </tbody>
      </table>
    </section>
    <ApexChart width="260" type="donut" :options="{
  labels: expenseByCategory.map(element => element.category),
  series: this.expenseByCategory.map(element => parseInt(element.amount))
}"></ApexChart>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { FirebaseFirestore } from "@firebase/firestore-types";
import ApexChart from "vue-apexcharts";
import {
  QuerySnapshot,
  QueryDocumentSnapshot,
} from "@firebase/firestore-types";

@Component({
  components: { ApexChart },
})
export default class MyExpense extends Vue {
  readonly $appDB!: FirebaseFirestore;
  @Prop() private spendingAmount!: number;
  @Prop() private spendingDate!: string;
  @Prop() private spendingPlace!: string;
  @Prop() private spendingCategory!: string;
  private allCategories: any[] = [];
  private allExpenses: any[] = [];
  private expenseByCategory: any[] = [];
  private groupedTotal = new Map<string, number>();

  checkIfOver(limit: number, amount: number): boolean {
    console.log(this.expenseByCategory.map(element => element.amount))
    return limit - amount < 0 ? false : true;
  }

  addExpense(): void {
    this.$appDB.collection("users/me/expenses").add({
      amount: this.spendingAmount,
      date: this.spendingDate,
      category: this.spendingCategory,
      where: this.spendingPlace,
    });
  }

  mounted(): void {
    this.$appDB
      .collection("users/me/categories")
      .orderBy("name") // Sort by category name
      .onSnapshot((qs: QuerySnapshot) => {
        this.allCategories.splice(0); // remove old data
        qs.forEach((qds: QueryDocumentSnapshot) => {
          if (qds.exists) {
            const catData = qds.data();
            this.allCategories.push({
              name: catData.name,
              limit: catData.monthlyLimit,
            });
          }
        });
      });

    this.$appDB
      .collection("users/me/expenses")
      .orderBy("date") // Sort by category name
      .onSnapshot((qs: QuerySnapshot) => {
        this.allExpenses.splice(0); // remove old data
        qs.forEach((qds: QueryDocumentSnapshot) => {
          if (qds.exists) {
            const expData = qds.data();
            this.allExpenses.push({
              amount: expData.amount,
              date: expData.date,
              category: expData.category,
              where: expData.where,
            });
          }
        });

        this.allExpenses.forEach((ex: any) => {
          console.log("RANasdlfksdjflkj");
          const { category, amount } = ex;
          if (this.groupedTotal.has(category)) {
            // This category has been recorded earlier, get the old total
            const oldTotal = this.groupedTotal.get(category) as number;
            this.groupedTotal.set(category, oldTotal + amount);
          } else {
            // This is a new category
            this.groupedTotal.set(category, amount);
          }
        });

        this.expenseByCategory.splice(0); // remove old data

        this.groupedTotal.forEach((spTotal: number, spCat: string) => {
          // locate the this category within the `allCategories` array
          const pos = this.allCategories.findIndex(
            (d: any) => d.name === spCat
          );
          this.expenseByCategory.push({
            category: spCat,
            amount: spTotal,
            limit: this.allCategories[pos].limit,
          });
        });
      });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
td,
tr,
table,
th {
  border: 1px solid black;
}
</style>
