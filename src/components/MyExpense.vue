<template>
  <div id="top">
    <section>
      <router-link to="/category" replace>Add New Category</router-link>
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
            <td>{{ z.date }}</td>
            <td>{{ z.category }}</td>
            <td>{{ z.where }}</td>
            <td>${{ parseInt(z.amount).toFixed(2) }}</td>
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
            <td>${{ parseInt(f.amount).toFixed(2) }}</td>
            <td>${{ f.limit }}</td>
            <td v-if="checkIfOver(f.limit, f.amount)">OK</td>
            <td v-else>Over budget</td>
          </tr>
        </tbody>
      </table>
    </section>
    <ApexChart
      width="260"
      type="donut"
      :options="{
        labels: expenseByCategory.map((element) => element.category),
        series: this.expenseByCategory.map((element) =>
          parseInt(element.amount)
        ),
      }"
    ></ApexChart>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop} from "vue-property-decorator";
import { FirebaseFirestore } from "@firebase/firestore-types";
import ApexChart from "vue-apexcharts";
import { FirebaseAuth } from "@firebase/auth-types";

import {
  QuerySnapshot,
  QueryDocumentSnapshot,
} from "@firebase/firestore-types";

@Component({
  components: { ApexChart },
})
export default class MyExpense extends Vue {
  readonly $appAuth!: FirebaseAuth;
  readonly $appDB!: FirebaseFirestore;

  @Prop() spendingAmount!: number;
  @Prop() spendingDate!: string;
  @Prop() spendingPlace!: string;
  @Prop() spendingCategory!: string;
  private allCategories: any[] = [];
  private allExpenses: any[] = [];
  private expenseByCategory: any[] = [];
  private groupedTotal = new Map<string, number>();
  private uid = "none";

  checkIfOver(limit: number, amount: number): boolean {
    return limit - amount < 0 ? false : true;
  }

  addExpense(): void {
    this.$appDB.collection(`users/${this.uid}/expenses`).add({
      amount: this.spendingAmount,
      date: this.spendingDate,
      category: this.spendingCategory,
      where: this.spendingPlace,
    });
  }

  mounted(): void {
    this.uid = this.$appAuth.currentUser?.uid ?? "none";
    this.$appDB
      .collection(`users/${this.uid}/categories`)
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
      .collection(`users/${this.uid}/expenses`)
      .orderBy("date") // Sort by category name
      .onSnapshot((qs: QuerySnapshot) => {
        this.allExpenses.splice(0); // remove old data
        qs.forEach((qds: QueryDocumentSnapshot) => {
          if (qds.exists) {
            const expData = qds.data();
            this.allExpenses.push({
              amount: parseInt(expData.amount),
              date: expData.date,
              category: expData.category,
              where: expData.where,
            });
          }
        });

        this.allExpenses.forEach((ex: any) => {
          const { category, amount } = ex;
          const intAmount: number = amount as number;
          if (this.groupedTotal.has(category)) {
            // This category has been recorded earlier, get the old total
            const oldTotal = this.groupedTotal.get(category)
          
            if (oldTotal) {
            this.groupedTotal.set(category, (intAmount + oldTotal));
            }
          } else {
            // This is a new category
            this.groupedTotal.set(category, intAmount);
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
