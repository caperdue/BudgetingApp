<template>
  <div>
    <form>
      <table>
        <tr>
          <td align="right">Email</td>
          <td align="left"><input type="text" v-model="userEmail" /></td>
        </tr>
        <tr>
          <td align="right">Password</td>
          <td align="left"><input type="text" v-model="userPassword" /></td>
        </tr>
      </table>
    </form>
    <button :disabled="noInput" @click="createAccount">
      Sign Up
    </button>
    <button :disabled="noInput" @click="authenticate">
      Sign In
    </button>
    <div>
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { FirebaseFirestore } from "@firebase/firestore-types";
import { FirebaseAuth } from "@firebase/auth-types";

@Component
export default class UserLogin extends Vue {
  readonly $router;
  readonly $appAuth!: FirebaseAuth;
  readonly $appDB!: FirebaseFirestore;
  private userEmail = "";
  private userPassword = "";
  private message = "";

  get noInput(): boolean {
    return this.userEmail.length === 0 || this.userPassword.length === 0;
  }
  showMessage(m: string): void {
    this.message = m;
    setTimeout(() => {
      // Auto disappear after 5 seconds
      this.message = "";
    }, 5000);
  }
  createAccount(): void {
    this.$appAuth
      .createUserWithEmailAndPassword(this.userEmail, this.userPassword)
      .then((u) => {
        this.showMessage(`User create UID ${u.user?.uid}`);
        this.$router.push({ path: "/category" });
      })
      .catch((err: any) => {
        this.showMessage(`Unable to create account ${err}`);
      });
  }

  authenticate(): void {
    this.$appAuth
      .signInWithEmailAndPassword(this.userEmail, this.userPassword)
      .then((u) => {
        this.showMessage(`Login successful UID ${u.user?.uid}`);
        this.$router.push({ path: "/expenses" });
      })
      .catch((err: any) => {
        this.showMessage(`Unable to login ${err}`);
      });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
