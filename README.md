# OctoberCMS data attribute API for vuejs

Simple implementation data attribute api for vuejs.

## Usage

```js
import axios from "axios";
import OctoberApi from "vue-october-requests";

Vue.use(OctoberApi, { axios });
```

1.  using form element

```vue
<template>
  <form
    v-october:request.prevent="{
      'handler': 'onSignin',
      'onLoading': onLoading,
      'onError': onError,
      'onSuccess': onSuccess,
      'redirect': '/'
    }"
  >
    <text-input
      v-model="login"
      label="Email"
      name="login"
      placeholder="Enter your email"
    />

    <text-input
      v-model="password"
      label="Password"
      name="password"
      placeholder="Choose a password"
      type="password"
    />

    <button
      :disabled="errors.any()"
      type="submit"
    >Login</button>
  </form>
</template>

<script>
import TextInput from "./components/TextInput.vue";

export default {
  components: {
    TextInput
  },
  data() {
    return {
      login: null,
      password: null
    };
  },
  methods: {
    onLoading(success) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Login] loading", success);
      }
    },
    onError(data) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Login] error", data);
      }

      this.errors.add("password", "Wrong credentials.");
    },
    onSuccess(data) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Login] success", data);
      }
    }
  }
};
</script>
```

2.  using javascript function

```js
new Vue({
  el: "#v-app",
  methods: {
    onSubmit(input: string) {
      const formData = new FormData();

      formData.append("input", input);

      this.$october.request({
        handler: "onSubmit",
        formData
        // onLoading: onLoading,
        // onError: onError,
        // onSuccess: onSuccess,
        // redirect: "/"
      });
    }
  }
});
```
