<template>
  <div class="side-margin top-margin">
    <div class="row">
      <div class="col-md-12">
        <fg-input type="text"
                  label="Email"
                  placeholder="Email Address"
                  v-model="email">
        </fg-input>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <fg-input type="password"
                  label="Password"
                  placeholder="Password"
                  v-model="password">
        </fg-input>
      </div>
    </div>

    <div class="text-center">
      <button type="submit" class="btn btn-info btn-fill float-right" @click.prevent="login">
        Login
      </button>
    </div>

  </div>

</template>


<script>
import { mapGetters } from 'vuex'
export default {
  components: {

  },
  data () {
    return {
      email:'',
      password:''
    }
  },
  methods: {
    updateProfile () {
      alert('Your data: ' + JSON.stringify(this.user))
    },
    login(){
      console.log("login", this.email, this.password);
      let loginPayload = {};
      loginPayload.email = this.email;
      loginPayload.password = this.password;
      this.$store.dispatch('login',loginPayload);
    }
  }
}
</script>


<style scoped>
.side-margin{
  margin-left: 10%;
  margin-right: 10%;
}
.top-margin{
  margin-top: 5%;
}
</style>
